import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { AppRoutingModule } from '../app-routing.module';
import { RecipeType } from '../models/recipe-type.model';
import { RecipeTypeService } from '../services/recipe-type.service';

import { RecipeTypeFormComponent } from './recipe-type-form.component';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let component: RecipeTypeFormComponent;
let fixture: ComponentFixture<RecipeTypeFormComponent>;
let page: Page;
let testRecipeType: RecipeType;

////// Tests //////
describe('RecipeTypeFormComponent', () => {
  beforeEach(async () => {
    const recipeTypeServiceSpy = jasmine.createSpyObj('RecipeTypeService',
      ['clearRecipeType', 'addRecipeType', 'getRecipeType',
      'updateRecipeType', 'deleteRecipeType']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [ RecipeTypeFormComponent ],
      imports: [ AppRoutingModule, NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: RecipeTypeService, useValue: recipeTypeServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  });

  describe('when navigate with no recipe type id', () => {
    beforeEach(() => {
      testRecipeType = { id: undefined, name: '' };
      activatedRoute.setParamMap({ id: testRecipeType.id });
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate when click cancel', () => {
      page.cancelBtn.click();

      expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/recipetypes'], 'should nav to RecipeTypeList');
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be true', () => {
      expect(component.isAddMode).toBe(true);
    });

    it('should have called `clearRecipeType`', () => {
      expect(page.clearRecipeTypeSpy.calls.count()).toBe(1, 'clearRecipeType called once');
    });

    it('should display empty recipe type name', () => {
      expect(page.nameInput.value).toBe(testRecipeType.name);
      expect(page.nameInput.value).toBeFalsy();
    });

    it('should not display error message', () => {
      expect(page.errorMessage).toBeNull('should not display error element');
    });

    it('should not display delete button', () => {
      expect(page.deleteBtn).toBeNull('should not display delete button');
    });

    it('should reset form when click reset', () => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.resetBtn.click();

      expect(page.nameInput.value).toBe(testRecipeType.name);
      expect(page.nameInput.value).toBeFalsy();
    });

    it('should add and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.addRecipeTypeSpy.calls.any()).toBe(true, 'addRecipeType called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/recipetypes'], 'should nav to RecipeTypeList');
    }));

    it('should display error when add recipe type fails', fakeAsync(() => {
      page.addRecipeTypeSpy.and
        .returnValue(throwError('RecipeTypeService test failure'));

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
  });

  describe('when navigate to existing recipe type', () => {
    beforeEach(() => {
      testRecipeType = { id: 1, name: 'A' };
      activatedRoute.setParamMap({ id: testRecipeType.id });
      createComponent();
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be false', () => {
      expect(component.isAddMode).toBe(false);
    });

    it('should have called `getRecipeType`', () => {
      expect(page.getRecipeTypeSpy.calls.count()).toBe(1, 'getRecipeType called once');
    });

    it('should display that recipe type name', () => {
      expect(page.nameInput.value).toBe(testRecipeType.name);
      expect(page.nameInput.value).toBeTruthy();
    });

    it('should not display error message', () => {
      expect(page.errorMessage).toBeNull('should not display error element');
    });

    it('should display delete button', () => {
      expect(page.deleteBtn).toBeTruthy('should display delete button');
    });

    it('should reset form when click reset', () => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.resetBtn.click();

      expect(page.nameInput.value).toBe(testRecipeType.name);
      expect(page.nameInput.value).toBeTruthy();
    });

    it('should update and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.updateRecipeTypeSpy.calls.any()).toBe(true, 'updateRecipeType called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/recipetypes'], 'should nav to RecipeTypeList');
    }));

    it('should display error when update recipe type fails', fakeAsync(() => {
      page.updateRecipeTypeSpy.and
        .returnValue(throwError('RecipeTypeService test failure'));

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
      expect(page.deleteRecipeTypeSpy.calls.any()).toBe(true, 'deleteRecipeType called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/recipetypes'], 'should nav to RecipeTypeList');
    }));

    it('should display error when delete recipe type fails', fakeAsync(() => {
      page.deleteRecipeTypeSpy.and
        .returnValue(throwError('RecipeTypeService test failure'));

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
  fixture = TestBed.createComponent(RecipeTypeFormComponent);
  component = fixture.componentInstance;
  page = new Page(fixture);

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
  get errorMessage() {
    const el = this.query<HTMLElement>('[type="danger"]');
    return el ? el.textContent : null;
  }

  clearRecipeTypeSpy: jasmine.Spy;
  addRecipeTypeSpy: jasmine.Spy;
  getRecipeTypeSpy: jasmine.Spy;
  updateRecipeTypeSpy: jasmine.Spy;
  deleteRecipeTypeSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<RecipeTypeFormComponent>) {
    const recipeTypeServiceSpy = someFixture.debugElement.injector.get(RecipeTypeService) as any;
    this.clearRecipeTypeSpy = recipeTypeServiceSpy.clearRecipeType.and
      .returnValue(testRecipeType);
    this.addRecipeTypeSpy = recipeTypeServiceSpy.addRecipeType.and
      .returnValue(of(testRecipeType));
    this.getRecipeTypeSpy = recipeTypeServiceSpy.getRecipeType.and
      .returnValue(of(testRecipeType));
    this.updateRecipeTypeSpy = recipeTypeServiceSpy.updateRecipeType.and
      .returnValue(of(testRecipeType));
    this.deleteRecipeTypeSpy = recipeTypeServiceSpy.deleteRecipeType.and
      .returnValue(of(testRecipeType));

    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
