import { ThisReceiver } from '@angular/compiler';
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

  constructor(
    private supermarketService: SupermarketService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.clearSupermarket();

    this.supermarketForm = this.fb.group(this.supermarket);
    this.name?.setValidators(Validators.required);

    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    this.isAddMode = !id;
    if(id) this.getSupermarket(id);
  }

  private getSupermarket(id: number): void {
    this.supermarketService.getSupermarket(id).subscribe({
      next: data => {
        if(data) {
          this.supermarket = data;
          this.supermarketForm.setValue(this.supermarket);
        } else {
          this.isAddMode = true;
        }
      },
      error: (err: any) => {
        this.isAddMode = true;
        this.errorMessage = err.message || err.toString();
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
    this.errorMessage = '';
    this.supermarketService.addSupermarket(this.supermarketForm.value).subscribe({
      next: data => this.gotoSupermarketList(),
      error: (err: any) => this.errorMessage = err.message || err.toString()
    });
  }

  updateSupermarket(): void {
    this.errorMessage = '';
    this.supermarketService.updateSupermarket(this.supermarketForm.value).subscribe({
      next: data => this.gotoSupermarketList(),
      error: (err: any) => this.errorMessage = err.message || err.toString()
    });
  }

  gotoSupermarketList(): void {
    this.router.navigate(['/supermarkets']);
  }

}
