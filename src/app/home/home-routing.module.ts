import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { LandingComponent } from './landing/landing.component';
import { SupportComponent } from './support/support.component';
import { PricingComponent } from './pricing/pricing.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'support', component: SupportComponent },
      { path: 'pricing', component: PricingComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
