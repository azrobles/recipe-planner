import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Ingredient } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  private ingredientsUrl = '/api/ingredients';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  clearIngredient(): Ingredient {
    return { id: undefined, name: '',
        availability: { id: undefined, name: '' },
        supermarket: { id: undefined, name: '' } };
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.ingredientsUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getIngredient(id: number): Observable<Ingredient> {
    const url = `${this.ingredientsUrl}/${id}`;
    return this.http.get<Ingredient>(url).pipe(
      catchError(this.handleError)
    );
  }

  addIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.ingredientsUrl, ingredient, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateIngredient(ingredient: Ingredient): Observable<Ingredient> {
    const url = `${this.ingredientsUrl}/${ingredient.id}`;
    return this.http.put<Ingredient>(url, ingredient, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteIngredient(id: number): Observable<Ingredient> {
    const url = `${this.ingredientsUrl}/${id}`;
    return this.http.delete<Ingredient>(url, this.httpOptions).pipe(
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
