import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MeasureUnit } from '../models/measure-unit.model';

@Injectable({
  providedIn: 'root'
})
export class MeasureUnitService {

  private measureUnitsUrl = '/api/measureunits';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  clearMeasureUnit(): MeasureUnit {
    return { id: undefined, name: '' };
  }

  getMeasureUnits(): Observable<MeasureUnit[]> {
    return this.http.get<MeasureUnit[]>(this.measureUnitsUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMeasureUnit(id: number): Observable<MeasureUnit> {
    const url = `${this.measureUnitsUrl}/${id}`;
    return this.http.get<MeasureUnit>(url).pipe(
      catchError(this.handleError)
    );
  }

  addMeasureUnit(measureUnit: MeasureUnit): Observable<MeasureUnit> {
    return this.http.post<MeasureUnit>(this.measureUnitsUrl, measureUnit, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateMeasureUnit(measureUnit: MeasureUnit): Observable<MeasureUnit> {
    const url = `${this.measureUnitsUrl}/${measureUnit.id}`;
    return this.http.put<MeasureUnit>(url, measureUnit, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteMeasureUnit(id: number): Observable<MeasureUnit> {
    const url = `${this.measureUnitsUrl}/${id}`;
    return this.http.delete<MeasureUnit>(url, this.httpOptions).pipe(
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
