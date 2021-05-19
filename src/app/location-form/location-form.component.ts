import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '../models/location.model';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.css']
})
export class LocationFormComponent implements OnInit {

  errorMessage!: string;
  location!: Location;
  locationForm!: FormGroup;
  isAddMode!: boolean;
  loading = false;

  constructor(
    private locationService: LocationService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.clearLocation();

    this.locationForm = this.fb.group(this.location);
    this.name!.setValidators(Validators.required);
    this.name!.setValidators(Validators.maxLength(50));

    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.isAddMode = !id;
    if(!this.isAddMode) {
      this.getLocation(id);
    }
  }

  private getLocation(id: number): void {
    this.loading = true;
    this.locationService.getLocation(id).subscribe({
      next: data => {
        if(data) {
          this.location = data;
          this.locationForm.setValue(this.location);
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

  get name() { return this.locationForm.get('name'); }

  onSubmit(): void {
    if(this.isAddMode) {
      this.addLocation();
    } else {
      this.updateLocation();
    }
  }

  onReset($event: Event): void {
    $event.preventDefault();
    this.locationForm.reset(this.location);
  }

  clearLocation(): void {
    this.errorMessage = '';
    this.location = this.locationService.clearLocation();
  }

  addLocation(): void {
    this.loading = true;
    this.errorMessage = '';
    this.locationService.addLocation(this.locationForm.value).subscribe({
      next: data => this.gotoLocationList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  updateLocation(): void {
    this.loading = true;
    this.errorMessage = '';
    this.locationService.updateLocation(this.locationForm.value).subscribe({
      next: data => this.gotoLocationList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  deleteLocation(): void {
    this.loading = true;
    this.errorMessage = '';
    this.locationService.deleteLocation(this.location.id!).subscribe({
      next: data => this.gotoLocationList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  gotoLocationList(): void {
    this.router.navigate(['/locations']);
  }

}
