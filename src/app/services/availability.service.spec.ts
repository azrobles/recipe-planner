import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Availability } from '../models/availability.model';

import { AvailabilityService } from './availability.service';

const testUrl = '/api/availabilities';

describe('AvailabilityService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: AvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AvailabilityService ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AvailabilityService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#clearAvailability', () => {
    let testData: Availability = { id: undefined, name: '' };

    it('should return cleared availability', () => {
      expect(service.clearAvailability()).toEqual(testData, 'should return cleared availability');
    });
  });

  describe('#getAvailabilities', () => {
    let testData: Availability[];

    beforeEach(() => {
      testData = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' }
       ] as Availability[];
    });

    it('should return expected availabilities (called once)', () => {
      service.getAvailabilities().subscribe(
        data => expect(data).toEqual(testData, 'should return expected availabilities'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should be OK returning no availabilities', () => {
      service.getAvailabilities().subscribe(
        data => expect(data.length).toEqual(0, 'should have empty availabilities array'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush([]);
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';

      service.getAvailabilities().subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected availabilities (called multiple times)', () => {
      service.getAvailabilities().subscribe();
      service.getAvailabilities().subscribe();
      service.getAvailabilities().subscribe(
        data => expect(data).toEqual(testData, 'should return expected availabilities'),
        fail
      );

      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3, 'calls to getAvailabilities()');

      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'Test Data' }]);
      requests[2].flush(testData);
    });
  });

  describe('#getAvailability', () => {
    it('should return expected availability', () => {
      const id = 1;
      const testData: Availability = { id: id, name: 'A' };

      service.getAvailability(id).subscribe(
        data => expect(data).toEqual(testData, 'should return the availability'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.getAvailability(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.getAvailability(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#addAvailability', () => {
    it('should create an availability and return it', () => {
      const testData: Availability = { id: 1, name: 'A' };

      service.addAvailability(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the availability'),
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
      const testData: Availability = { id: 1, name: 'A' };

      service.addAvailability(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: Availability = { id: 1, name: 'A' };

      service.addAvailability(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#updateAvailability', () => {
    it('should update an availability and return it', () => {
      const testData: Availability = { id: 1, name: 'A' };

      service.updateAvailability(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the availability'),
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
      const testData: Availability = { id: 1, name: 'A' };

      service.updateAvailability(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: Availability = { id: 1, name: 'A' };

      service.updateAvailability(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#deleteAvailability', () => {
    it('should delete an availability', () => {
      const id = 1;
      const testData: Availability = { id: id, name: 'A' };

      service.deleteAvailability(id).subscribe(
        data => expect(data).toEqual(testData, 'should delete the availability'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('DELETE');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.deleteAvailability(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.deleteAvailability(id).subscribe(
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
