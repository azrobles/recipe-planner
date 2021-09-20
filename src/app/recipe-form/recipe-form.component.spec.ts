import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { AppRoutingModule } from '../app-routing.module';
import { Difficulty } from '../models/difficulty.model';
import { Location } from '../models/location.model';
import { RecipeType } from '../models/recipe-type.model';
import { Recipe } from '../models/recipe.model';
import { Season } from '../models/season.model';
import { DifficultyService } from '../services/difficulty.service';
import { LocationService } from '../services/location.service';
import { RecipeTypeService } from '../services/recipe-type.service';
import { RecipeService } from '../services/recipe.service';
import { SeasonService } from '../services/season.service';

import { RecipeFormComponent } from './recipe-form.component';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let component: RecipeFormComponent;
let fixture: ComponentFixture<RecipeFormComponent>;
let page: Page;
let testLocations: Location[];
let testTypes: RecipeType[];
let testSeasons: Season[];
let testDifficulties: Difficulty[];
let testRecipe: Recipe;

////// Tests //////
describe('RecipeFormComponent', () => {
  beforeEach(async () => {
    const locationServiceSpy = jasmine.createSpyObj('LocationService',
      ['getLocations']);
    const typeServiceSpy = jasmine.createSpyObj('RecipeTypeService',
      ['getRecipeTypes']);
    const seasonServiceSpy = jasmine.createSpyObj('SeasonService',
      ['getSeasons']);
    const difficultyServiceSpy = jasmine.createSpyObj('DifficultyService',
      ['getDifficulties']);
    const recipeServiceSpy = jasmine.createSpyObj('RecipeService',
      ['clearRecipe', 'addRecipe', 'getRecipe',
      'updateRecipe', 'deleteRecipe']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [ RecipeFormComponent ],
      imports: [ AppRoutingModule, NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: RecipeTypeService, useValue: typeServiceSpy },
        { provide: SeasonService, useValue: seasonServiceSpy },
        { provide: DifficultyService, useValue: difficultyServiceSpy },
        { provide: RecipeService, useValue: recipeServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  });

  describe('when navigate with no recipe id', () => {
    beforeEach(() => {
      testLocations = [{id: 1, name: 'Test Data'}];
      testTypes = [{id: 1, name: 'Test Data'}];
      testSeasons = [{id: 1, name: 'Test Data'}];
      testDifficulties = [{id: 1, name: 'Test Data'}];
      testRecipe = { id: undefined, name: '',
        location: { id: undefined, name: '' },
        type: { id: undefined, name: '' },
        season: { id: undefined, name: '' },
        difficulty: { id: undefined, name: '' },
        frequency: 0
      };
      activatedRoute.setParamMap({ id: testRecipe.id });
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate when click cancel', () => {
      page.cancelBtn.click();

      expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/recipes'], 'should nav to RecipeList');
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be true', () => {
      expect(component.isAddMode).toBe(true);
    });

    it('should have called `getLocations`', () => {
      expect(page.getLocationsSpy.calls.count()).toBe(1, 'getLocations called once');
      expect(page.locationSelect.options.length).toBe(testLocations.length);
    });

    it('should have called `getTypes`', () => {
      expect(page.getTypesSpy.calls.count()).toBe(1, 'getTypes called once');
      expect(page.typeSelect.options.length).toBe(testTypes.length);
    });

    it('should have called `getSeasons`', () => {
      expect(page.getSeasonsSpy.calls.count()).toBe(1, 'getSeasons called once');
      expect(page.seasonSelect.options.length).toBe(testSeasons.length);
    });

    it('should have called `getDifficulties`', () => {
      expect(page.getDifficultiesSpy.calls.count()).toBe(1, 'getDifficulties called once');
      expect(page.difficultySelect.options.length).toBe(testDifficulties.length);
    });

    it('should have called `clearRecipe`', () => {
      expect(page.clearRecipeSpy.calls.count()).toBe(1, 'clearRecipe called once');
    });

    it('should display empty recipe', () => {
      expect(page.nameInput.value).toBe(testRecipe.name);
      expect(page.nameInput.value).toBeFalsy();

      expect(page.locationSelect.selectedIndex).toBe(-1);

      expect(page.typeSelect.selectedIndex).toBe(-1);

      expect(page.seasonSelect.selectedIndex).toBe(-1);

      expect(page.difficultySelect.selectedIndex).toBe(-1);
    });

    it('should not display error message', () => {
      expect(page.errorMessage).toBeNull('should not display error element');
    });

    it('should not display delete button', () => {
      expect(page.deleteBtn).toBeNull('should not display delete button');
    });

    it('should reset form when click reset', () => {
      component.ingredientForm = jasmine.createSpyObj('RecipeIngredientQuantityFormComponent',
        ['addIngredientQuantities', 'onReset']);

      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.resetBtn.click();

      expect(page.nameInput.value).toBe(testRecipe.name);
      expect(page.nameInput.value).toBeFalsy();
      expect(component.ingredientForm.onReset).toHaveBeenCalled();
    });

    it('should add and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.locationSelect.value = page.locationSelect.options[0].value;
      page.locationSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.typeSelect.value = page.typeSelect.options[0].value;
      page.typeSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.seasonSelect.value = page.seasonSelect.options[0].value;
      page.seasonSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.difficultySelect.value = page.difficultySelect.options[0].value;
      page.difficultySelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.addRecipeSpy.calls.any()).toBe(true, 'addRecipe called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/recipes'], 'should nav to RecipeList');
    }));

    it('should display error when add recipe fails', fakeAsync(() => {
      page.addRecipeSpy.and
        .returnValue(throwError('RecipeService test failure'));

      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.locationSelect.value = page.locationSelect.options[0].value;
      page.locationSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.typeSelect.value = page.typeSelect.options[0].value;
      page.typeSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.seasonSelect.value = page.seasonSelect.options[0].value;
      page.seasonSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.difficultySelect.value = page.difficultySelect.options[0].value;
      page.difficultySelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.submitBtn.click();

      tick();

      fixture.detectChanges();

      expect(component.loading).toBe(false);
      expect(page.errorMessage).toMatch(/test failure/, 'should display error');
      expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    }));
  });

  describe('when navigate to existing recipe', () => {
    beforeEach(() => {
      testLocations = [{id: 1, name: 'Test Data'}];
      testTypes = [{id: 1, name: 'Test Data'}];
      testSeasons = [{id: 1, name: 'Test Data'}];
      testDifficulties = [{id: 1, name: 'Test Data'}];
      testRecipe = { id: 1, name: 'A',
        location: testLocations[0],
        type: testTypes[0],
        season: testSeasons[0],
        difficulty: testDifficulties[0],
        frequency: 0
      };
      activatedRoute.setParamMap({ id: testRecipe.id });
      createComponent();
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be false', () => {
      expect(component.isAddMode).toBe(false);
    });

    it('should have called `getRecipe`', () => {
      expect(page.getRecipeSpy.calls.count()).toBe(1, 'getRecipe called once');
    });

    it('should display that recipe', () => {
      expect(page.nameInput.value).toBe(testRecipe.name);
      expect(page.nameInput.value).toBeTruthy();

      expect(page.locationSelect.options[page.locationSelect.selectedIndex].label)
        .toBe(testRecipe.location.name);

      expect(page.typeSelect.options[page.typeSelect.selectedIndex].label)
        .toBe(testRecipe.type.name);

      expect(page.seasonSelect.options[page.seasonSelect.selectedIndex].label)
        .toBe(testRecipe.season.name);

      expect(page.difficultySelect.options[page.difficultySelect.selectedIndex].label)
        .toBe(testRecipe.difficulty.name);
    });

    it('should not display error message', () => {
      expect(page.errorMessage).toBeNull('should not display error element');
    });

    it('should display delete button', () => {
      expect(page.deleteBtn).toBeTruthy('should display delete button');
    });

    it('should reset form when click reset', () => {
      component.ingredientForm = jasmine.createSpyObj('RecipeIngredientQuantityFormComponent',
        ['addIngredientQuantities', 'onReset']);

      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.resetBtn.click();

      expect(page.nameInput.value).toBe(testRecipe.name);
      expect(page.nameInput.value).toBeTruthy();
      expect(component.ingredientForm.onReset).toHaveBeenCalled();
    });

    it('should update and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.updateRecipeSpy.calls.any()).toBe(true, 'updateRecipe called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/recipes'], 'should nav to RecipeList');
    }));

    it('should display error when update recipe fails', fakeAsync(() => {
      page.updateRecipeSpy.and
        .returnValue(throwError('RecipeService test failure'));

      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      tick();

      fixture.detectChanges();

      expect(component.loading).toBe(false);
      expect(page.errorMessage).toMatch(/test failure/, 'should display error');
      expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    }));

    it('should delete and navigate when click delete', fakeAsync(() => {
      page.deleteBtn.click();

      expect(component.loading).toBe(true);
      expect(page.deleteRecipeSpy.calls.any()).toBe(true, 'deleteRecipe called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/recipes'], 'should nav to RecipeList');
    }));

    it('should display error when delete recipe fails', fakeAsync(() => {
      page.deleteRecipeSpy.and
        .returnValue(throwError('RecipeService test failure'));

      page.deleteBtn.click();

      tick();

      fixture.detectChanges();

      expect(component.loading).toBe(false);
      expect(page.errorMessage).toMatch(/test failure/, 'should display error');
      expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    }));
  });
});

