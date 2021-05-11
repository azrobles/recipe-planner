import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Supermarket } from '../models/supermarket.model';
import { SupermarketService } from '../services/supermarket.service';

@Component({
  selector: 'app-supermarket-list',
  templateUrl: './supermarket-list.component.html',
  styleUrls: ['./supermarket-list.component.css']
})
export class SupermarketListComponent implements OnInit {

  errorMessage!: string;
  supermarkets$!: Observable<Supermarket[]>;

  constructor(
    private supermarketService: SupermarketService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSupermarkets();
  }

  getSupermarkets(): void {
    this.errorMessage = '';
    this.supermarkets$ = this.supermarketService.getSupermarkets().pipe(
      startWith([{ name: 'Loading...' }]),
      catchError( (err: any) => {
        setTimeout(() => this.errorMessage = err.message || err.toString());
        return of([]);
      })
    );
  }

  gotoSupermarketDetail(id: number): void {
    this.router.navigate(['/supermarkets', id]);
  }

}
