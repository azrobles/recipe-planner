import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { MeasureUnit } from '../models/measure-unit.model';
import { MeasureUnitService } from '../services/measure-unit.service';

import { MeasureUnitListComponent } from './measure-unit-list.component';

describe('MeasureUnitListComponent', () => {
  let component: MeasureUnitListComponent;
  let fixture: ComponentFixture<MeasureUnitListComponent>;
  let getMeasureUnitsSpy: jasmine.Spy;
  let testMeasureUnits: MeasureUnit[];

  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('[type="danger"]');
    return el ? el.textContent : null;
  };

  beforeEach(async () => {
    testMeasureUnits = [{id: 1, name: 'Test Data'}];

    const measureUnitService = jasmine.createSpyObj('MeasureUnitService',
      ['getMeasureUnits']);
    getMeasureUnitsSpy = measureUnitService.getMeasureUnits.and
      .returnValue(of(testMeasureUnits));

    await TestBed.configureTestingModule({
      declarations: [ MeasureUnitListComponent ],
      imports: [ NgbModule ],
      providers: [
        { provide: MeasureUnitService, useValue: measureUnitService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureUnitListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show measure units before OnInit', () => {
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
    expect(errorMessage()).toBeNull('should not show error element');
    expect(getMeasureUnitsSpy.calls.any())
      .toBe(false, 'getMeasureUnits not yet called');
  });

  it('should show measure units after component initialized', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table>tbody>tr>th:nth-of-type(1)').textContent)
      .toBe(testMeasureUnits[0].id + '');
    expect(fixture.nativeElement.querySelector('table>tbody>tr>td:nth-of-type(1)').textContent)
      .toBe(testMeasureUnits[0].name);
    expect(getMeasureUnitsSpy.calls.any()).toBe(true, 'getMeasureUnits called');
  });

  it('should display error when MeasureUnitService fails', fakeAsync(() => {
    getMeasureUnitsSpy.and
      .returnValue(throwError('MeasureUnitService test failure'));

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    expect(errorMessage()).toMatch(/test failure/, 'should display error');
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
  }));

});