/////////// Helpers /////
function createComponent() {
  fixture = TestBed.createComponent(RecipeFormComponent);
  component = fixture.componentInstance;
  page = new Page(fixture);

  component.ingredientForm = jasmine.createSpyObj('RecipeIngredientQuantityFormComponent',
    ['addIngredientQuantities', 'onReset']);

  fixture.detectChanges();
}

class Page {
  get deleteBtn() {
    return this.query<HTMLButtonElement>('.btn-danger');
  }
  get cancelBtn() {
    return this.query<HTMLButtonElement>('[type="button"]');
  }
  get resetBtn() {
    return this.query<HTMLButtonElement>('[type="reset"]');
  }
  get submitBtn() {
    return this.query<HTMLButtonElement>('[type="submit"]');
  }
  get nameInput() {
    return this.query<HTMLInputElement>('#nameInput');
  }
  get locationSelect() {
    return this.query<HTMLSelectElement>('#locationSelect');
  }
  get typeSelect() {
    return this.query<HTMLSelectElement>('#typeSelect');
  }
  get seasonSelect() {
    return this.query<HTMLSelectElement>('#seasonSelect');
  }
  get difficultySelect() {
    return this.query<HTMLSelectElement>('#difficultySelect');
  }
  get errorMessage() {
    const el = this.query<HTMLElement>('[type="danger"]');
    return el ? el.textContent : null;
  }

