import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { AppRoutingModule } from '../app-routing.module';
import { TimeUnit } from '../models/time-unit.model';
import { TimeUnitService } from '../services/time-unit.service';

import { TimeUnitFormComponent } from './time-unit-form.component';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let component: TimeUnitFormComponent;
let fixture: ComponentFixture<TimeUnitFormComponent>;
let page: Page;
let testTimeUnit: TimeUnit;

////// Tests //////
describe('TimeUnitFormComponent', () => {
  beforeEach(async () => {
    const timeUnitServiceSpy = jasmine.createSpyObj('TimeUnitService',
      ['clearTimeUnit', 'addTimeUnit', 'getTimeUnit',
      'updateTimeUnit', 'deleteTimeUnit']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [ TimeUnitFormComponent ],
      imports: [ AppRoutingModule, NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: TimeUnitService, useValue: timeUnitServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  });

  describe('when navigate with no time unit id', () => {
    beforeEach(() => {
      testTimeUnit = { id: undefined, name: '' };
      activatedRoute.setParamMap({ id: testTimeUnit.id });
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate when click cancel', () => {
      page.cancelBtn.click();

      expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/timeunits'], 'should nav to TimeUnitList');
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be true', () => {
      expect(component.isAddMode).toBe(true);
    });

    it('should have called `clearTimeUnit`', () => {
      expect(page.clearTimeUnitSpy.calls.count()).toBe(1, 'clearTimeUnit called once');
    });

    it('should display empty time unit name', () => {
      expect(page.nameInput.value).toBe(testTimeUnit.name);
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

      expect(page.nameInput.value).toBe(testTimeUnit.name);
      expect(page.nameInput.value).toBeFalsy();
    });

    it('should add and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.addTimeUnitSpy.calls.any()).toBe(true, 'addTimeUnit called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/timeunits'], 'should nav to TimeUnitList');
    }));

    it('should display error when add time unit fails', fakeAsync(() => {
      page.addTimeUnitSpy.and
        .returnValue(throwError('TimeUnitService test failure'));

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

  describe('when navigate to existing time unit', () => {
    beforeEach(() => {
      testTimeUnit = { id: 1, name: 'A' };
      activatedRoute.setParamMap({ id: testTimeUnit.id });
      createComponent();
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be false', () => {
      expect(component.isAddMode).toBe(false);
    });

    it('should have called `getTimeUnit`', () => {
      expect(page.getTimeUnitSpy.calls.count()).toBe(1, 'getTimeUnit called once');
    });

    it('should display that time unit name', () => {
      expect(page.nameInput.value).toBe(testTimeUnit.name);
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

      expect(page.nameInput.value).toBe(testTimeUnit.name);
      expect(page.nameInput.value).toBeTruthy();
    });

    it('should update and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.updateTimeUnitSpy.calls.any()).toBe(true, 'updateTimeUnit called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/timeunits'], 'should nav to TimeUnitList');
    }));

    it('should display error when update time unit fails', fakeAsync(() => {
      page.updateTimeUnitSpy.and
        .returnValue(throwError('TimeUnitService test failure'));

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
      expect(page.deleteTimeUnitSpy.calls.any()).toBe(true, 'deleteTimeUnit called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/timeunits'], 'should nav to TimeUnitList');
    }));

    it('should display error when delete time unit fails', fakeAsync(() => {
      page.deleteTimeUnitSpy.and
        .returnValue(throwError('TimeUnitService test failure'));

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
  fixture = TestBed.createComponent(TimeUnitFormComponent);
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

  clearTimeUnitSpy: jasmine.Spy;
  addTimeUnitSpy: jasmine.Spy;
  getTimeUnitSpy: jasmine.Spy;
  updateTimeUnitSpy: jasmine.Spy;
  deleteTimeUnitSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<TimeUnitFormComponent>) {
    const timeUnitServiceSpy = someFixture.debugElement.injector.get(TimeUnitService) as any;
    this.clearTimeUnitSpy = timeUnitServiceSpy.clearTimeUnit.and
      .returnValue(testTimeUnit);
    this.addTimeUnitSpy = timeUnitServiceSpy.addTimeUnit.and
      .returnValue(of(testTimeUnit));
    this.getTimeUnitSpy = timeUnitServiceSpy.getTimeUnit.and
      .returnValue(of(testTimeUnit));
    this.updateTimeUnitSpy = timeUnitServiceSpy.updateTimeUnit.and
      .returnValue(of(testTimeUnit));
    this.deleteTimeUnitSpy = timeUnitServiceSpy.deleteTimeUnit.and
      .returnValue(of(testTimeUnit));

    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
