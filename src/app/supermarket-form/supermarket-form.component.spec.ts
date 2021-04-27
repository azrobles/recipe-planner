import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from '../app-routing.module';
import { Supermarket } from '../models/supermarket.model';
import { SupermarketService } from '../services/supermarket.service';

import { SupermarketFormComponent } from './supermarket-form.component';

////// Testing Vars //////
let component: SupermarketFormComponent;
let fixture: ComponentFixture<SupermarketFormComponent>;
let page: Page;
let testSupermarket: Supermarket;

////// Tests //////
describe('SupermarketFormComponent', () => {
  beforeEach(async () => {
    const supermarketServiceSpy = jasmine.createSpyObj('SupermarketService',
      ['clearSupermarket', 'addSupermarket']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ SupermarketFormComponent ],
      imports: [ AppRoutingModule, NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: SupermarketService, useValue: supermarketServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => testSupermarket = { id: undefined, name: '' } );

  beforeEach(() => {
    fixture = TestBed.createComponent(SupermarketFormComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);

    fixture.detectChanges();
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

  it('should reset form when click reset', () => {
    page.nameInput.value = 'New Name';
    page.nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    page.resetBtn.click();

    expect(page.nameInput.textContent).toBe(testSupermarket.name);
  });

  it('should have called `clearSupermarket`', () => {
    expect(page.clearSupermarketSpy.calls.count()).toBe(1, 'clearSupermarket called once');
  });

  it('should display empty supermarket name', () => {
    expect(page.nameInput.textContent).toBe(testSupermarket.name);
  });

  it('should not display error message', () => {
    expect(page.errorMessage).toBeNull('should not display error element');
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

/////////// Helpers /////
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
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<SupermarketFormComponent>) {
    const supermarketServiceSpy = someFixture.debugElement.injector.get(SupermarketService) as any;
    this.clearSupermarketSpy = supermarketServiceSpy.clearSupermarket.and
      .returnValue(testSupermarket);
    this.addSupermarketSpy = supermarketServiceSpy.addSupermarket.and
      .returnValue(of(testSupermarket));

    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
