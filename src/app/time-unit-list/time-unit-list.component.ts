import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { TimeUnit } from '../models/time-unit.model';
import { TimeUnitService } from '../services/time-unit.service';

@Component({
  selector: 'app-time-unit-list',
  templateUrl: './time-unit-list.component.html',
  styleUrls: ['./time-unit-list.component.css']
})
export class TimeUnitListComponent implements OnInit {

  errorMessage!: string;
  timeUnits$!: Observable<TimeUnit[]>;

  constructor(
    private timeUnitService: TimeUnitService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getTimeUnits();
  }

  getTimeUnits(): void {
    this.errorMessage = '';
    this.timeUnits$ = this.timeUnitService.getTimeUnits().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => this.errorMessage = err.message || err.toString());
        return of([]);
      })
    );
  }

  gotoTimeUnitDetail(id: number): void {
    this.router.navigate(['/timeunits', id]);
  }

}
