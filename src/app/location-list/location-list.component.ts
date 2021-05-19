import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Location } from '../models/location.model';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css']
})
export class LocationListComponent implements OnInit {

  errorMessage!: string;
  locations$!: Observable<Location[]>;

  constructor(
    private locationService: LocationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getLocations();
  }

  getLocations(): void {
    this.errorMessage = '';
    this.locations$ = this.locationService.getLocations().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => this.errorMessage = err.message || err.toString());
        return of([]);
      })
    );
  }

  gotoLocationDetail(id: number): void {
    this.router.navigate(['/locations', id]);
  }

}
