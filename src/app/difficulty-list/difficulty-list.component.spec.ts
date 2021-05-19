import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { Difficulty } from '../models/difficulty.model';
import { DifficultyService } from '../services/difficulty.service';

import { DifficultyListComponent } from './difficulty-list.component';

describe('DifficultyListComponent', () => {
  let component: DifficultyListComponent;
  let fixture: ComponentFixture<DifficultyListComponent>;
  let getDifficultiesSpy: jasmine.Spy;
  let testDifficulties: Difficulty[];

  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('[type="danger"]');
    return el ? el.textContent : null;
  };

  beforeEach(async () => {
    testDifficulties = [{id: 1, name: 'Test Data'}];

    const difficultyService = jasmine.createSpyObj('DifficultyService',
      ['getDifficulties']);
    getDifficultiesSpy = difficultyService.getDifficulties.and
      .returnValue(of(testDifficulties));

    await TestBed.configureTestingModule({
      declarations: [ DifficultyListComponent ],
      imports: [ NgbModule ],
      providers: [
        { provide: DifficultyService, useValue: difficultyService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DifficultyListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show difficulties before OnInit', () => {
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
    expect(errorMessage()).toBeNull('should not show error element');
    expect(getDifficultiesSpy.calls.any())
      .toBe(false, 'getDifficulties not yet called');
  });

  it('should show difficulties after component initialized', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table>tbody>tr>th:nth-of-type(1)').textContent)
      .toBe(testDifficulties[0].id + '');
    expect(fixture.nativeElement.querySelector('table>tbody>tr>td:nth-of-type(1)').textContent)
      .toBe(testDifficulties[0].name);
    expect(getDifficultiesSpy.calls.any()).toBe(true, 'getDifficulties called');
  });

  it('should display error when DifficultyService fails', fakeAsync(() => {
    getDifficultiesSpy.and
      .returnValue(throwError('DifficultyService test failure'));

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    expect(errorMessage()).toMatch(/test failure/, 'should display error');
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
  }));

});
