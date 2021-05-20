import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Season } from '../models/season.model';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  private seasonsUrl = '/api/seasons';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  clearSeason(): Season {
    return { id: undefined, name: '' };
  }

  getSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(this.seasonsUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSeason(id: number): Observable<Season> {
    const url = `${this.seasonsUrl}/${id}`;
    return this.http.get<Season>(url).pipe(
      catchError(this.handleError)
    );
  }

  addSeason(season: Season): Observable<Season> {
    return this.http.post<Season>(this.seasonsUrl, season, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateSeason(season: Season): Observable<Season> {
    const url = `${this.seasonsUrl}/${season.id}`;
    return this.http.put<Season>(url, season, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteSeason(id: number): Observable<Season> {
    const url = `${this.seasonsUrl}/${id}`;
    return this.http.delete<Season>(url, this.httpOptions).pipe(
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
