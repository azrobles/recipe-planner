import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Availability } from '../models/availability.model';
import { AvailabilityService } from '../services/availability.service';

@Component({
  selector: 'app-availability-list',
  templateUrl: './availability-list.component.html',
  styleUrls: ['./availability-list.component.css']
})
export class AvailabilityListComponent implements OnInit {

  errorMessage!: string;
  availabilities$!: Observable<Availability[]>;

  constructor(
    private availabilityService: AvailabilityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAvailabilities();
  }

  getAvailabilities(): void {
    this.errorMessage = '';
    this.availabilities$ = this.availabilityService.getAvailabilities().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => this.errorMessage = err.message || err.toString());
        return of([]);
      })
    );
  }

  gotoAvailabilityDetail(id: number): void {
    this.router.navigate(['/availabilities', id]);
  }

}
