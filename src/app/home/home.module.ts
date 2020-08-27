import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LandingComponent } from './landing/landing.component';
import { SupportComponent } from './support/support.component';
import { PricingComponent } from './pricing/pricing.component';

@NgModule({
  declarations: [
    HomeComponent,
    LandingComponent,
    SupportComponent,
    PricingComponent,
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class HomeModule { }
