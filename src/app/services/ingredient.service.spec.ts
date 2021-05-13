import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Ingredient } from '../models/ingredient.model';

import { IngredientService } from './ingredient.service';

const testUrl = '/api/ingredients';

describe('IngredientService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: IngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ IngredientService ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(IngredientService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#clearIngredient', () => {
    let testData: Ingredient = { id: undefined, name: '',
      availability: { id: undefined, name: '' },
      supermarket: { id: undefined, name: '' }
    };

    it('should return cleared ingredient', () => {
      expect(service.clearIngredient()).toEqual(testData, 'should return cleared ingredient');
    });
  });

  describe('#getIngredients', () => {
    let testData: Ingredient[];

    beforeEach(() => {
      testData = [
        { id: 1, name: 'A', availability: { id: 1, name: 'A' },
          supermarket: { id: 1, name: 'A' } },
        { id: 2, name: 'B', availability: { id: 1, name: 'A' },
          supermarket: { id: 1, name: 'A' } },
       ] as Ingredient[];
    });

    it('should return expected ingredients (called once)', () => {
      service.getIngredients().subscribe(
        data => expect(data).toEqual(testData, 'should return expected ingredients'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should be OK returning no ingredients', () => {
      service.getIngredients().subscribe(
        data => expect(data.length).toEqual(0, 'should have empty ingredients array'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush([]);
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';

      service.getIngredients().subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected ingredients (called multiple times)', () => {
      service.getIngredients().subscribe();
      service.getIngredients().subscribe();
      service.getIngredients().subscribe(
        data => expect(data).toEqual(testData, 'should return expected ingredients'),
        fail
      );

      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3, 'calls to getIngredients()');

      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'Test Data' }]);
      requests[2].flush(testData);
    });
  });

  describe('#getIngredient', () => {
    it('should return expected ingredient', () => {
      const id = 1;
      const testData: Ingredient = { id: id, name: 'A',
        availability: { id: id, name: 'A' },
        supermarket: { id: id, name: 'A' }
      };

      service.getIngredient(id).subscribe(
        data => expect(data).toEqual(testData, 'should return the ingredient'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.getIngredient(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.getIngredient(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#addIngredient', () => {
    it('should create an ingredient and return it', () => {
      const testData: Ingredient = { id: 1, name: 'A',
        availability: { id: 1, name: 'A' },
        supermarket: { id: 1, name: 'A' }
      };

      service.addIngredient(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the ingredient'),
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
      const testData: Ingredient = { id: 1, name: 'A',
        availability: { id: 1, name: 'A' },
        supermarket: { id: 1, name: 'A' }
      };

      service.addIngredient(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: Ingredient = { id: 1, name: 'A',
        availability: { id: 1, name: 'A' },
        supermarket: { id: 1, name: 'A' }
      };

      service.addIngredient(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#updateIngredient', () => {
    it('should update an ingredient and return it', () => {
      const testData: Ingredient = { id: 1, name: 'A',
        availability: { id: 1, name: 'A' },
        supermarket: { id: 1, name: 'A' }
      };

      service.updateIngredient(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the ingredient'),
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
      const testData: Ingredient = { id: 1, name: 'A',
        availability: { id: 1, name: 'A' },
        supermarket: { id: 1, name: 'A' }
      };

      service.updateIngredient(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: Ingredient = { id: 1, name: 'A',
        availability: { id: 1, name: 'A' },
        supermarket: { id: 1, name: 'A' }
      };

      service.updateIngredient(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#deleteIngredient', () => {
    it('should delete an ingredient', () => {
      const id = 1;
      const testData: Ingredient = { id: 1, name: 'A',
        availability: { id: 1, name: 'A' },
        supermarket: { id: 1, name: 'A' }
      };

      service.deleteIngredient(id).subscribe(
        data => expect(data).toEqual(testData, 'should delete the ingredient'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('DELETE');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.deleteIngredient(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.deleteIngredient(id).subscribe(
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
