import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RecipeType } from '../models/recipe-type.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeTypeService {

  private recipeTypesUrl = '/api/recipetypes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  clearRecipeType(): RecipeType {
    return { id: undefined, name: '' };
  }

  getRecipeTypes(): Observable<RecipeType[]> {
    return this.http.get<RecipeType[]>(this.recipeTypesUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getRecipeType(id: number): Observable<RecipeType> {
    const url = `${this.recipeTypesUrl}/${id}`;
    return this.http.get<RecipeType>(url).pipe(
      catchError(this.handleError)
    );
  }

  addRecipeType(recipeType: RecipeType): Observable<RecipeType> {
    return this.http.post<RecipeType>(this.recipeTypesUrl, recipeType, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateRecipeType(recipeType: RecipeType): Observable<RecipeType> {
    const url = `${this.recipeTypesUrl}/${recipeType.id}`;
    return this.http.put<RecipeType>(url, recipeType, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteRecipeType(id: number): Observable<RecipeType> {
    const url = `${this.recipeTypesUrl}/${id}`;
    return this.http.delete<RecipeType>(url, this.httpOptions).pipe(
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
