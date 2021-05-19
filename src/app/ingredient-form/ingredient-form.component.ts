import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Availability } from '../models/availability.model';
import { Ingredient } from '../models/ingredient.model';
import { Supermarket } from '../models/supermarket.model';
import { AvailabilityService } from '../services/availability.service';
import { IngredientService } from '../services/ingredient.service';
import { SupermarketService } from '../services/supermarket.service';
import { compareIdFn, idRequiredValidator } from '../validators/custom.validators';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css']
})
export class IngredientFormComponent implements OnInit {

  compareIdFn = compareIdFn;
  availabilities$!: Observable<Availability[]>;
  supermarkets$!: Observable<Supermarket[]>;
  errorMessage!: string;
  ingredient!: Ingredient;
  ingredientForm!: FormGroup;
  isAddMode!: boolean;
  loading = false;

  constructor(
    private availabilityService: AvailabilityService,
    private supermarketService: SupermarketService,
    private ingredientService: IngredientService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getAvailabilities();
    this.getSupermarkets();

    this.clearIngredient();

    this.ingredientForm = this.fb.group(this.ingredient);
    this.name!.setValidators(Validators.required);
    this.name!.setValidators(Validators.maxLength(50));
    this.availability!.setValidators(idRequiredValidator());
    this.supermarket!.setValidators(idRequiredValidator());

    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.isAddMode = !id;
    if(!this.isAddMode) {
      this.getIngredient(id);
    }
  }

  private getAvailabilities(): void {
    this.availabilities$ = this.availabilityService.getAvailabilities().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => console.error('Error loading availabilities from server'));
        return of([{ name: 'Error' }]);
      })
    );
  }

  private getSupermarkets(): void {
    this.supermarkets$ = this.supermarketService.getSupermarkets().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => console.error('Error loading supermarkets from server'));
        return of([{ name: 'Error' }]);
      })
    );
  }

  private getIngredient(id: number): void {
    this.loading = true;
    this.ingredientService.getIngredient(id).subscribe({
      next: data => {
        if(data) {
          this.ingredient = data;
          this.ingredientForm.setValue(this.ingredient);
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

  get name() { return this.ingredientForm.get('name'); }
  get availability() { return this.ingredientForm.get('availability'); }
  get supermarket() { return this.ingredientForm.get('supermarket'); }

  onSubmit(): void {
    if(this.isAddMode) {
      this.addIngredient();
    } else {
      this.updateIngredient();
    }
  }

  onReset($event: Event): void {
    $event.preventDefault();
    this.ingredientForm.reset(this.ingredient);
  }

  clearIngredient(): void {
    this.errorMessage = '';
    this.ingredient = this.ingredientService.clearIngredient();
  }

  addIngredient(): void {
    this.loading = true;
    this.errorMessage = '';
    this.ingredientService.addIngredient(this.ingredientForm.value).subscribe({
      next: data => this.gotoIngredientList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  updateIngredient(): void {
    this.loading = true;
    this.errorMessage = '';
    this.ingredientService.updateIngredient(this.ingredientForm.value).subscribe({
      next: data => this.gotoIngredientList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  deleteIngredient(): void {
    this.loading = true;
    this.errorMessage = '';
    this.ingredientService.deleteIngredient(this.ingredient.id!).subscribe({
      next: data => this.gotoIngredientList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  gotoIngredientList(): void {
    this.router.navigate(['/ingredients']);
  }

}
