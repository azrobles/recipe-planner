import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Supermarket } from '../models/supermarket.model';
import { SupermarketService } from '../services/supermarket.service';

import { SupermarketListComponent } from './supermarket-list.component';

describe('SupermarketListComponent', () => {
  let component: SupermarketListComponent;
  let fixture: ComponentFixture<SupermarketListComponent>;
  let getSupermarketsSpy: jasmine.Spy;
  let testSupermarkets: Supermarket[];

  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('[type="danger"]');
    return el ? el.textContent : null;
  };

  beforeEach(async () => {
    testSupermarkets = [{id: 1, name: 'Test Data'}];

    const supermarketService = jasmine.createSpyObj('SupermarketService',
      ['getSupermarkets']);
    getSupermarketsSpy = supermarketService.getSupermarkets.and
      .returnValue(of(testSupermarkets));

    await TestBed.configureTestingModule({
      declarations: [ SupermarketListComponent ],
      providers: [{provide: SupermarketService, useValue: supermarketService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupermarketListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show supermarkets before OnInit', () => {
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
    expect(errorMessage()).toBeNull('should not show error element');
    expect(getSupermarketsSpy.calls.any())
      .toBe(false, 'getSupermarkets not yet called');
  });

  it('should show supermarkets after component initialized', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('table>tbody>tr>th:nth-of-type(1)').textContent)
      .toBe(testSupermarkets[0].id + '');
    expect(fixture.nativeElement.querySelector('table>tbody>tr>td:nth-of-type(1)').textContent)
      .toBe(testSupermarkets[0].name);
    expect(getSupermarketsSpy.calls.any()).toBe(true, 'getSupermarkets called');
  });

  it('should display error when SupermarketService fails', fakeAsync(() => {
    getSupermarketsSpy.and
      .returnValue(throwError('SupermarketService test failure'));

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    expect(errorMessage()).toMatch(/test failure/, 'should display error');
    expect(fixture.nativeElement.querySelector('table>tbody>tr'))
      .toBeFalsy('nothing displayed');
  }));
});
