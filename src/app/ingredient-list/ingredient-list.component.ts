import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Ingredient } from '../models/ingredient.model';
import { IngredientService } from '../services/ingredient.service';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent implements OnInit {

  errorMessage!: string;
  ingredients$!: Observable<Ingredient[]>;

  constructor(
    private ingredientService: IngredientService
  ) { }

  ngOnInit(): void {
    this.getIngredients();
  }

  getIngredients(): void {
    let loading = this.ingredientService.clearIngredient();
    loading.name = 'Loading...';

    this.errorMessage = '';
    this.ingredients$ = this.ingredientService.getIngredients().pipe(
      startWith([loading]),
      catchError( (err: any) => {
        setTimeout(() => this.errorMessage = err.message || err.toString());
        return of([]);
      })
    );
  }

}
