import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MeasureUnit } from '../models/measure-unit.model';

import { MeasureUnitService } from './measure-unit.service';

const testUrl = '/api/measureunits';

describe('MeasureUnitService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: MeasureUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ MeasureUnitService ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MeasureUnitService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#clearMeasureUnit', () => {
    let testData: MeasureUnit = { id: undefined, name: '' };

    it('should return cleared measure unit', () => {
      expect(service.clearMeasureUnit()).toEqual(testData, 'should return cleared measure unit');
    });
  });

  describe('#getMeasureUnits', () => {
    let testData: MeasureUnit[];

    beforeEach(() => {
      testData = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
       ] as MeasureUnit[];
    });

    it('should return expected measure units (called once)', () => {
      service.getMeasureUnits().subscribe(
        data => expect(data).toEqual(testData, 'should return expected measure units'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should be OK returning no measure units', () => {
      service.getMeasureUnits().subscribe(
        data => expect(data.length).toEqual(0, 'should have empty measure units array'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush([]);
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';

      service.getMeasureUnits().subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected measure units (called multiple times)', () => {
      service.getMeasureUnits().subscribe();
      service.getMeasureUnits().subscribe();
      service.getMeasureUnits().subscribe(
        data => expect(data).toEqual(testData, 'should return expected measure units'),
        fail
      );

      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3, 'calls to getMeasureUnits()');

      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'Test Data' }]);
      requests[2].flush(testData);
    });
  });

  describe('#getMeasureUnit', () => {
    it('should return expected measure unit', () => {
      const id = 1;
      const testData: MeasureUnit = { id: id, name: 'A' };

      service.getMeasureUnit(id).subscribe(
        data => expect(data).toEqual(testData, 'should return the measure unit'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.getMeasureUnit(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.getMeasureUnit(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#addMeasureUnit', () => {
    it('should create a measure unit and return it', () => {
      const testData: MeasureUnit = { id: 1, name: 'A' };

      service.addMeasureUnit(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the measure unit'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testData);

      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: testData });
      req.event(expectedResponse);
    });

    it('should turn 404 error into user-facing error', () => {
      const msg = 'Deliberate 404';
      const testData: MeasureUnit = { id: 1, name: 'A' };

      service.addMeasureUnit(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: MeasureUnit = { id: 1, name: 'A' };

      service.addMeasureUnit(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#updateMeasureUnit', () => {
    it('should update a measure unit and return it', () => {
      const testData: MeasureUnit = { id: 1, name: 'A' };

      service.updateMeasureUnit(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the measure unit'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(testData);

      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: testData });
      req.event(expectedResponse);
    });

    it('should turn 404 error into user-facing error', () => {
      const msg = 'Deliberate 404';
      const testData: MeasureUnit = { id: 1, name: 'A' };

      service.updateMeasureUnit(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: MeasureUnit = { id: 1, name: 'A' };

      service.updateMeasureUnit(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#deleteMeasureUnit', () => {
    it('should delete a measure unit', () => {
      const id = 1;
      const testData: MeasureUnit = { id: id, name: 'A' };

      service.deleteMeasureUnit(id).subscribe(
        data => expect(data).toEqual(testData, 'should delete the measure unit'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('DELETE');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.deleteMeasureUnit(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.deleteMeasureUnit(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  it('httpTestingController.verify should fail if HTTP response not simulated', () => {
    httpClient.get('some/api').subscribe();

    expect(() => httpTestingController.verify()).toThrow();

    const req = httpTestingController.expectOne('some/api');
    req.flush(null);
  });

});
