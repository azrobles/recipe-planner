import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { RecipeType } from '../models/recipe-type.model';
import { RecipeTypeService } from '../services/recipe-type.service';

import { RecipeTypeListComponent } from './recipe-type-list.component';

describe('RecipeTypeListComponent', () => {
  let component: RecipeTypeListComponent;
  let fixture: ComponentFixture<RecipeTypeListComponent>;
  let getRecipeTypesSpy: jasmine.Spy;
  let testRecipeTypes: RecipeType[];

  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('[type="danger"]');
    return el ? el.textContent : null;
  };

  beforeEach(async () => {
    testRecipeTypes = [{id: 1, name: 'Test Data'}];

    const recipeTypeService = jasmine.createSpyObj('RecipeTypeService',
      ['getRecipeTypes']);
    getRecipeTypesSpy = recipeTypeService.getRecipeTypes.and
      .returnValue(of(testRecipeTypes));

    await TestBed.configureTestingModule({
      declarations: [ RecipeTypeListComponent ],
      imports: [ NgbModule ],
      providers: [
        { provide: RecipeTypeService, useValue: recipeTypeService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeTypeListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show recipe types before OnInit', () => {
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
    expect(errorMessage()).toBeNull('should not show error element');
    expect(getRecipeTypesSpy.calls.any())
      .toBe(false, 'getRecipeTypes not yet called');
  });

  it('should show recipe types after component initialized', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table>tbody>tr>th:nth-of-type(1)').textContent)
      .toBe(testRecipeTypes[0].id + '');
    expect(fixture.nativeElement.querySelector('table>tbody>tr>td:nth-of-type(1)').textContent)
      .toBe(testRecipeTypes[0].name);
    expect(getRecipeTypesSpy.calls.any()).toBe(true, 'getRecipeTypes called');
  });

  it('should display error when RecipeTypeService fails', fakeAsync(() => {
    getRecipeTypesSpy.and
      .returnValue(throwError('RecipeTypeService test failure'));

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    expect(errorMessage()).toMatch(/test failure/, 'should display error');
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
  }));

});
