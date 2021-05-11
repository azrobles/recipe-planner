import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { MeasureUnit } from '../models/measure-unit.model';
import { MeasureUnitService } from '../services/measure-unit.service';

@Component({
  selector: 'app-measure-unit-list',
  templateUrl: './measure-unit-list.component.html',
  styleUrls: ['./measure-unit-list.component.css']
})
export class MeasureUnitListComponent implements OnInit {

  errorMessage!: string;
  measureUnits$!: Observable<MeasureUnit[]>;

  constructor(
    private measureUnitService: MeasureUnitService
  ) { }

  ngOnInit(): void {
    this.getMeasureUnits();
  }

  getMeasureUnits(): void {
    this.errorMessage = '';
    this.measureUnits$ = this.measureUnitService.getMeasureUnits().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => this.errorMessage = err.message || err.toString());
        return of([]);
      })
    );
  }

}
