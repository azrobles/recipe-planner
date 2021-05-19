import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { AppRoutingModule } from '../app-routing.module';
import { Location } from '../models/location.model';
import { LocationService } from '../services/location.service';

import { LocationFormComponent } from './location-form.component';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let component: LocationFormComponent;
let fixture: ComponentFixture<LocationFormComponent>;
let page: Page;
let testLocation: Location;

////// Tests //////
describe('LocationFormComponent', () => {
  beforeEach(async () => {
    const locationServiceSpy = jasmine.createSpyObj('LocationService',
      ['clearLocation', 'addLocation', 'getLocation',
      'updateLocation', 'deleteLocation']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [ LocationFormComponent ],
      imports: [ AppRoutingModule, NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  });

  describe('when navigate with no location id', () => {
    beforeEach(() => {
      testLocation = { id: undefined, name: '' };
      activatedRoute.setParamMap({ id: testLocation.id });
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate when click cancel', () => {
      page.cancelBtn.click();

      expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/locations'], 'should nav to LocationList');
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be true', () => {
      expect(component.isAddMode).toBe(true);
    });

    it('should have called `clearLocation`', () => {
      expect(page.clearLocationSpy.calls.count()).toBe(1, 'clearLocation called once');
    });

    it('should display empty location name', () => {
      expect(page.nameInput.value).toBe(testLocation.name);
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

      expect(page.nameInput.value).toBe(testLocation.name);
      expect(page.nameInput.value).toBeFalsy();
    });

    it('should add and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.addLocationSpy.calls.any()).toBe(true, 'addLocation called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/locations'], 'should nav to LocationList');
    }));

    it('should display error when add location fails', fakeAsync(() => {
      page.addLocationSpy.and
        .returnValue(throwError('LocationService test failure'));

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

  describe('when navigate to existing location', () => {
    beforeEach(() => {
      testLocation = { id: 1, name: 'A' };
      activatedRoute.setParamMap({ id: testLocation.id });
      createComponent();
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be false', () => {
      expect(component.isAddMode).toBe(false);
    });

    it('should have called `getLocation`', () => {
      expect(page.getLocationSpy.calls.count()).toBe(1, 'getLocation called once');
    });

    it('should display that location name', () => {
      expect(page.nameInput.value).toBe(testLocation.name);
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

      expect(page.nameInput.value).toBe(testLocation.name);
      expect(page.nameInput.value).toBeTruthy();
    });

    it('should update and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.updateLocationSpy.calls.any()).toBe(true, 'updateLocation called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/locations'], 'should nav to LocationList');
    }));

    it('should display error when update location fails', fakeAsync(() => {
      page.updateLocationSpy.and
        .returnValue(throwError('LocationService test failure'));

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
      expect(page.deleteLocationSpy.calls.any()).toBe(true, 'deleteLocation called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/locations'], 'should nav to LocationList');
    }));

    it('should display error when delete location fails', fakeAsync(() => {
      page.deleteLocationSpy.and
        .returnValue(throwError('LocationService test failure'));

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
  fixture = TestBed.createComponent(LocationFormComponent);
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

  clearLocationSpy: jasmine.Spy;
  addLocationSpy: jasmine.Spy;
  getLocationSpy: jasmine.Spy;
  updateLocationSpy: jasmine.Spy;
  deleteLocationSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<LocationFormComponent>) {
    const locationServiceSpy = someFixture.debugElement.injector.get(LocationService) as any;
    this.clearLocationSpy = locationServiceSpy.clearLocation.and
      .returnValue(testLocation);
    this.addLocationSpy = locationServiceSpy.addLocation.and
      .returnValue(of(testLocation));
    this.getLocationSpy = locationServiceSpy.getLocation.and
      .returnValue(of(testLocation));
    this.updateLocationSpy = locationServiceSpy.updateLocation.and
      .returnValue(of(testLocation));
    this.deleteLocationSpy = locationServiceSpy.deleteLocation.and
      .returnValue(of(testLocation));

    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
