import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { Availability } from '../models/availability.model';
import { AvailabilityService } from '../services/availability.service';

import { AvailabilityListComponent } from './availability-list.component';

describe('AvailabilityListComponent', () => {
  let component: AvailabilityListComponent;
  let fixture: ComponentFixture<AvailabilityListComponent>;
  let getAvailabilitiesSpy: jasmine.Spy;
  let testAvailabilities: Availability[];

  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('[type="danger"]');
    return el ? el.textContent : null;
  };

  beforeEach(async () => {
    testAvailabilities = [{id: 1, name: 'Test Data'}];

    const availabilityService = jasmine.createSpyObj('AvailabilityService',
      ['getAvailabilities']);
    getAvailabilitiesSpy = availabilityService.getAvailabilities.and
      .returnValue(of(testAvailabilities));

    await TestBed.configureTestingModule({
      declarations: [ AvailabilityListComponent ],
      imports: [ NgbModule ],
      providers: [
        { provide: AvailabilityService, useValue: availabilityService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show availabilities before OnInit', () => {
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
    expect(errorMessage()).toBeNull('should not show error element');
    expect(getAvailabilitiesSpy.calls.any())
      .toBe(false, 'getAvailabilities not yet called');
  });

  it('should show availabilities after component initialized', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table>tbody>tr>th:nth-of-type(1)').textContent)
      .toBe(testAvailabilities[0].id + '');
    expect(fixture.nativeElement.querySelector('table>tbody>tr>td:nth-of-type(1)').textContent)
      .toBe(testAvailabilities[0].name);
    expect(getAvailabilitiesSpy.calls.any()).toBe(true, 'getAvailabilities called');
  });

  it('should display error when AvailabilityService fails', fakeAsync(() => {
    getAvailabilitiesSpy.and
      .returnValue(throwError('AvailabilityService test failure'));

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    expect(errorMessage()).toMatch(/test failure/, 'should display error');
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
  }));

});
