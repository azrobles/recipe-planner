import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { AppRoutingModule } from '../app-routing.module';
import { Availability } from '../models/availability.model';
import { AvailabilityService } from '../services/availability.service';

import { AvailabilityFormComponent } from './availability-form.component';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let component: AvailabilityFormComponent;
let fixture: ComponentFixture<AvailabilityFormComponent>;
let page: Page;
let testAvailability: Availability;

////// Tests //////
describe('AvailabilityFormComponent', () => {
  beforeEach(async () => {
    const availabilityServiceSpy = jasmine.createSpyObj('AvailabilityService',
      ['clearAvailability', 'addAvailability', 'getAvailability',
      'updateAvailability', 'deleteAvailability']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [ AvailabilityFormComponent ],
      imports: [ AppRoutingModule, NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: AvailabilityService, useValue: availabilityServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  });

  describe('when navigate with no availability id', () => {
    beforeEach(() => {
      testAvailability = { id: undefined, name: '' };
      activatedRoute.setParamMap({ id: testAvailability.id });
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate when click cancel', () => {
      page.cancelBtn.click();

      expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/availabilities'], 'should nav to AvailabilityList');
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be true', () => {
      expect(component.isAddMode).toBe(true);
    });

    it('should have called `clearAvailability`', () => {
      expect(page.clearAvailabilitySpy.calls.count()).toBe(1, 'clearAvailability called once');
    });

    it('should display empty availability name', () => {
      expect(page.nameInput.value).toBe(testAvailability.name);
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

      expect(page.nameInput.value).toBe(testAvailability.name);
      expect(page.nameInput.value).toBeFalsy();
    });

    it('should add and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.addAvailabilitySpy.calls.any()).toBe(true, 'addAvailability called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/availabilities'], 'should nav to AvailabilityList');
    }));

    it('should display error when add availability fails', fakeAsync(() => {
      page.addAvailabilitySpy.and
        .returnValue(throwError('AvailabilityService test failure'));

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

  describe('when navigate to existing availability', () => {
    beforeEach(() => {
      testAvailability = { id: 1, name: 'A' };
      activatedRoute.setParamMap({ id: testAvailability.id });
      createComponent();
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be false', () => {
      expect(component.isAddMode).toBe(false);
    });

    it('should have called `getAvailability`', () => {
      expect(page.getAvailabilitySpy.calls.count()).toBe(1, 'getAvailability called once');
    });

    it('should display that availability name', () => {
      expect(page.nameInput.value).toBe(testAvailability.name);
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

      expect(page.nameInput.value).toBe(testAvailability.name);
      expect(page.nameInput.value).toBeTruthy();
    });

    it('should update and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.updateAvailabilitySpy.calls.any()).toBe(true, 'updateAvailability called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/availabilities'], 'should nav to AvailabilityList');
    }));

    it('should display error when update availability fails', fakeAsync(() => {
      page.updateAvailabilitySpy.and
        .returnValue(throwError('AvailabilityService test failure'));

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
      expect(page.deleteAvailabilitySpy.calls.any()).toBe(true, 'deleteAvailability called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/availabilities'], 'should nav to AvailabilityList');
    }));

    it('should display error when delete availability fails', fakeAsync(() => {
      page.deleteAvailabilitySpy.and
        .returnValue(throwError('AvailabilityService test failure'));

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
  fixture = TestBed.createComponent(AvailabilityFormComponent);
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

  clearAvailabilitySpy: jasmine.Spy;
  addAvailabilitySpy: jasmine.Spy;
  getAvailabilitySpy: jasmine.Spy;
  updateAvailabilitySpy: jasmine.Spy;
  deleteAvailabilitySpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<AvailabilityFormComponent>) {
    const availabilityServiceSpy = someFixture.debugElement.injector.get(AvailabilityService) as any;
    this.clearAvailabilitySpy = availabilityServiceSpy.clearAvailability.and
      .returnValue(testAvailability);
    this.addAvailabilitySpy = availabilityServiceSpy.addAvailability.and
      .returnValue(of(testAvailability));
    this.getAvailabilitySpy = availabilityServiceSpy.getAvailability.and
      .returnValue(of(testAvailability));
    this.updateAvailabilitySpy = availabilityServiceSpy.updateAvailability.and
      .returnValue(of(testAvailability));
    this.deleteAvailabilitySpy = availabilityServiceSpy.deleteAvailability.and
      .returnValue(of(testAvailability));

    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
