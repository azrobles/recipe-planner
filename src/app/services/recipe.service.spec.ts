import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Recipe } from '../models/recipe.model';

import { RecipeService } from './recipe.service';

const testUrl = '/api/recipes';

describe('RecipeService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: RecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ RecipeService ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RecipeService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#clearRecipe', () => {
    let testData: Recipe = { id: undefined, name: '',
      location: { id: undefined, name: '' },
      type: { id: undefined, name: '' },
      season: { id: undefined, name: '' },
      difficulty: { id: undefined, name: '' },
      frequency: 0,
      ingredients: []
    };

    it('should return cleared recipe', () => {
      expect(service.clearRecipe()).toEqual(testData, 'should return cleared recipe');
    });
  });

  describe('#getRecipes', () => {
    let testData: Recipe[];

    beforeEach(() => {
      testData = [
        { id: 1, name: 'A', location: { id: 1, name: 'A' },
          type: { id: 1, name: 'A' }, season: { id: 1, name: 'A' },
          difficulty: { id: 1, name: 'A' }, frequency: 1, ingredients: [] },
        { id: 2, name: 'B', location: { id: 1, name: 'A' },
          type: { id: 1, name: 'A' }, season: { id: 1, name: 'A' },
          difficulty: { id: 1, name: 'A' }, frequency: 1, ingredients: [] }
       ] as Recipe[];
    });

    it('should return expected recipes (called once)', () => {
      service.getRecipes().subscribe(
        data => expect(data).toEqual(testData, 'should return expected recipes'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should be OK returning no recipes', () => {
      service.getRecipes().subscribe(
        data => expect(data.length).toEqual(0, 'should have empty recipes array'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush([]);
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';

      service.getRecipes().subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected recipes (called multiple times)', () => {
      service.getRecipes().subscribe();
      service.getRecipes().subscribe();
      service.getRecipes().subscribe(
        data => expect(data).toEqual(testData, 'should return expected recipes'),
        fail
      );

      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3, 'calls to getRecipes()');

      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'Test Data' }]);
      requests[2].flush(testData);
    });
  });

  describe('#getRecipe', () => {
    it('should return expected recipe', () => {
      const id = 1;
      const testData: Recipe = { id: id, name: 'A',
        location: { id: 1, name: 'A' },
        type: { id: 1, name: 'A' },
        season: { id: 1, name: 'A' },
        difficulty: { id: 1, name: 'A' },
        frequency: 1,
        ingredients: []
      };

      service.getRecipe(id).subscribe(
        data => expect(data).toEqual(testData, 'should return the recipe'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('GET');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.getRecipe(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.getRecipe(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#addRecipe', () => {
    it('should create a recipe and return it', () => {
      const testData: Recipe = { id: 1, name: 'A',
        location: { id: 1, name: 'A' },
        type: { id: 1, name: 'A' },
        season: { id: 1, name: 'A' },
        difficulty: { id: 1, name: 'A' },
        frequency: 1,
        ingredients: []
      };

      service.addRecipe(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the recipe'),
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
      const testData: Recipe = { id: 1, name: 'A',
        location: { id: 1, name: 'A' },
        type: { id: 1, name: 'A' },
        season: { id: 1, name: 'A' },
        difficulty: { id: 1, name: 'A' },
        frequency: 1,
        ingredients: []
      };

      service.addRecipe(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: Recipe = { id: 1, name: 'A',
        location: { id: 1, name: 'A' },
        type: { id: 1, name: 'A' },
        season: { id: 1, name: 'A' },
        difficulty: { id: 1, name: 'A' },
        frequency: 1,
        ingredients: []
      };

      service.addRecipe(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#updateRecipe', () => {
    it('should update a recipe and return it', () => {
      const testData: Recipe = { id: 1, name: 'A',
        location: { id: 1, name: 'A' },
        type: { id: 1, name: 'A' },
        season: { id: 1, name: 'A' },
        difficulty: { id: 1, name: 'A' },
        frequency: 1,
        ingredients: []
      };

      service.updateRecipe(testData).subscribe(
        data => expect(data).toEqual(testData, 'should return the recipe'),
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
      const testData: Recipe = { id: 1, name: 'A',
        location: { id: 1, name: 'A' },
        type: { id: 1, name: 'A' },
        season: { id: 1, name: 'A' },
        difficulty: { id: 1, name: 'A' },
        frequency: 1,
        ingredients: []
      };

      service.updateRecipe(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';
      const testData: Recipe = { id: 1, name: 'A',
        location: { id: 1, name: 'A' },
        type: { id: 1, name: 'A' },
        season: { id: 1, name: 'A' },
        difficulty: { id: 1, name: 'A' },
        frequency: 1,
        ingredients: []
      };

      service.updateRecipe(testData).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(emsg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${testData.id}`);

      const errorEvent = new ErrorEvent('Network error', { message: emsg });
      req.error(errorEvent);
    });
  });

  describe('#deleteRecipe', () => {
    it('should delete a recipe', () => {
      const id = 1;
      const testData: Recipe = { id: 1, name: 'A',
        location: { id: 1, name: 'A' },
        type: { id: 1, name: 'A' },
        season: { id: 1, name: 'A' },
        difficulty: { id: 1, name: 'A' },
        frequency: 1,
        ingredients: []
      };

      service.deleteRecipe(id).subscribe(
        data => expect(data).toEqual(testData, 'should delete the recipe'),
        fail
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      expect(req.request.method).toEqual('DELETE');

      req.flush(testData);
    });

    it('should turn 404 error into user-facing error', () => {
      const id = 1;
      const msg = 'Deliberate 404';

      service.deleteRecipe(id).subscribe(
        data => fail('expected to fail'),
        error => expect(error).toContain(msg)
      );

      const req = httpTestingController.expectOne(testUrl + `/${id}`);
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const id = 1;
      const emsg = 'simulated network error';

      service.deleteRecipe(id).subscribe(
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
