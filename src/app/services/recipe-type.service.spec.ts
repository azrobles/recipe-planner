import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecipeType } from '../models/recipe-type.model';

import { RecipeTypeService } from './recipe-type.service';

const testUrl = '/api/recipetypes';

describe('RecipeTypeService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: RecipeTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ RecipeTypeService ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RecipeTypeService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#clearRecipeType', () => {
    let testData: RecipeType = { id: undefined, name: '' };

    it('should return cleared recipe type', () => {
      expect(service.clearRecipeType()).toEqual(testData, 'should return cleared recipe type');
    });
  });

  describe('#getRecipeTypes', () => {
    let testData: RecipeType[];

    beforeEach(() => {
      testData = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' }
       ] as RecipeType[];
    });

    it('should return expected recipe types (called once)', () => {
      service.getRecipeTypes().subscribe(
        data => expect(data).toEqual(testData, 'should return expected recipe types'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should be OK returning no recipe types', () => {
      service.getRecipeTypes().subscribe(
        data => expect(data.length).toEqual(0, 'should have empty recipe types array'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush([]);
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';

      service.getRecipeTypes().subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected recipe types (called multiple times)', () => {
      service.getRecipeTypes().subscribe();
      service.getRecipeTypes().subscribe();
      service.getRecipeTypes().subscribe(
        data => expect(data).toEqual(testData, 'should return expected recipe types'),
        fail
      );

      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3, 'calls to getRecipeTypes()');

      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'Test Data' }]);
      requests[2].flush(testData);
    });
  });

  describe('#getRecipeType', () => {
    it('should return expected recipe type', () => {
      const id = 1;
      const testData: RecipeType = { id: id, name: 'A' };

      service.getRecipeType(id).subscribe(
        data => expect(data).toEqual(testData, 'should return the recipe type'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.getRecipeType(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.getRecipeType(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#addRecipeType', () => {
    it('should create a recipe type and return it', () => {
      const testData: RecipeType = { id: 1, name: 'A' };

      service.addRecipeType(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the recipe type'),
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
      const testData: RecipeType = { id: 1, name: 'A' };

      service.addRecipeType(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: RecipeType = { id: 1, name: 'A' };

      service.addRecipeType(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#updateRecipeType', () => {
    it('should update a recipe type and return it', () => {
      const testData: RecipeType = { id: 1, name: 'A' };

      service.updateRecipeType(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the recipe type'),
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
      const testData: RecipeType = { id: 1, name: 'A' };

      service.updateRecipeType(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: RecipeType = { id: 1, name: 'A' };

      service.updateRecipeType(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#deleteRecipeType', () => {
    it('should delete a recipe type', () => {
      const id = 1;
      const testData: RecipeType = { id: id, name: 'A' };

      service.deleteRecipeType(id).subscribe(
        data => expect(data).toEqual(testData, 'should delete the recipe type'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('DELETE');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.deleteRecipeType(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.deleteRecipeType(id).subscribe(
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
