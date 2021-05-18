import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Location } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private locationsUrl = '/api/locations';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  clearLocation(): Location {
    return { id: undefined, name: '' };
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.locationsUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getLocation(id: number): Observable<Location> {
    const url = `${this.locationsUrl}/${id}`;
    return this.http.get<Location>(url).pipe(
      catchError(this.handleError)
    );
  }

  addLocation(location: Location): Observable<Location> {
    return this.http.post<Location>(this.locationsUrl, location, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateLocation(location: Location): Observable<Location> {
    const url = `${this.locationsUrl}/${location.id}`;
    return this.http.put<Location>(url, location, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteLocation(id: number): Observable<Location> {
    const url = `${this.locationsUrl}/${id}`;
    return this.http.delete<Location>(url, this.httpOptions).pipe(
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
