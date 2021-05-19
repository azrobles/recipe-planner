import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Supermarket } from '../models/supermarket.model';
import { SupermarketService } from '../services/supermarket.service';

@Component({
  selector: 'app-supermarket-form',
  templateUrl: './supermarket-form.component.html',
  styleUrls: ['./supermarket-form.component.css']
})
export class SupermarketFormComponent implements OnInit {

  errorMessage!: string;
  supermarket!: Supermarket;
  supermarketForm!: FormGroup;
  isAddMode!: boolean;
  loading = false;

  constructor(
    private supermarketService: SupermarketService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.clearSupermarket();

    this.supermarketForm = this.fb.group(this.supermarket);
    this.name!.setValidators(Validators.required);
    this.name!.setValidators(Validators.maxLength(30));

    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.isAddMode = !id;
    if(!this.isAddMode) {
      this.getSupermarket(id);
    }
  }

  private getSupermarket(id: number): void {
    this.loading = true;
    this.supermarketService.getSupermarket(id).subscribe({
      next: data => {
        if(data) {
          this.supermarket = data;
          this.supermarketForm.setValue(this.supermarket);
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

  get name() { return this.supermarketForm.get('name'); }

  onSubmit(): void {
    if(this.isAddMode) {
      this.addSupermarket();
    } else {
      this.updateSupermarket();
    }
  }

  onReset($event: Event): void {
    $event.preventDefault();
    this.supermarketForm.reset(this.supermarket);
  }

  clearSupermarket(): void {
    this.errorMessage = '';
    this.supermarket = this.supermarketService.clearSupermarket();
  }

  addSupermarket(): void {
    this.loading = true;
    this.errorMessage = '';
    this.supermarketService.addSupermarket(this.supermarketForm.value).subscribe({
      next: data => this.gotoSupermarketList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  updateSupermarket(): void {
    this.loading = true;
    this.errorMessage = '';
    this.supermarketService.updateSupermarket(this.supermarketForm.value).subscribe({
      next: data => this.gotoSupermarketList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  deleteSupermarket(): void {
    this.loading = true;
    this.errorMessage = '';
    this.supermarketService.deleteSupermarket(this.supermarket.id!).subscribe({
      next: data => this.gotoSupermarketList(),
      error: (err: any) => {
        this.errorMessage = err.message || err.toString();
        this.loading = false;
      }
    });
  }

  gotoSupermarketList(): void {
    this.router.navigate(['/supermarkets']);
  }

}
