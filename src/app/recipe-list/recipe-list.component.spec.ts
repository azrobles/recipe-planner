import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';

import { RecipeListComponent } from './recipe-list.component';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let getRecipesSpy: jasmine.Spy;
  let testRecipes: Recipe[];

  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('[type="danger"]');
    return el ? el.textContent : null;
  };

  beforeEach(async () => {
    testRecipes = [{id: 1, name: 'Test Data', location: { name: '' },
      type: { name: '' }, season: { name: '' }, difficulty: { name: '' },
      frequency: 1, ingredients: []}];

    const recipeService = jasmine.createSpyObj('RecipeService',
      ['clearRecipe', 'getRecipes']);
    recipeService.clearRecipe.and.returnValue(of(testRecipes[0]));
    getRecipesSpy = recipeService.getRecipes.and
      .returnValue(of(testRecipes));

    await TestBed.configureTestingModule({
      declarations: [ RecipeListComponent ],
      imports: [ NgbModule ],
      providers: [
        { provide: RecipeService, useValue: recipeService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show recipes before OnInit', () => {
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
    expect(errorMessage()).toBeNull('should not show error element');
    expect(getRecipesSpy.calls.any())
      .toBe(false, 'getRecipes not yet called');
  });

  it('should show recipes after component initialized', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table>tbody>tr>th:nth-of-type(1)').textContent)
      .toBe(testRecipes[0].id + '');
    expect(fixture.nativeElement.querySelector('table>tbody>tr>td:nth-of-type(1)').textContent)
      .toBe(testRecipes[0].name);
    expect(getRecipesSpy.calls.any()).toBe(true, 'getRecipes called');
  });

  it('should display error when RecipeService fails', fakeAsync(() => {
    getRecipesSpy.and
      .returnValue(throwError('RecipeService test failure'));

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    expect(errorMessage()).toMatch(/test failure/, 'should display error');
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
  }));

});
