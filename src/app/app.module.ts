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
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { IngredientFormComponent } from './ingredient-form/ingredient-form.component';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationFormComponent } from './location-form/location-form.component';
import { DifficultyListComponent } from './difficulty-list/difficulty-list.component';
import { DifficultyFormComponent } from './difficulty-form/difficulty-form.component';
import { SeasonListComponent } from './season-list/season-list.component';
import { SeasonFormComponent } from './season-form/season-form.component';
import { RecipeTypeListComponent } from './recipe-type-list/recipe-type-list.component';
import { RecipeTypeFormComponent } from './recipe-type-form/recipe-type-form.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';

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
    IngredientListComponent,
    IngredientFormComponent,
    LocationListComponent,
    LocationFormComponent,
    DifficultyListComponent,
    DifficultyFormComponent,
    SeasonListComponent,
    SeasonFormComponent,
    RecipeTypeListComponent,
    RecipeTypeFormComponent,
    RecipeListComponent
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
