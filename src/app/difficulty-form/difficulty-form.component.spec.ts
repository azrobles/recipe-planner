import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { AppRoutingModule } from '../app-routing.module';
import { Difficulty } from '../models/difficulty.model';
import { DifficultyService } from '../services/difficulty.service';

import { DifficultyFormComponent } from './difficulty-form.component';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let component: DifficultyFormComponent;
let fixture: ComponentFixture<DifficultyFormComponent>;
let page: Page;
let testDifficulty: Difficulty;

////// Tests //////
describe('DifficultyFormComponent', () => {
  beforeEach(async () => {
    const difficultyServiceSpy = jasmine.createSpyObj('DifficultyService',
      ['clearDifficulty', 'addDifficulty', 'getDifficulty',
      'updateDifficulty', 'deleteDifficulty']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [ DifficultyFormComponent ],
      imports: [ AppRoutingModule, NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: DifficultyService, useValue: difficultyServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  });

  describe('when navigate with no difficulty id', () => {
    beforeEach(() => {
      testDifficulty = { id: undefined, name: '' };
      activatedRoute.setParamMap({ id: testDifficulty.id });
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate when click cancel', () => {
      page.cancelBtn.click();

      expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/difficulties'], 'should nav to DifficultyList');
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be true', () => {
      expect(component.isAddMode).toBe(true);
    });

    it('should have called `clearDifficulty`', () => {
      expect(page.clearDifficultySpy.calls.count()).toBe(1, 'clearDifficulty called once');
    });

    it('should display empty difficulty name', () => {
      expect(page.nameInput.value).toBe(testDifficulty.name);
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

      expect(page.nameInput.value).toBe(testDifficulty.name);
      expect(page.nameInput.value).toBeFalsy();
    });

    it('should add and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.addDifficultySpy.calls.any()).toBe(true, 'addDifficulty called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/difficulties'], 'should nav to DifficultyList');
    }));

    it('should display error when add difficulty fails', fakeAsync(() => {
      page.addDifficultySpy.and
        .returnValue(throwError('DifficultyService test failure'));

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

  describe('when navigate to existing difficulty', () => {
    beforeEach(() => {
      testDifficulty = { id: 1, name: 'A' };
      activatedRoute.setParamMap({ id: testDifficulty.id });
      createComponent();
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be false', () => {
      expect(component.isAddMode).toBe(false);
    });

    it('should have called `getDifficulty`', () => {
      expect(page.getDifficultySpy.calls.count()).toBe(1, 'getDifficulty called once');
    });

    it('should display that difficulty name', () => {
      expect(page.nameInput.value).toBe(testDifficulty.name);
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

      expect(page.nameInput.value).toBe(testDifficulty.name);
      expect(page.nameInput.value).toBeTruthy();
    });

    it('should update and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.updateDifficultySpy.calls.any()).toBe(true, 'updateDifficulty called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/difficulties'], 'should nav to DifficultyList');
    }));

    it('should display error when update difficulty fails', fakeAsync(() => {
      page.updateDifficultySpy.and
        .returnValue(throwError('DifficultyService test failure'));

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
      expect(page.deleteDifficultySpy.calls.any()).toBe(true, 'deleteDifficulty called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/difficulties'], 'should nav to DifficultyList');
    }));

    it('should display error when delete difficulty fails', fakeAsync(() => {
      page.deleteDifficultySpy.and
        .returnValue(throwError('DifficultyService test failure'));

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
  fixture = TestBed.createComponent(DifficultyFormComponent);
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

  clearDifficultySpy: jasmine.Spy;
  addDifficultySpy: jasmine.Spy;
  getDifficultySpy: jasmine.Spy;
  updateDifficultySpy: jasmine.Spy;
  deleteDifficultySpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<DifficultyFormComponent>) {
    const difficultyServiceSpy = someFixture.debugElement.injector.get(DifficultyService) as any;
    this.clearDifficultySpy = difficultyServiceSpy.clearDifficulty.and
      .returnValue(testDifficulty);
    this.addDifficultySpy = difficultyServiceSpy.addDifficulty.and
      .returnValue(of(testDifficulty));
    this.getDifficultySpy = difficultyServiceSpy.getDifficulty.and
      .returnValue(of(testDifficulty));
    this.updateDifficultySpy = difficultyServiceSpy.updateDifficulty.and
      .returnValue(of(testDifficulty));
    this.deleteDifficultySpy = difficultyServiceSpy.deleteDifficulty.and
      .returnValue(of(testDifficulty));

    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
