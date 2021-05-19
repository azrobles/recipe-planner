import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Difficulty } from '../models/difficulty.model';
import { DifficultyService } from '../services/difficulty.service';

@Component({
  selector: 'app-difficulty-list',
  templateUrl: './difficulty-list.component.html',
  styleUrls: ['./difficulty-list.component.css']
})
export class DifficultyListComponent implements OnInit {

  errorMessage!: string;
  difficulties$!: Observable<Difficulty[]>;

  constructor(
    private difficultyService: DifficultyService
  ) { }

  ngOnInit(): void {
    this.getDifficulties();
  }

  getDifficulties(): void {
    this.errorMessage = '';
    this.difficulties$ = this.difficultyService.getDifficulties().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => this.errorMessage = err.message || err.toString());
        return of([]);
      })
    );
  }

}
