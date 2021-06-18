import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Location } from '../models/location.model';

import { LocationService } from './location.service';

const testUrl = '/api/locations';

describe('LocationService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ LocationService ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(LocationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#clearLocation', () => {
    let testData: Location = { id: undefined, name: '' };

    it('should return cleared location', () => {
      expect(service.clearLocation()).toEqual(testData, 'should return cleared location');
    });
  });

  describe('#getLocations', () => {
    let testData: Location[];

    beforeEach(() => {
      testData = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' }
       ] as Location[];
    });

    it('should return expected locations (called once)', () => {
      service.getLocations().subscribe(
        data => expect(data).toEqual(testData, 'should return expected locations'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should be OK returning no locations', () => {
      service.getLocations().subscribe(
        data => expect(data.length).toEqual(0, 'should have empty locations array'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush([]);
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';

      service.getLocations().subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected locations (called multiple times)', () => {
      service.getLocations().subscribe();
      service.getLocations().subscribe();
      service.getLocations().subscribe(
        data => expect(data).toEqual(testData, 'should return expected locations'),
        fail
      );

      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3, 'calls to getLocations()');

      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'Test Data' }]);
      requests[2].flush(testData);
    });
  });

  describe('#getLocation', () => {
    it('should return expected location', () => {
      const id = 1;
      const testData: Location = { id: id, name: 'A' };

      service.getLocation(id).subscribe(
        data => expect(data).toEqual(testData, 'should return the location'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.getLocation(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.getLocation(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#addLocation', () => {
    it('should create a location and return it', () => {
      const testData: Location = { id: 1, name: 'A' };

      service.addLocation(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the location'),
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
      const testData: Location = { id: 1, name: 'A' };

      service.addLocation(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: Location = { id: 1, name: 'A' };

      service.addLocation(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#updateLocation', () => {
    it('should update a location and return it', () => {
      const testData: Location = { id: 1, name: 'A' };

      service.updateLocation(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the location'),
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
      const testData: Location = { id: 1, name: 'A' };

      service.updateLocation(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: Location = { id: 1, name: 'A' };

      service.updateLocation(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#deleteLocation', () => {
    it('should delete a location', () => {
      const id = 1;
      const testData: Location = { id: id, name: 'A' };

      service.deleteLocation(id).subscribe(
        data => expect(data).toEqual(testData, 'should delete the location'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('DELETE');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.deleteLocation(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.deleteLocation(id).subscribe(
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
