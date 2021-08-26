import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RecipeIngredient } from '../models/recipe-ingredient.model';
import { Recipe } from '../models/recipe.model';
import { IngredientService } from './ingredient.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private recipesUrl = '/api/recipes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private ingredientService: IngredientService
  ) { }

  clearRecipe(): Recipe {
    return { id: undefined, name: '',
        location: { id: undefined, name: '' },
        type: { id: undefined, name: '' },
        season: { id: undefined, name: '' },
        difficulty: { id: undefined, name: '' },
        frequency: 0 };
  }

  clearRecipeIngredient(): RecipeIngredient {
    return { id: undefined,
        ingredient: this.ingredientService.clearIngredient(),
        amount: 0,
        measureUnit: { id: undefined, name: '' },
        optional: false };
  }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipesUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getRecipe(id: number): Observable<Recipe> {
    const url = `${this.recipesUrl}/${id}`;
    return this.http.get<Recipe>(url).pipe(
      catchError(this.handleError)
    );
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.recipesUrl, recipe, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    const url = `${this.recipesUrl}/${recipe.id}`;
    return this.http.put<Recipe>(url, recipe, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteRecipe(id: number): Observable<Recipe> {
    const url = `${this.recipesUrl}/${id}`;
    return this.http.delete<Recipe>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);

    const message = (error.error instanceof ErrorEvent) ?
      error.error.message :
     `Server returned code ${error.status} with body: "${error.error}"`;

    return throwError(`${message}`);
  }

}