  getLocationsSpy: jasmine.Spy;
  getTypesSpy: jasmine.Spy;
  getSeasonsSpy: jasmine.Spy;
  getDifficultiesSpy: jasmine.Spy;
  clearRecipeSpy: jasmine.Spy;
  addRecipeSpy: jasmine.Spy;
  getRecipeSpy: jasmine.Spy;
  updateRecipeSpy: jasmine.Spy;
  deleteRecipeSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<RecipeFormComponent>) {
    const locationServiceSpy = someFixture.debugElement.injector.get(LocationService) as any;
    this.getLocationsSpy = locationServiceSpy.getLocations.and
      .returnValue(of(testLocations));

    const typeServiceSpy = someFixture.debugElement.injector.get(RecipeTypeService) as any;
    this.getTypesSpy = typeServiceSpy.getRecipeTypes.and
      .returnValue(of(testTypes));

    const seasonServiceSpy = someFixture.debugElement.injector.get(SeasonService) as any;
    this.getSeasonsSpy = seasonServiceSpy.getSeasons.and
      .returnValue(of(testSeasons));

    const difficultyServiceSpy = someFixture.debugElement.injector.get(DifficultyService) as any;
    this.getDifficultiesSpy = difficultyServiceSpy.getDifficulties.and
      .returnValue(of(testDifficulties));

    const recipeServiceSpy = someFixture.debugElement.injector.get(RecipeService) as any;
    this.clearRecipeSpy = recipeServiceSpy.clearRecipe.and
      .returnValue(testRecipe);
    this.addRecipeSpy = recipeServiceSpy.addRecipe.and
      .returnValue(of(testRecipe));
    this.getRecipeSpy = recipeServiceSpy.getRecipe.and
      .returnValue(of(testRecipe));
    this.updateRecipeSpy = recipeServiceSpy.updateRecipe.and
      .returnValue(of(testRecipe));
    this.deleteRecipeSpy = recipeServiceSpy.deleteRecipe.and
      .returnValue(of(testRecipe));

    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
