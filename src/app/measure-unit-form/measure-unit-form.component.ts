import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MeasureUnit } from '../models/measure-unit.model';
import { MeasureUnitService } from '../services/measure-unit.service';

@Component({
  selector: 'app-measure-unit-form',
  templateUrl: './measure-unit-form.component.html',
  styleUrls: ['./measure-unit-form.component.css']
})
export class MeasureUnitFormComponent implements OnInit {

  errorMessage!: string;
  measureUnit!: MeasureUnit;
  measureUnitForm!: FormGroup;
  isAddMode!: boolean;
  loading = false;

  constructor(
    private measureUnitService: MeasureUnitService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.clearMeasureUnit();

    this.measureUnitForm = this.fb.group(this.measureUnit);
    this.name!.setValidators(Validators.required);

    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.isAddMode = !id;
    if(!this.isAddMode) {
      this.getMeasureUnit(id);
    }
  }

  private getMeasureUnit(id: number): void {
    this.loading = true;
    this.measureUnitService.getMeasureUnit(id).subscribe({
      next: data => {
        if(data) {
          this.measureUnit = data;
          this.measureUnitForm.setValue(this.measureUnit);
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

  get name() { return this.measureUnitForm.get('name'); }

  onSubmit(): void {
    if(this.isAddMode) {
      this.addMeasureUnit();
    } else {
      this.updateMeasureUnit();
    }
  }

  onReset($event: Event): void {
    $event.preventDefault();
    this.measureUnitForm.reset(this.measureUnit);
  }

  clearMeasureUnit(): void {
    this.errorMessage = '';
    this.measureUnit = this.measureUnitService.clearMeasureUnit();
  }

  addMeasureUnit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.measureUnitService.addMeasureUnit(this.measureUnitForm.value).subscribe({
      next: data => this.gotoMeasureUnitList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  updateMeasureUnit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.measureUnitService.updateMeasureUnit(this.measureUnitForm.value).subscribe({
      next: data => this.gotoMeasureUnitList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  deleteMeasureUnit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.measureUnitService.deleteMeasureUnit(this.measureUnit.id!).subscribe({
      next: data => this.gotoMeasureUnitList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  gotoMeasureUnitList(): void {
    this.router.navigate(['/measureunits']);
  }

}
