import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { Season } from '../models/season.model';
import { SeasonService } from '../services/season.service';

import { SeasonListComponent } from './season-list.component';

describe('SeasonListComponent', () => {
  let component: SeasonListComponent;
  let fixture: ComponentFixture<SeasonListComponent>;
  let getSeasonsSpy: jasmine.Spy;
  let testSeasons: Season[];

  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('[type="danger"]');
    return el ? el.textContent : null;
  };

  beforeEach(async () => {
    testSeasons = [{id: 1, name: 'Test Data'}];

    const seasonService = jasmine.createSpyObj('SeasonService',
      ['getSeasons']);
    getSeasonsSpy = seasonService.getSeasons.and
      .returnValue(of(testSeasons));

    await TestBed.configureTestingModule({
      declarations: [ SeasonListComponent ],
      imports: [ NgbModule ],
      providers: [
        { provide: SeasonService, useValue: seasonService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show seasons before OnInit', () => {
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
    expect(errorMessage()).toBeNull('should not show error element');
    expect(getSeasonsSpy.calls.any())
      .toBe(false, 'getSeasons not yet called');
  });

  it('should show seasons after component initialized', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table>tbody>tr>th:nth-of-type(1)').textContent)
      .toBe(testSeasons[0].id + '');
    expect(fixture.nativeElement.querySelector('table>tbody>tr>td:nth-of-type(1)').textContent)
      .toBe(testSeasons[0].name);
    expect(getSeasonsSpy.calls.any()).toBe(true, 'getSeasons called');
  });

  it('should display error when SeasonService fails', fakeAsync(() => {
    getSeasonsSpy.and
      .returnValue(throwError('SeasonService test failure'));

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    expect(errorMessage()).toMatch(/test failure/, 'should display error');
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
  }));

});
