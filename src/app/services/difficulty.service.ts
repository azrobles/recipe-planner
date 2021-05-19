import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Difficulty } from '../models/difficulty.model';

@Injectable({
  providedIn: 'root'
})
export class DifficultyService {

  private difficultiesUrl = '/api/difficulties';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  clearDifficulty(): Difficulty {
    return { id: undefined, name: '' };
  }

  getDifficulties(): Observable<Difficulty[]> {
    return this.http.get<Difficulty[]>(this.difficultiesUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getDifficulty(id: number): Observable<Difficulty> {
    const url = `${this.difficultiesUrl}/${id}`;
    return this.http.get<Difficulty>(url).pipe(
      catchError(this.handleError)
    );
  }

  addDifficulty(difficulty: Difficulty): Observable<Difficulty> {
    return this.http.post<Difficulty>(this.difficultiesUrl, difficulty, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateDifficulty(difficulty: Difficulty): Observable<Difficulty> {
    const url = `${this.difficultiesUrl}/${difficulty.id}`;
    return this.http.put<Difficulty>(url, difficulty, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteDifficulty(id: number): Observable<Difficulty> {
    const url = `${this.difficultiesUrl}/${id}`;
    return this.http.delete<Difficulty>(url, this.httpOptions).pipe(
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
