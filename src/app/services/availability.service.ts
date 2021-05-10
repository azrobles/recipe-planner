import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Availability } from '../models/availability.model';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  private availabilitiesUrl = '/api/availabilities';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  clearAvailability(): Availability {
    return { id: undefined, name: '' };
  }

  getAvailabilities(): Observable<Availability[]> {
    return this.http.get<Availability[]>(this.availabilitiesUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAvailability(id: number): Observable<Availability> {
    const url = `${this.availabilitiesUrl}/${id}`;
    return this.http.get<Availability>(url).pipe(
      catchError(this.handleError)
    );
  }

  addAvailability(availability: Availability): Observable<Availability> {
    return this.http.post<Availability>(this.availabilitiesUrl, availability, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAvailability(availability: Availability): Observable<Availability> {
    const url = `${this.availabilitiesUrl}/${availability.id}`;
    return this.http.put<Availability>(url, availability, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteAvailability(id: number): Observable<Availability> {
    const url = `${this.availabilitiesUrl}/${id}`;
    return this.http.delete<Availability>(url, this.httpOptions).pipe(
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
