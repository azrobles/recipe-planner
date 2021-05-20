import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeType } from '../models/recipe-type.model';
import { RecipeTypeService } from '../services/recipe-type.service';

@Component({
  selector: 'app-recipe-type-form',
  templateUrl: './recipe-type-form.component.html',
  styleUrls: ['./recipe-type-form.component.css']
})
export class RecipeTypeFormComponent implements OnInit {

  errorMessage!: string;
  recipeType!: RecipeType;
  recipeTypeForm!: FormGroup;
  isAddMode!: boolean;
  loading = false;

  constructor(
    private recipeTypeService: RecipeTypeService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.clearRecipeType();

    this.recipeTypeForm = this.fb.group(this.recipeType);
    this.name!.setValidators(Validators.required);
    this.name!.setValidators(Validators.maxLength(50));

    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.isAddMode = !id;
    if(!this.isAddMode) {
      this.getRecipeType(id);
    }
  }

  private getRecipeType(id: number): void {
    this.loading = true;
    this.recipeTypeService.getRecipeType(id).subscribe({
      next: data => {
        if(data) {
          this.recipeType = data;
          this.recipeTypeForm.setValue(this.recipeType);
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

  get name() { return this.recipeTypeForm.get('name'); }

  onSubmit(): void {
    if(this.isAddMode) {
      this.addRecipeType();
    } else {
      this.updateRecipeType();
    }
  }

  onReset($event: Event): void {
    $event.preventDefault();
    this.recipeTypeForm.reset(this.recipeType);
  }

  clearRecipeType(): void {
    this.errorMessage = '';
    this.recipeType = this.recipeTypeService.clearRecipeType();
  }

  addRecipeType(): void {
    this.loading = true;
    this.errorMessage = '';
    this.recipeTypeService.addRecipeType(this.recipeTypeForm.value).subscribe({
      next: data => this.gotoRecipeTypeList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  updateRecipeType(): void {
    this.loading = true;
    this.errorMessage = '';
    this.recipeTypeService.updateRecipeType(this.recipeTypeForm.value).subscribe({
      next: data => this.gotoRecipeTypeList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  deleteRecipeType(): void {
    this.loading = true;
    this.errorMessage = '';
    this.recipeTypeService.deleteRecipeType(this.recipeType.id!).subscribe({
      next: data => this.gotoRecipeTypeList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  gotoRecipeTypeList(): void {
    this.router.navigate(['/recipetypes']);
  }

}
