import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { AppRoutingModule } from '../app-routing.module';
import { Season } from '../models/season.model';
import { SeasonService } from '../services/season.service';

import { SeasonFormComponent } from './season-form.component';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let component: SeasonFormComponent;
let fixture: ComponentFixture<SeasonFormComponent>;
let page: Page;
let testSeason: Season;

////// Tests //////
describe('SeasonFormComponent', () => {
  beforeEach(async () => {
    const seasonServiceSpy = jasmine.createSpyObj('SeasonService',
      ['clearSeason', 'addSeason', 'getSeason',
      'updateSeason', 'deleteSeason']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [ SeasonFormComponent ],
      imports: [ AppRoutingModule, NgbModule, ReactiveFormsModule ],
      providers: [
        { provide: SeasonService, useValue: seasonServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  });

  describe('when navigate with no season id', () => {
    beforeEach(() => {
      testSeason = { id: undefined, name: '' };
      activatedRoute.setParamMap({ id: testSeason.id });
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate when click cancel', () => {
      page.cancelBtn.click();

      expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/seasons'], 'should nav to SeasonList');
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be true', () => {
      expect(component.isAddMode).toBe(true);
    });

    it('should have called `clearSeason`', () => {
      expect(page.clearSeasonSpy.calls.count()).toBe(1, 'clearSeason called once');
    });

    it('should display empty season name', () => {
      expect(page.nameInput.value).toBe(testSeason.name);
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

      expect(page.nameInput.value).toBe(testSeason.name);
      expect(page.nameInput.value).toBeFalsy();
    });

    it('should add and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.addSeasonSpy.calls.any()).toBe(true, 'addSeason called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/seasons'], 'should nav to SeasonList');
    }));

    it('should display error when add season fails', fakeAsync(() => {
      page.addSeasonSpy.and
        .returnValue(throwError('SeasonService test failure'));

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

  describe('when navigate to existing season', () => {
    beforeEach(() => {
      testSeason = { id: 1, name: 'A' };
      activatedRoute.setParamMap({ id: testSeason.id });
      createComponent();
    });

    it('should loading be false', () => {
      expect(component.loading).toBe(false);
    });

    it('should addMode be false', () => {
      expect(component.isAddMode).toBe(false);
    });

    it('should have called `getSeason`', () => {
      expect(page.getSeasonSpy.calls.count()).toBe(1, 'getSeason called once');
    });

    it('should display that season name', () => {
      expect(page.nameInput.value).toBe(testSeason.name);
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

      expect(page.nameInput.value).toBe(testSeason.name);
      expect(page.nameInput.value).toBeTruthy();
    });

    it('should update and navigate when click submit', fakeAsync(() => {
      page.nameInput.value = 'New Name';
      page.nameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      page.submitBtn.click();

      expect(component.loading).toBe(true);
      expect(page.updateSeasonSpy.calls.any()).toBe(true, 'updateSeason called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/seasons'], 'should nav to SeasonList');
    }));

    it('should display error when update season fails', fakeAsync(() => {
      page.updateSeasonSpy.and
        .returnValue(throwError('SeasonService test failure'));

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
      expect(page.deleteSeasonSpy.calls.any()).toBe(true, 'deleteSeason called');

      tick();

      expect(page.navigateSpy.calls.any()).toBe(true, 'navigate called');

      const navArgs = page.navigateSpy.calls.first().args[0];
      expect(navArgs).toEqual(['/seasons'], 'should nav to SeasonList');
    }));

    it('should display error when delete season fails', fakeAsync(() => {
      page.deleteSeasonSpy.and
        .returnValue(throwError('SeasonService test failure'));

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
  fixture = TestBed.createComponent(SeasonFormComponent);
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

  clearSeasonSpy: jasmine.Spy;
  addSeasonSpy: jasmine.Spy;
  getSeasonSpy: jasmine.Spy;
  updateSeasonSpy: jasmine.Spy;
  deleteSeasonSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<SeasonFormComponent>) {
    const seasonServiceSpy = someFixture.debugElement.injector.get(SeasonService) as any;
    this.clearSeasonSpy = seasonServiceSpy.clearSeason.and
      .returnValue(testSeason);
    this.addSeasonSpy = seasonServiceSpy.addSeason.and
      .returnValue(of(testSeason));
    this.getSeasonSpy = seasonServiceSpy.getSeason.and
      .returnValue(of(testSeason));
    this.updateSeasonSpy = seasonServiceSpy.updateSeason.and
      .returnValue(of(testSeason));
    this.deleteSeasonSpy = seasonServiceSpy.deleteSeason.and
      .returnValue(of(testSeason));

    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }
}
