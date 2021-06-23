import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  errorMessage!: string;
  recipes$!: Observable<Recipe[]>;

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getRecipes();
  }

  getRecipes(): void {
    let loading = this.recipeService.clearRecipe();
    loading.name = 'Loading...';

    this.errorMessage = '';
    this.recipes$ = this.recipeService.getRecipes().pipe(
      startWith([loading]),
      catchError( (err: any) => {
        setTimeout(() => this.errorMessage = err.message || err.toString());
        return of([]);
      })
    );
  }

  gotoRecipeDetail(id: number): void {
    this.router.navigate(['/recipes', id]);
  }

}
