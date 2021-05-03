import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { AppRoutingModule } from '../app-routing.module';
import { Supermarket } from '../models/supermarket.model';
import { SupermarketService } from '../services/supermarket.service';

import { SupermarketFormComponent } from './supermarket-form.component';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let component: SupermarketFormComponent;
let fixture: ComponentFixture<SupermarketFormComponent>;
let page: Page;
let testSupermarket: Supermarket;

////// Tests //////
describe('SupermarketFormComponent', () => {
  beforeEach(async () => {
    const supermarketServiceSpy = jasmine.createSpyObj('SupermarketService',
      ['clearSupermarket', 'addSupermarket', 'getSupermarket', 'updateSupermarket']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [ SupermarketFormComponent ],
      imports: [ AppRoutingModule, NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: SupermarketService, useValue: supermarketServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  });

  describe('when navigate with no supermarket id', () => {
    beforeEach(() => {
      testSupermarket = { id: undefined, name: '' };
      activatedRoute.setParamMap({ id: testSupermarket.id });
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate when click cancel', () => {
      page.cancelBtn.click();

      expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/supermarkets'], 'should nav to SupermarketList');
    });

    it('should addMode be true', () => {
      expect(component.isAddMode).toBe(true);
    });

    it('should have called `clearSupermarket`', () => {
      expect(page.clearSupermarketSpy.calls.count()).toBe(1, 'clearSupermarket called once');
    });

    it('should display empty supermarket name', () => {
      expect(page.nameInput.value).toBe(testSupermarket.name);
      expect(page.nameInput.value).toBeFalsy();
    });

    it('should not display error message', () => {
      expect(page.errorMessage).toBeNull('should not display error element');
    });

    it('should reset form when click reset', () => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.resetBtn.click();

      expect(page.nameInput.value).toBe(testSupermarket.name);
      expect(page.nameInput.value).toBeFalsy();
    });

    it('should add and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(page.addSupermarketSpy.calls.any()).toBe(true, 'addSupermarket called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/supermarkets'], 'should nav to SupermarketList');
    }));

    it('should display error when add supermarket fails', fakeAsync(() => {
      page.addSupermarketSpy.and
        .returnValue(throwError('SupermarketService test failure'));

      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      tick();

      fixture.detectChanges();

      expect(page.errorMessage).toMatch(/test failure/, 'should display error');
      expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    }));
  });

  describe('when navigate to existing supermarket', () => {
    beforeEach(() => {
      testSupermarket = { id: 1, name: 'A' };
      activatedRoute.setParamMap({ id: testSupermarket.id });
      createComponent();
    });

    it('should addMode be false', () => {
      expect(component.isAddMode).toBe(false);
    });

    it('should have called `getSupermarket`', () => {
      expect(page.getSupermarketSpy.calls.count()).toBe(1, 'getSupermarket called once');
    });

    it('should display that supermarket name', () => {
      expect(page.nameInput.value).toBe(testSupermarket.name);
      expect(page.nameInput.value).toBeTruthy();
    });

    it('should not display error message', () => {
      expect(page.errorMessage).toBeNull('should not display error element');
    });

    it('should reset form when click reset', () => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.resetBtn.click();

      expect(page.nameInput.value).toBe(testSupermarket.name);
      expect(page.nameInput.value).toBeTruthy();
    });

    it('should update and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(page.updateSupermarketSpy.calls.any()).toBe(true, 'updateSupermarket called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/supermarkets'], 'should nav to SupermarketList');
    }));

    it('should display error when update supermarket fails', fakeAsync(() => {
      page.updateSupermarketSpy.and
        .returnValue(throwError('SupermarketService test failure'));

      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      tick();

      fixture.detectChanges();

      expect(page.errorMessage).toMatch(/test failure/, 'should display error');
      expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    }));
  });
});

/////////// Helpers /////
function createComponent() {
  fixture = TestBed.createComponent(SupermarketFormComponent);
  component = fixture.componentInstance;
  page = new Page(fixture);

  fixture.detectChanges();
}

class Page {
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

  clearSupermarketSpy: jasmine.Spy;
  addSupermarketSpy: jasmine.Spy;
  getSupermarketSpy: jasmine.Spy;
  updateSupermarketSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<SupermarketFormComponent>) {
    const supermarketServiceSpy = someFixture.debugElement.injector.get(SupermarketService) as any;
    this.clearSupermarketSpy = supermarketServiceSpy.clearSupermarket.and
      .returnValue(testSupermarket);
    this.addSupermarketSpy = supermarketServiceSpy.addSupermarket.and
      .returnValue(of(testSupermarket));
    this.getSupermarketSpy = supermarketServiceSpy.getSupermarket.and
      .returnValue(of(testSupermarket));
    this.updateSupermarketSpy = supermarketServiceSpy.updateSupermarket.and
      .returnValue(of(testSupermarket));

    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
