import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TimeUnit } from '../models/time-unit.model';

@Injectable({
  providedIn: 'root'
})
export class TimeUnitService {

  private timeUnitsUrl = '/api/timeunits';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  clearTimeUnit(): TimeUnit {
    return { id: undefined, name: '' };
  }

  getTimeUnits(): Observable<TimeUnit[]> {
    return this.http.get<TimeUnit[]>(this.timeUnitsUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTimeUnit(id: number): Observable<TimeUnit> {
    const url = `${this.timeUnitsUrl}/${id}`;
    return this.http.get<TimeUnit>(url).pipe(
      catchError(this.handleError)
    );
  }

  addTimeUnit(timeUnit: TimeUnit): Observable<TimeUnit> {
    return this.http.post<TimeUnit>(this.timeUnitsUrl, timeUnit, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTimeUnit(timeUnit: TimeUnit): Observable<TimeUnit> {
    const url = `${this.timeUnitsUrl}/${timeUnit.id}`;
    return this.http.put<TimeUnit>(url, timeUnit, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTimeUnit(id: number): Observable<TimeUnit> {
    const url = `${this.timeUnitsUrl}/${id}`;
    return this.http.delete<TimeUnit>(url, this.httpOptions).pipe(
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
