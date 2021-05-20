import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Difficulty } from '../models/difficulty.model';
import { DifficultyService } from '../services/difficulty.service';

@Component({
  selector: 'app-difficulty-form',
  templateUrl: './difficulty-form.component.html',
  styleUrls: ['./difficulty-form.component.css']
})
export class DifficultyFormComponent implements OnInit {

  errorMessage!: string;
  difficulty!: Difficulty;
  difficultyForm!: FormGroup;
  isAddMode!: boolean;
  loading = false;

  constructor(
    private difficultyService: DifficultyService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.clearDifficulty();

    this.difficultyForm = this.fb.group(this.difficulty);
    this.name!.setValidators(Validators.required);
    this.name!.setValidators(Validators.maxLength(30));

    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.isAddMode = !id;
    if(!this.isAddMode) {
      this.getDifficulty(id);
    }
  }

  private getDifficulty(id: number): void {
    this.loading = true;
    this.difficultyService.getDifficulty(id).subscribe({
      next: data => {
        if(data) {
          this.difficulty = data;
          this.difficultyForm.setValue(this.difficulty);
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

  get name() { return this.difficultyForm.get('name'); }

  onSubmit(): void {
    if(this.isAddMode) {
      this.addDifficulty();
    } else {
      this.updateDifficulty();
    }
  }

  onReset($event: Event): void {
    $event.preventDefault();
    this.difficultyForm.reset(this.difficulty);
  }

  clearDifficulty(): void {
    this.errorMessage = '';
    this.difficulty = this.difficultyService.clearDifficulty();
  }

  addDifficulty(): void {
    this.loading = true;
    this.errorMessage = '';
    this.difficultyService.addDifficulty(this.difficultyForm.value).subscribe({
      next: data => this.gotoDifficultyList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  updateDifficulty(): void {
    this.loading = true;
    this.errorMessage = '';
    this.difficultyService.updateDifficulty(this.difficultyForm.value).subscribe({
      next: data => this.gotoDifficultyList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  deleteDifficulty(): void {
    this.loading = true;
    this.errorMessage = '';
    this.difficultyService.deleteDifficulty(this.difficulty.id!).subscribe({
      next: data => this.gotoDifficultyList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  gotoDifficultyList(): void {
    this.router.navigate(['/difficulties']);
  }

}
