import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { TimeUnit } from '../models/time-unit.model';
import { TimeUnitService } from '../services/time-unit.service';

import { TimeUnitListComponent } from './time-unit-list.component';

describe('TimeUnitListComponent', () => {
  let component: TimeUnitListComponent;
  let fixture: ComponentFixture<TimeUnitListComponent>;
  let getTimeUnitsSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;
  let testTimeUnits: TimeUnit[];

  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('[type="danger"]');
    return el ? el.textContent : null;
  };

  beforeEach(async () => {
    testTimeUnits = [{id: 1, name: 'Test Data'}];

    const timeUnitService = jasmine.createSpyObj('TimeUnitService',
      ['getTimeUnits']);
    getTimeUnitsSpy = timeUnitService.getTimeUnits.and
      .returnValue(of(testTimeUnits));

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    navigateSpy = routerSpy.navigate;

    await TestBed.configureTestingModule({
      declarations: [ TimeUnitListComponent ],
      imports: [ NgbModule ],
      providers: [
        { provide: TimeUnitService, useValue: timeUnitService },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeUnitListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show time units before OnInit', () => {
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
    expect(errorMessage()).toBeNull('should not show error element');
    expect(getTimeUnitsSpy.calls.any())
      .toBe(false, 'getTimeUnits not yet called');
  });

  it('should show time units after component initialized', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table>tbody>tr>th:nth-of-type(1)').textContent)
      .toBe(testTimeUnits[0].id + '');
    expect(fixture.nativeElement.querySelector('table>tbody>tr>td:nth-of-type(1)').textContent)
      .toBe(testTimeUnits[0].name);
    expect(getTimeUnitsSpy.calls.any()).toBe(true, 'getTimeUnits called');
  });

  it('should display error when TimeUnitService fails', fakeAsync(() => {
    getTimeUnitsSpy.and
      .returnValue(throwError('TimeUnitService test failure'));

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    expect(errorMessage()).toMatch(/test failure/, 'should display error');
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
  }));

  it('should navigate when click row', () => {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('table>tbody>tr').click();

    expect(navigateSpy.calls.any()).toBe(true, 'router.navigate called');

    const navArgs = navigateSpy.calls.first().args[0];
    expect(navArgs).toEqual(['/timeunits', testTimeUnits[0].id], 'should nav to TimeUnitForm');
  });

});
