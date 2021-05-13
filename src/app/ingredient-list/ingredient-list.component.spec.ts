import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { IngredientService } from '../services/ingredient.service';

import { IngredientListComponent } from './ingredient-list.component';

describe('IngredientListComponent', () => {
  let component: IngredientListComponent;
  let fixture: ComponentFixture<IngredientListComponent>;
  let getIngredientsSpy: jasmine.Spy;
  let testIngredients: Ingredient[];

  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('[type="danger"]');
    return el ? el.textContent : null;
  };

  beforeEach(async () => {
    testIngredients = [{id: 1, name: 'Test Data', availability: { name: '' },
      supermarket: { name: '' }}];

    const ingredientService = jasmine.createSpyObj('IngredientService',
      ['clearIngredient', 'getIngredients']);
    ingredientService.clearIngredient.and.returnValue(of(testIngredients[0]));
    getIngredientsSpy = ingredientService.getIngredients.and
      .returnValue(of(testIngredients));

    await TestBed.configureTestingModule({
      declarations: [ IngredientListComponent ],
      imports: [ NgbModule ],
      providers: [
        { provide: IngredientService, useValue: ingredientService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show ingredients before OnInit', () => {
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
    expect(errorMessage()).toBeNull('should not show error element');
    expect(getIngredientsSpy.calls.any())
      .toBe(false, 'getIngredients not yet called');
  });

  it('should show ingredients after component initialized', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table>tbody>tr>th:nth-of-type(1)').textContent)
      .toBe(testIngredients[0].id + '');
    expect(fixture.nativeElement.querySelector('table>tbody>tr>td:nth-of-type(1)').textContent)
      .toBe(testIngredients[0].name);
    expect(getIngredientsSpy.calls.any()).toBe(true, 'getIngredients called');
  });

  it('should display error when IngredientService fails', fakeAsync(() => {
    getIngredientsSpy.and
      .returnValue(throwError('IngredientService test failure'));

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    expect(errorMessage()).toMatch(/test failure/, 'should display error');
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
  }));

});
