import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeUnit } from '../models/time-unit.model';
import { TimeUnitService } from '../services/time-unit.service';

@Component({
  selector: 'app-time-unit-form',
  templateUrl: './time-unit-form.component.html',
  styleUrls: ['./time-unit-form.component.css']
})
export class TimeUnitFormComponent implements OnInit {

  errorMessage!: string;
  timeUnit!: TimeUnit;
  timeUnitForm!: FormGroup;
  isAddMode!: boolean;
  loading = false;

  constructor(
    private timeUnitService: TimeUnitService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.clearTimeUnit();

    this.timeUnitForm = this.fb.group(this.timeUnit);
    this.name!.setValidators(Validators.required);

    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.isAddMode = !id;
    if(!this.isAddMode) {
      this.getTimeUnit(id);
    }
  }

  private getTimeUnit(id: number): void {
    this.loading = true;
    this.timeUnitService.getTimeUnit(id).subscribe({
      next: data => {
        if(data) {
          this.timeUnit = data;
          this.timeUnitForm.setValue(this.timeUnit);
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

  get name() { return this.timeUnitForm.get('name'); }

  onSubmit(): void {
    if(this.isAddMode) {
      this.addTimeUnit();
    } else {
      this.updateTimeUnit();
    }
  }

  onReset($event: Event): void {
    $event.preventDefault();
    this.timeUnitForm.reset(this.timeUnit);
  }

  clearTimeUnit(): void {
    this.errorMessage = '';
    this.timeUnit = this.timeUnitService.clearTimeUnit();
  }

  addTimeUnit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.timeUnitService.addTimeUnit(this.timeUnitForm.value).subscribe({
      next: data => this.gotoTimeUnitList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  updateTimeUnit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.timeUnitService.updateTimeUnit(this.timeUnitForm.value).subscribe({
      next: data => this.gotoTimeUnitList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  deleteTimeUnit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.timeUnitService.deleteTimeUnit(this.timeUnit.id!).subscribe({
      next: data => this.gotoTimeUnitList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  gotoTimeUnitList(): void {
    this.router.navigate(['/timeunits']);
  }

}
