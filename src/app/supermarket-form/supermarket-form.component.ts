import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private supermarketService: SupermarketService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.clearSupermarket();

    this.supermarketForm = this.fb.group(this.supermarket);
    this.name?.setValidators(Validators.required);
  }

  get name() { return this.supermarketForm.get('name'); }

  onSubmit(): void {
    this.addSupermarket();
  }

  onReset(): void {
    this.supermarketForm.reset(this.supermarket);
  }

  clearSupermarket(): void {
    this.errorMessage = '';
    this.supermarket = this.supermarketService.clearSupermarket();
  }

  addSupermarket(): void {
    this.errorMessage = '';
    this.supermarketService.addSupermarket(this.supermarketForm.value).subscribe({
      next: data => this.gotoSupermarketList(),
      error: (err: any) => this.errorMessage = err.message || err.toString()
    });
  }

  gotoSupermarketList(): void {
    this.router.navigate(['/supermarkets']);
  }

}
