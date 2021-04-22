import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { SupermarketService } from './supermarket.service';
import { Supermarket } from '../models/supermarket.model';

const testUrl = '/api/supermarkets';

describe('SupermarketService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: SupermarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SupermarketService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('can test HttpClient.getSupermarkets', () => {
    const testData: Supermarket[] = [{id: 1, name: 'Test Data'}];

    httpClient.get<Supermarket[]>(testUrl)
      .subscribe(data =>
        expect(data).toEqual(testData)
      );

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.method).toEqual('GET');

    req.flush(testData);
  });

  it('can test for 404 error', () => {
    const emsg = 'deliberate 404 error';

    httpClient.get<Supermarket[]>(testUrl).subscribe(
      data => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(emsg, 'message');
      }
    );

    const req = httpTestingController.expectOne(testUrl);

    req.flush(emsg, { status: 404, statusText: 'Not Found' });
  });

  it('can test for network error', () => {
    const emsg = 'simulated network error';

    httpClient.get<Supermarket[]>(testUrl).subscribe(
      data => fail('should have failed with the network error'),
      (error: HttpErrorResponse) => {
        expect(error.error.message).toEqual(emsg, 'message');
      }
    );

    const req = httpTestingController.expectOne(testUrl);

    const mockError = new ErrorEvent('Network error', {
      message: emsg
    });

    req.error(mockError);
  });

  it('httpTestingController.verify should fail if HTTP response not simulated', () => {
    httpClient.get('some/api').subscribe();

    expect(() => httpTestingController.verify()).toThrow();

    const req = httpTestingController.expectOne('some/api');
    req.flush(null);
  });
});
