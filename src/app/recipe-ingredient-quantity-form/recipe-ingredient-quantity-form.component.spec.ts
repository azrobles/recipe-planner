import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { MeasureUnit } from '../models/measure-unit.model';
import { RecipeIngredient } from '../models/recipe-ingredient.model';
import { IngredientService } from '../services/ingredient.service';
import { MeasureUnitService } from '../services/measure-unit.service';
import { RecipeService } from '../services/recipe.service';

import { RecipeIngredientQuantityFormComponent } from './recipe-ingredient-quantity-form.component';

////// Testing Vars //////
let component: RecipeIngredientQuantityFormComponent;
let fixture: ComponentFixture<RecipeIngredientQuantityFormComponent>;
let page: Page;
let testIngredient: Ingredient;
let testIngredients: Ingredient[];
let testMeasureUnits: MeasureUnit[];
let testRecipeIngredient: RecipeIngredient;

////// Tests //////
describe('RecipeIngredientQuantityFormComponent', () => {
  beforeEach(async () => {
    const ingredientServiceSpy = jasmine.createSpyObj('IngredientService',
      ['clearIngredient', 'getIngredients']);
    const measureUnitServiceSpy = jasmine.createSpyObj('MeasureUnitService',
      ['getMeasureUnits']);
    const recipeServiceSpy = jasmine.createSpyObj('RecipeService',
      ['clearRecipeIngredient']);

    await TestBed.configureTestingModule({
      declarations: [ RecipeIngredientQuantityFormComponent ],
      imports: [ NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: IngredientService, useValue: ingredientServiceSpy },
        { provide: MeasureUnitService, useValue: measureUnitServiceSpy },
        { provide: RecipeService, useValue: recipeServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    testIngredient = { id: undefined, name: '',
      availability: { id: undefined, name: '' },
      supermarket: { id: undefined, name: '' }
    };
    testIngredients = [testIngredient];
    testMeasureUnits = [{id: 1, name: 'Test Data'}];
    testRecipeIngredient = { id: undefined,
      ingredient: testIngredient,
      amount: 0,
      measureUnit: { id: undefined, name: '' },
      optional: false
    };
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/////////// Helpers /////
function createComponent() {
  fixture = TestBed.createComponent(RecipeIngredientQuantityFormComponent);
  component = fixture.componentInstance;
  page = new Page(fixture);

  component.form = new FormGroup({});

  fixture.detectChanges();
}

class Page {
  get addBtn() {
    return this.query<HTMLButtonElement>('.btn-primary');
  }
  get deleteBtn() {
    return this.query<HTMLButtonElement>('.btn-secondary');
  }
  get ingredientSelect0() {
    return this.query<HTMLSelectElement>('#ingredient-0');
  }
  get amountInput0() {
    return this.query<HTMLInputElement>('#amount-0');
  }
  get measureUnitSelect0() {
    return this.query<HTMLSelectElement>('#measureUnit-0');
  }
  get optionalCheckbox0() {
    return this.query<HTMLSelectElement>('#optional-0');
  }

  clearIngredientSpy: jasmine.Spy;
  getIngredientsSpy: jasmine.Spy;
  getMeasureUnitsSpy: jasmine.Spy;
  clearRecipeIngredientSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<RecipeIngredientQuantityFormComponent>) {
    const ingredientServiceSpy = someFixture.debugElement.injector.get(IngredientService) as any;
    this.clearIngredientSpy = ingredientServiceSpy.clearIngredient.and
    .returnValue(of(testIngredient));
    this.getIngredientsSpy = ingredientServiceSpy.getIngredients.and
      .returnValue(of(testIngredients));

    const measureUnitServiceSpy = someFixture.debugElement.injector.get(MeasureUnitService) as any;
    this.getMeasureUnitsSpy = measureUnitServiceSpy.getMeasureUnits.and
      .returnValue(of(testMeasureUnits));

    const recipeServiceSpy = someFixture.debugElement.injector.get(RecipeService) as any;
    this.clearRecipeIngredientSpy = recipeServiceSpy.clearRecipeIngredient.and
      .returnValue(testRecipeIngredient);
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
