import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Supermarket } from '../models/supermarket.model';

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {

  private supermarketsUrl = '/api/supermarkets';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  clearSupermarket(): Supermarket {
    return { id: undefined, name: '' };
  }

  getSupermarkets(): Observable<Supermarket[]> {
    return this.http.get<Supermarket[]>(this.supermarketsUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSupermarket(id: number): Observable<Supermarket> {
    const url = `${this.supermarketsUrl}/${id}`;
    return this.http.get<Supermarket>(url).pipe(
      catchError(this.handleError)
    );
  }

  addSupermarket(supermarket: Supermarket): Observable<Supermarket> {
    return this.http.post<Supermarket>(this.supermarketsUrl, supermarket, this.httpOptions)
      .pipe(
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
