import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Season } from '../models/season.model';

import { SeasonService } from './season.service';

const testUrl = '/api/seasons';

describe('SeasonService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: SeasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ SeasonService ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SeasonService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#clearSeason', () => {
    let testData: Season = { id: undefined, name: '' };

    it('should return cleared season', () => {
      expect(service.clearSeason()).toEqual(testData, 'should return cleared season');
    });
  });

  describe('#getSeasons', () => {
    let testData: Season[];

    beforeEach(() => {
      testData = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' }
       ] as Season[];
    });

    it('should return expected seasons (called once)', () => {
      service.getSeasons().subscribe(
        data => expect(data).toEqual(testData, 'should return expected seasons'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should be OK returning no seasons', () => {
      service.getSeasons().subscribe(
        data => expect(data.length).toEqual(0, 'should have empty seasons array'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush([]);
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';

      service.getSeasons().subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected seasons (called multiple times)', () => {
      service.getSeasons().subscribe();
      service.getSeasons().subscribe();
      service.getSeasons().subscribe(
        data => expect(data).toEqual(testData, 'should return expected seasons'),
        fail
      );

      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3, 'calls to getSeasons()');

      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'Test Data' }]);
      requests[2].flush(testData);
    });
  });

  describe('#getSeason', () => {
    it('should return expected season', () => {
      const id = 1;
      const testData: Season = { id: id, name: 'A' };

      service.getSeason(id).subscribe(
        data => expect(data).toEqual(testData, 'should return the season'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.getSeason(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.getSeason(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#addSeason', () => {
    it('should create a season and return it', () => {
      const testData: Season = { id: 1, name: 'A' };

      service.addSeason(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the season'),
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
      const testData: Season = { id: 1, name: 'A' };

      service.addSeason(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: Season = { id: 1, name: 'A' };

      service.addSeason(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#updateSeason', () => {
    it('should update a season and return it', () => {
      const testData: Season = { id: 1, name: 'A' };

      service.updateSeason(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the season'),
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
      const testData: Season = { id: 1, name: 'A' };

      service.updateSeason(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: Season = { id: 1, name: 'A' };

      service.updateSeason(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#deleteSeason', () => {
    it('should delete a season', () => {
      const id = 1;
      const testData: Season = { id: id, name: 'A' };

      service.deleteSeason(id).subscribe(
        data => expect(data).toEqual(testData, 'should delete the season'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('DELETE');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.deleteSeason(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.deleteSeason(id).subscribe(
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
