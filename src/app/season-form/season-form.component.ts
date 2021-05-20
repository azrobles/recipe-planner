import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Season } from '../models/season.model';
import { SeasonService } from '../services/season.service';

@Component({
  selector: 'app-season-form',
  templateUrl: './season-form.component.html',
  styleUrls: ['./season-form.component.css']
})
export class SeasonFormComponent implements OnInit {

  errorMessage!: string;
  season!: Season;
  seasonForm!: FormGroup;
  isAddMode!: boolean;
  loading = false;

  constructor(
    private seasonService: SeasonService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.clearSeason();

    this.seasonForm = this.fb.group(this.season);
    this.name!.setValidators(Validators.required);
    this.name!.setValidators(Validators.maxLength(30));

    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.isAddMode = !id;
    if(!this.isAddMode) {
      this.getSeason(id);
    }
  }

  private getSeason(id: number): void {
    this.loading = true;
    this.seasonService.getSeason(id).subscribe({
      next: data => {
        if(data) {
          this.season = data;
          this.seasonForm.setValue(this.season);
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

  get name() { return this.seasonForm.get('name'); }

  onSubmit(): void {
    if(this.isAddMode) {
      this.addSeason();
    } else {
      this.updateSeason();
    }
  }

  onReset($event: Event): void {
    $event.preventDefault();
    this.seasonForm.reset(this.season);
  }

  clearSeason(): void {
    this.errorMessage = '';
    this.season = this.seasonService.clearSeason();
  }

  addSeason(): void {
    this.loading = true;
    this.errorMessage = '';
    this.seasonService.addSeason(this.seasonForm.value).subscribe({
      next: data => this.gotoSeasonList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  updateSeason(): void {
    this.loading = true;
    this.errorMessage = '';
    this.seasonService.updateSeason(this.seasonForm.value).subscribe({
      next: data => this.gotoSeasonList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  deleteSeason(): void {
    this.loading = true;
    this.errorMessage = '';
    this.seasonService.deleteSeason(this.season.id!).subscribe({
      next: data => this.gotoSeasonList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  gotoSeasonList(): void {
    this.router.navigate(['/seasons']);
  }

}
