import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { AppRoutingModule } from '../app-routing.module';
import { MeasureUnit } from '../models/measure-unit.model';
import { MeasureUnitService } from '../services/measure-unit.service';

import { MeasureUnitFormComponent } from './measure-unit-form.component';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let component: MeasureUnitFormComponent;
let fixture: ComponentFixture<MeasureUnitFormComponent>;
let page: Page;
let testMeasureUnit: MeasureUnit;

////// Tests //////
describe('MeasureUnitFormComponent', () => {
  beforeEach(async () => {
    const measureUnitServiceSpy = jasmine.createSpyObj('MeasureUnitService',
      ['clearMeasureUnit', 'addMeasureUnit', 'getMeasureUnit',
      'updateMeasureUnit', 'deleteMeasureUnit']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [ MeasureUnitFormComponent ],
      imports: [ AppRoutingModule, NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: MeasureUnitService, useValue: measureUnitServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  });

  describe('when navigate with no measure unit id', () => {
    beforeEach(() => {
      testMeasureUnit = { id: undefined, name: '' };
      activatedRoute.setParamMap({ id: testMeasureUnit.id });
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate when click cancel', () => {
      page.cancelBtn.click();

      expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/measureunits'], 'should nav to MeasureUnitList');
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be true', () => {
      expect(component.isAddMode).toBe(true);
    });

    it('should have called `clearMeasureUnit`', () => {
      expect(page.clearMeasureUnitSpy.calls.count()).toBe(1, 'clearMeasureUnit called once');
    });

    it('should display empty measure unit name', () => {
      expect(page.nameInput.value).toBe(testMeasureUnit.name);
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

      expect(page.nameInput.value).toBe(testMeasureUnit.name);
      expect(page.nameInput.value).toBeFalsy();
    });

    it('should add and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.addMeasureUnitSpy.calls.any()).toBe(true, 'addMeasureUnit called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/measureunits'], 'should nav to MeasureUnitList');
    }));

    it('should display error when add measure unit fails', fakeAsync(() => {
      page.addMeasureUnitSpy.and
        .returnValue(throwError('MeasureUnitService test failure'));

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

  describe('when navigate to existing measure unit', () => {
    beforeEach(() => {
      testMeasureUnit = { id: 1, name: 'A' };
      activatedRoute.setParamMap({ id: testMeasureUnit.id });
      createComponent();
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be false', () => {
      expect(component.isAddMode).toBe(false);
    });

    it('should have called `getMeasureUnit`', () => {
      expect(page.getMeasureUnitSpy.calls.count()).toBe(1, 'getMeasureUnit called once');
    });

    it('should display that measure unit name', () => {
      expect(page.nameInput.value).toBe(testMeasureUnit.name);
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

      expect(page.nameInput.value).toBe(testMeasureUnit.name);
      expect(page.nameInput.value).toBeTruthy();
    });

    it('should update and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.updateMeasureUnitSpy.calls.any()).toBe(true, 'updateMeasureUnit called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/measureunits'], 'should nav to MeasureUnitList');
    }));

    it('should display error when update measure unit fails', fakeAsync(() => {
      page.updateMeasureUnitSpy.and
        .returnValue(throwError('MeasureUnitService test failure'));

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
      expect(page.deleteMeasureUnitSpy.calls.any()).toBe(true, 'deleteMeasureUnit called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/measureunits'], 'should nav to MeasureUnitList');
    }));

    it('should display error when delete measure unit fails', fakeAsync(() => {
      page.deleteMeasureUnitSpy.and
        .returnValue(throwError('MeasureUnitService test failure'));

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
  fixture = TestBed.createComponent(MeasureUnitFormComponent);
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

  clearMeasureUnitSpy: jasmine.Spy;
  addMeasureUnitSpy: jasmine.Spy;
  getMeasureUnitSpy: jasmine.Spy;
  updateMeasureUnitSpy: jasmine.Spy;
  deleteMeasureUnitSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<MeasureUnitFormComponent>) {
    const measureUnitServiceSpy = someFixture.debugElement.injector.get(MeasureUnitService) as any;
    this.clearMeasureUnitSpy = measureUnitServiceSpy.clearMeasureUnit.and
      .returnValue(testMeasureUnit);
    this.addMeasureUnitSpy = measureUnitServiceSpy.addMeasureUnit.and
      .returnValue(of(testMeasureUnit));
    this.getMeasureUnitSpy = measureUnitServiceSpy.getMeasureUnit.and
      .returnValue(of(testMeasureUnit));
    this.updateMeasureUnitSpy = measureUnitServiceSpy.updateMeasureUnit.and
      .returnValue(of(testMeasureUnit));
    this.deleteMeasureUnitSpy = measureUnitServiceSpy.deleteMeasureUnit.and
      .returnValue(of(testMeasureUnit));

    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
