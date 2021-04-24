import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { SupermarketService } from './supermarket.service';
import { Supermarket } from '../models/supermarket.model';

const testUrl = '/api/supermarkets';

describe('SupermarketService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: SupermarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ SupermarketService ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SupermarketService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getSupermarkets', () => {
    let testData: Supermarket[];

    beforeEach(() => {
      testData = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
       ] as Supermarket[];
    });

    it('should return expected supermarkets (called once)', () => {
      service.getSupermarkets().subscribe(
        data => expect(data).toEqual(testData, 'should return expected supermarkets'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should be OK returning no supermarkets', () => {
      service.getSupermarkets().subscribe(
        data => expect(data.length).toEqual(0, 'should have empty supermarkets array'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush([]);
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';

      service.getSupermarkets().subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected supermarkets (called multiple times)', () => {
      service.getSupermarkets().subscribe();
      service.getSupermarkets().subscribe();
      service.getSupermarkets().subscribe(
        data => expect(data).toEqual(testData, 'should return expected supermarkets'),
        fail
      );

      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3, 'calls to getSupermarkets()');

      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'Test Data' }]);
      requests[2].flush(testData);
    });
  });

  describe('#addSupermarket', () => {
    it('should create a supermarket and return it', () => {
      const testData: Supermarket = { id: 1, name: 'A' };

      service.addSupermarket(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the supermarket'),
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
      const testData: Supermarket = { id: 1, name: 'A' };

      service.addSupermarket(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: Supermarket = { id: 1, name: 'A' };

      service.addSupermarket(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl);

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
