import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Ingredient } from '../models/ingredient.model';
import { MeasureUnit } from '../models/measure-unit.model';
import { RecipeIngredient } from '../models/recipe-ingredient.model';
import { IngredientService } from '../services/ingredient.service';
import { MeasureUnitService } from '../services/measure-unit.service';
import { RecipeService } from '../services/recipe.service';
import { compareIdFn, idRequiredValidator } from '../validators/custom.validators';

@Component({
  selector: 'app-recipe-ingredient-quantity-form',
  templateUrl: './recipe-ingredient-quantity-form.component.html',
  styleUrls: ['./recipe-ingredient-quantity-form.component.css']
})
export class RecipeIngredientQuantityFormComponent implements OnInit {

  compareIdFn = compareIdFn;
  ingredients$!: Observable<Ingredient[]>;
  measureUnits$!: Observable<MeasureUnit[]>;
  @Input() form!: FormGroup;

  constructor(
    private ingredientService: IngredientService,
    private measureUnitService: MeasureUnitService,
    private recipeService: RecipeService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getIngredients();
    this.getMeasureUnits();

    this.form.addControl('ingredients', this.fb.array([]));
  }

  private getIngredients(): void {
    let loading = this.ingredientService.clearIngredient();
    loading.name = 'Loading...';

    this.ingredients$ = this.ingredientService.getIngredients().pipe(
      startWith([loading]),
      catchError( (err: any) => {
        setTimeout(() => console.error('Error loading ingredients from server'));
        loading.name = 'Error';
        return of([loading]);
      })
    );
  }

  private getMeasureUnits(): void {
    this.measureUnits$ = this.measureUnitService.getMeasureUnits().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => console.error('Error loading measure units from server'));
        return of([{ name: 'Error' }]);
      })
    );
  }

  addIngredientQuantities(ingredientQuantities?: RecipeIngredient[]) {
    if (ingredientQuantities) {
      for (let ingredient of ingredientQuantities) {
        this.addIngredient(ingredient);
      }
    }
  }

  get array() { return this.form.get('ingredients') as FormArray; }

  addIngredient(ingredientQuantity?: RecipeIngredient) {
    if (ingredientQuantity) {
      this.array.push(this.fb.group(ingredientQuantity));
    } else {
      this.array.push(this.fb.group(this.recipeService.clearRecipeIngredient()));
    }

    let i = this.array.length - 1;
    this.getIngredient(i)!.setValidators(idRequiredValidator());
    this.getAmount(i)!.setValidators(Validators.required);
    this.getMeasureUnit(i)!.setValidators(idRequiredValidator());
    this.getOptional(i)!.setValidators(Validators.required);
  }

  deleteIngredient(index: number) {
    this.array.removeAt(index);
  }

  getId(i: number) { return this.array.controls[i].get('id'); }
  getIngredient(i: number) { return this.array.controls[i].get('ingredient'); }
  getAmount(i: number) { return this.array.controls[i].get('amount'); }
  getMeasureUnit(i: number) { return this.array.controls[i].get('measureUnit'); }
  getOptional(i: number) { return this.array.controls[i].get('optional'); }

  onReset($event: Event, ingredientQuantities?: RecipeIngredient[]): void {
    $event.preventDefault();
    this.array.clear();
    this.addIngredientQuantities(ingredientQuantities);
  }

}
