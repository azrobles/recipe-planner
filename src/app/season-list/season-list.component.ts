import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Season } from '../models/season.model';
import { SeasonService } from '../services/season.service';

@Component({
  selector: 'app-season-list',
  templateUrl: './season-list.component.html',
  styleUrls: ['./season-list.component.css']
})
export class SeasonListComponent implements OnInit {

  errorMessage!: string;
  seasons$!: Observable<Season[]>;

  constructor(
    private seasonService: SeasonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSeasons();
  }

  getSeasons(): void {
    this.errorMessage = '';
    this.seasons$ = this.seasonService.getSeasons().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => this.errorMessage = err.message || err.toString());
        return of([]);
      })
    );
  }

  gotoSeasonDetail(id: number): void {
    this.router.navigate(['/seasons', id]);
  }

}
