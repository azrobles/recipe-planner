import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { SupermarketListComponent } from './supermarket-list/supermarket-list.component';
import { SupermarketFormComponent } from './supermarket-form/supermarket-form.component';
import { AvailabilityListComponent } from './availability-list/availability-list.component';
import { AvailabilityFormComponent } from './availability-form/availability-form.component';
import { MeasureUnitListComponent } from './measure-unit-list/measure-unit-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'supermarkets/new', component: SupermarketFormComponent },
  { path: 'supermarkets/:id', component: SupermarketFormComponent },
  { path: 'supermarkets', component: SupermarketListComponent },
  { path: 'availabilities/new', component: AvailabilityFormComponent },
  { path: 'availabilities/:id', component: AvailabilityFormComponent },
  { path: 'availabilities', component: AvailabilityListComponent },
  { path: 'measureunits', component: MeasureUnitListComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
