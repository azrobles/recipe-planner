import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { RecipeType } from '../models/recipe-type.model';
import { RecipeTypeService } from '../services/recipe-type.service';

@Component({
  selector: 'app-recipe-type-list',
  templateUrl: './recipe-type-list.component.html',
  styleUrls: ['./recipe-type-list.component.css']
})
export class RecipeTypeListComponent implements OnInit {

  errorMessage!: string;
  recipeTypes$!: Observable<RecipeType[]>;

  constructor(
    private recipeTypeService: RecipeTypeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getRecipeTypes();
  }

  getRecipeTypes(): void {
    this.errorMessage = '';
    this.recipeTypes$ = this.recipeTypeService.getRecipeTypes().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => this.errorMessage = err.message || err.toString());
        return of([]);
      })
    );
  }

  gotoRecipeTypeDetail(id: number): void {
    this.router.navigate(['/recipetypes', id]);
  }

}
