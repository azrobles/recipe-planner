import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SupermarketFormComponent } from './supermarket-form/supermarket-form.component';
import { SupermarketListComponent } from './supermarket-list/supermarket-list.component';
import { AvailabilityListComponent } from './availability-list/availability-list.component';
import { AvailabilityFormComponent } from './availability-form/availability-form.component';
import { MeasureUnitListComponent } from './measure-unit-list/measure-unit-list.component';
import { MeasureUnitFormComponent } from './measure-unit-form/measure-unit-form.component';
import { TimeUnitListComponent } from './time-unit-list/time-unit-list.component';
import { TimeUnitFormComponent } from './time-unit-form/time-unit-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PageNotFoundComponent,
    HomeComponent,
    AdminComponent,
    SupermarketListComponent,
    SupermarketFormComponent,
    AvailabilityListComponent,
    AvailabilityFormComponent,
    MeasureUnitListComponent,
    MeasureUnitFormComponent,
    TimeUnitListComponent,
    TimeUnitFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
