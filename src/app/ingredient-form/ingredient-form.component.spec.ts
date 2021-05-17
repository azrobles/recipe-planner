import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { AppRoutingModule } from '../app-routing.module';
import { Availability } from '../models/availability.model';
import { Ingredient } from '../models/ingredient.model';
import { Supermarket } from '../models/supermarket.model';
import { AvailabilityService } from '../services/availability.service';
import { IngredientService } from '../services/ingredient.service';
import { SupermarketService } from '../services/supermarket.service';

import { IngredientFormComponent } from './ingredient-form.component';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let component: IngredientFormComponent;
let fixture: ComponentFixture<IngredientFormComponent>;
let page: Page;
let testAvailabilities: Availability[];
let testSupermarkets: Supermarket[];
let testIngredient: Ingredient;

////// Tests //////
describe('IngredientFormComponent', () => {
  beforeEach(async () => {
    const availabilityServiceSpy = jasmine.createSpyObj('AvailabilityService',
      ['getAvailabilities']);
    const supermarketServiceSpy = jasmine.createSpyObj('SupermarketService',
      ['getSupermarkets']);
    const ingredientServiceSpy = jasmine.createSpyObj('IngredientService',
      ['clearIngredient', 'addIngredient', 'getIngredient',
      'updateIngredient', 'deleteIngredient']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [ IngredientFormComponent ],
      imports: [ AppRoutingModule, NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: AvailabilityService, useValue: availabilityServiceSpy },
        { provide: SupermarketService, useValue: supermarketServiceSpy },
        { provide: IngredientService, useValue: ingredientServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  });

  describe('when navigate with no ingredient id', () => {
    beforeEach(() => {
      testAvailabilities = [{id: 1, name: 'Test Data'}];
      testSupermarkets = [{id: 1, name: 'Test Data'}];
      testIngredient = { id: undefined, name: '', availability: { name: '' },
        supermarket: { name: '' } };
      activatedRoute.setParamMap({ id: testIngredient.id });
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate when click cancel', () => {
      page.cancelBtn.click();

      expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/ingredients'], 'should nav to IngredientList');
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be true', () => {
      expect(component.isAddMode).toBe(true);
    });

    it('should have called `getAvailabilities`', () => {
      expect(page.getAvailabilitiesSpy.calls.count()).toBe(1, 'getAvailabilities called once');
      expect(page.availabilitySelect.options.length).toBe(testAvailabilities.length);
    });

    it('should have called `getSupermarkets`', () => {
      expect(page.getSupermarketsSpy.calls.count()).toBe(1, 'getSupermarkets called once');
      expect(page.supermarketSelect.options.length).toBe(testSupermarkets.length);
    });

    it('should have called `clearIngredient`', () => {
      expect(page.clearIngredientSpy.calls.count()).toBe(1, 'clearIngredient called once');
    });

    it('should display empty ingredient', () => {
      expect(page.nameInput.value).toBe(testIngredient.name);
      expect(page.nameInput.value).toBeFalsy();

      expect(page.availabilitySelect.selectedIndex).toBe(-1);

      expect(page.supermarketSelect.selectedIndex).toBe(-1);
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

      expect(page.nameInput.value).toBe(testIngredient.name);
      expect(page.nameInput.value).toBeFalsy();
    });

    it('should add and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.availabilitySelect.value = page.availabilitySelect.options[0].value;
      page.availabilitySelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.supermarketSelect.value = page.supermarketSelect.options[0].value;
      page.supermarketSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.addIngredientSpy.calls.any()).toBe(true, 'addIngredient called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/ingredients'], 'should nav to IngredientList');
    }));

    it('should display error when add ingredient fails', fakeAsync(() => {
      page.addIngredientSpy.and
        .returnValue(throwError('IngredientService test failure'));

      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.availabilitySelect.value = page.availabilitySelect.options[0].value;
      page.availabilitySelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.supermarketSelect.value = page.supermarketSelect.options[0].value;
      page.supermarketSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      page.submitBtn.click();

      tick();

      fixture.detectChanges();

      expect(component.loading).toBe(false);
      expect(page.errorMessage).toMatch(/test failure/, 'should display error');
      expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    }));
  });

  describe('when navigate to existing ingredient', () => {
    beforeEach(() => {
      testAvailabilities = [{id: 1, name: 'Test Data'}];
      testSupermarkets = [{id: 1, name: 'Test Data'}];
      testIngredient = { id: 1, name: 'A', availability: testAvailabilities[0],
        supermarket: testSupermarkets[0] };
      activatedRoute.setParamMap({ id: testIngredient.id });
      createComponent();
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be false', () => {
      expect(component.isAddMode).toBe(false);
    });

    it('should have called `getIngredient`', () => {
      expect(page.getIngredientSpy.calls.count()).toBe(1, 'getIngredient called once');
    });

    it('should display that ingredient', () => {
      expect(page.nameInput.value).toBe(testIngredient.name);
      expect(page.nameInput.value).toBeTruthy();

      expect(page.availabilitySelect.options[page.availabilitySelect.selectedIndex].label)
        .toBe(testIngredient.availability.name);

      expect(page.supermarketSelect.options[page.supermarketSelect.selectedIndex].label)
        .toBe(testIngredient.supermarket.name);
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

      expect(page.nameInput.value).toBe(testIngredient.name);
      expect(page.nameInput.value).toBeTruthy();
    });

    it('should update and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.updateIngredientSpy.calls.any()).toBe(true, 'updateIngredient called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/ingredients'], 'should nav to IngredientList');
    }));

    it('should display error when update ingredient fails', fakeAsync(() => {
      page.updateIngredientSpy.and
        .returnValue(throwError('IngredientService test failure'));

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
      expect(page.deleteIngredientSpy.calls.any()).toBe(true, 'deleteIngredient called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/ingredients'], 'should nav to IngredientList');
    }));

    it('should display error when delete ingredient fails', fakeAsync(() => {
      page.deleteIngredientSpy.and
        .returnValue(throwError('IngredientService test failure'));

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
  fixture = TestBed.createComponent(IngredientFormComponent);
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
  get availabilitySelect() {
    return this.query<HTMLSelectElement>('#availabilitySelect');
  }
  get supermarketSelect() {
    return this.query<HTMLSelectElement>('#supermarketSelect');
  }
  get errorMessage() {
    const el = this.query<HTMLElement>('[type="danger"]');
    return el ? el.textContent : null;
  }

  getAvailabilitiesSpy: jasmine.Spy;
  getSupermarketsSpy: jasmine.Spy;
  clearIngredientSpy: jasmine.Spy;
  addIngredientSpy: jasmine.Spy;
  getIngredientSpy: jasmine.Spy;
  updateIngredientSpy: jasmine.Spy;
  deleteIngredientSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<IngredientFormComponent>) {
    const availabilityServiceSpy = someFixture.debugElement.injector.get(AvailabilityService) as any;
    this.getAvailabilitiesSpy = availabilityServiceSpy.getAvailabilities.and
      .returnValue(of(testAvailabilities));

    const supermarketServiceSpy = someFixture.debugElement.injector.get(SupermarketService) as any;
    this.getSupermarketsSpy = supermarketServiceSpy.getSupermarkets.and
      .returnValue(of(testSupermarkets));

    const ingredientServiceSpy = someFixture.debugElement.injector.get(IngredientService) as any;
    this.clearIngredientSpy = ingredientServiceSpy.clearIngredient.and
      .returnValue(testIngredient);
    this.addIngredientSpy = ingredientServiceSpy.addIngredient.and
      .returnValue(of(testIngredient));
    this.getIngredientSpy = ingredientServiceSpy.getIngredient.and
      .returnValue(of(testIngredient));
    this.updateIngredientSpy = ingredientServiceSpy.updateIngredient.and
      .returnValue(of(testIngredient));
    this.deleteIngredientSpy = ingredientServiceSpy.deleteIngredient.and
      .returnValue(of(testIngredient));

    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
