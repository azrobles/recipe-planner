import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { Location } from '../models/location.model';
import { LocationService } from '../services/location.service';

import { LocationListComponent } from './location-list.component';

describe('LocationListComponent', () => {
  let component: LocationListComponent;
  let fixture: ComponentFixture<LocationListComponent>;
  let getLocationsSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;
  let testLocations: Location[];

  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('[type="danger"]');
    return el ? el.textContent : null;
  };

  beforeEach(async () => {
    testLocations = [{id: 1, name: 'Test Data'}];

    const locationService = jasmine.createSpyObj('LocationService',
      ['getLocations']);
    getLocationsSpy = locationService.getLocations.and
      .returnValue(of(testLocations));

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    navigateSpy = routerSpy.navigate;

    await TestBed.configureTestingModule({
      declarations: [ LocationListComponent ],
      imports: [ NgbModule ],
      providers: [
        { provide: LocationService, useValue: locationService },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show locations before OnInit', () => {
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
    expect(errorMessage()).toBeNull('should not show error element');
    expect(getLocationsSpy.calls.any())
      .toBe(false, 'getLocations not yet called');
  });

  it('should show locations after component initialized', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table>tbody>tr>th:nth-of-type(1)').textContent)
      .toBe(testLocations[0].id + '');
    expect(fixture.nativeElement.querySelector('table>tbody>tr>td:nth-of-type(1)').textContent)
      .toBe(testLocations[0].name);
    expect(getLocationsSpy.calls.any()).toBe(true, 'getLocations called');
  });

  it('should display error when LocationService fails', fakeAsync(() => {
    getLocationsSpy.and
      .returnValue(throwError('LocationService test failure'));

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
    expect(navArgs).toEqual(['/locations', testLocations[0].id], 'should nav to LocationForm');
  });

});
