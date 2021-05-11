import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Availability } from '../models/availability.model';
import { AvailabilityService } from '../services/availability.service';

@Component({
  selector: 'app-availability-form',
  templateUrl: './availability-form.component.html',
  styleUrls: ['./availability-form.component.css']
})
export class AvailabilityFormComponent implements OnInit {

  errorMessage!: string;
  availability!: Availability;
  availabilityForm!: FormGroup;
  isAddMode!: boolean;
  loading = false;

  constructor(
    private availabilityService: AvailabilityService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.clearAvailability();

    this.availabilityForm = this.fb.group(this.availability);
    this.name!.setValidators(Validators.required);

    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.isAddMode = !id;
    if(!this.isAddMode) {
      this.getAvailability(id);
    }
  }

  private getAvailability(id: number): void {
    this.loading = true;
    this.availabilityService.getAvailability(id).subscribe({
      next: data => {
        if(data) {
          this.availability = data;
          this.availabilityForm.setValue(this.availability);
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

  get name() { return this.availabilityForm.get('name'); }

  onSubmit(): void {
    if(this.isAddMode) {
      this.addAvailability();
    } else {
      this.updateAvailability();
    }
  }

  onReset($event: Event): void {
    $event.preventDefault();
    this.availabilityForm.reset(this.availability);
  }

  clearAvailability(): void {
    this.errorMessage = '';
    this.availability = this.availabilityService.clearAvailability();
  }

  addAvailability(): void {
    this.loading = true;
    this.errorMessage = '';
    this.availabilityService.addAvailability(this.availabilityForm.value).subscribe({
      next: data => this.gotoAvailabilityList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  updateAvailability(): void {
    this.loading = true;
    this.errorMessage = '';
    this.availabilityService.updateAvailability(this.availabilityForm.value).subscribe({
      next: data => this.gotoAvailabilityList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  deleteAvailability(): void {
    this.loading = true;
    this.errorMessage = '';
    this.availabilityService.deleteAvailability(this.availability.id!).subscribe({
      next: data => this.gotoAvailabilityList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  gotoAvailabilityList(): void {
    this.router.navigate(['/availabilities']);
  }

}
