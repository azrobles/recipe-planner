import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Difficulty } from '../models/difficulty.model';
import { Location } from '../models/location.model';
import { RecipeType } from '../models/recipe-type.model';
import { Recipe } from '../models/recipe.model';
import { Season } from '../models/season.model';
import { DifficultyService } from '../services/difficulty.service';
import { LocationService } from '../services/location.service';
import { RecipeTypeService } from '../services/recipe-type.service';
import { RecipeService } from '../services/recipe.service';
import { SeasonService } from '../services/season.service';
import { compareIdFn, idRequiredValidator } from '../validators/custom.validators';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {

  compareIdFn = compareIdFn;
  locations$!: Observable<Location[]>;
  types$!: Observable<RecipeType[]>;
  seasons$!: Observable<Season[]>;
  difficulties$!: Observable<Difficulty[]>;
  errorMessage!: string;
  recipe!: Recipe;
  recipeForm!: FormGroup;
  isAddMode!: boolean;
  loading = false;

  constructor(
    private locationService: LocationService,
    private typeService: RecipeTypeService,
    private seasonService: SeasonService,
    private difficultyService: DifficultyService,
    private recipeService: RecipeService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getLocations();
    this.getTypes();
    this.getSeasons();
    this.getDifficulties();

    this.clearRecipe();

    this.recipeForm = this.fb.group(this.recipe);
    this.name!.setValidators(Validators.required);
    this.name!.setValidators(Validators.maxLength(100));
    this.location!.setValidators(idRequiredValidator());
    this.type!.setValidators(idRequiredValidator());
    this.season!.setValidators(idRequiredValidator());
    this.difficulty!.setValidators(idRequiredValidator());

    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.isAddMode = !id;
    if(!this.isAddMode) {
      this.getRecipe(id);
    }
  }

  private getLocations(): void {
    this.locations$ = this.locationService.getLocations().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => console.error('Error loading locations from server'));
        return of([{ name: 'Error' }]);
      })
    );
  }

  private getTypes(): void {
    this.types$ = this.typeService.getRecipeTypes().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => console.error('Error loading types from server'));
        return of([{ name: 'Error' }]);
      })
    );
  }

  private getSeasons(): void {
    this.seasons$ = this.seasonService.getSeasons().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => console.error('Error loading seasons from server'));
        return of([{ name: 'Error' }]);
      })
    );
  }

  private getDifficulties(): void {
    this.difficulties$ = this.difficultyService.getDifficulties().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => console.error('Error loading difficulties from server'));
        return of([{ name: 'Error' }]);
      })
    );
  }

  private getRecipe(id: number): void {
    this.loading = true;
    this.recipeService.getRecipe(id).subscribe({
      next: data => {
        if(data) {
          this.recipe = data;
          this.recipeForm.patchValue(this.recipe);
        } else {
          this.isAddMode = true;
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.isAddMode = true;
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  get name() { return this.recipeForm.get('name'); }
  get location() { return this.recipeForm.get('location'); }
  get type() { return this.recipeForm.get('type'); }
  get season() { return this.recipeForm.get('season'); }
  get difficulty() { return this.recipeForm.get('difficulty'); }

  onSubmit(): void {
    if(this.isAddMode) {
      this.addRecipe();
    } else {
      this.updateRecipe();
    }
  }

  onReset($event: Event): void {
    $event.preventDefault();
    this.recipeForm.reset(this.recipe);
  }

  clearRecipe(): void {
    this.errorMessage = '';
    this.recipe = this.recipeService.clearRecipe();
  }

  addRecipe(): void {
    this.loading = true;
    this.errorMessage = '';
    this.recipeService.addRecipe(this.recipeForm.value).subscribe({
      next: data => this.gotoRecipeList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  updateRecipe(): void {
    this.loading = true;
    this.errorMessage = '';
    this.recipeService.updateRecipe(this.recipeForm.value).subscribe({
      next: data => this.gotoRecipeList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  deleteRecipe(): void {
    this.loading = true;
    this.errorMessage = '';
    this.recipeService.deleteRecipe(this.recipe.id!).subscribe({
      next: data => this.gotoRecipeList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  gotoRecipeList(): void {
    this.router.navigate(['/recipes']);
  }

}
