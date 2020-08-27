import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from '../components/analytics/analytics.component';
import { EntitiesComponent } from '../components/entities/entities.component';
import { SubjectsComponent } from '../components/subjects/subjects.component';
import { ProviderGuard } from '@core/provider/provider.guard';
import { ProviderComponent } from './provider.component';
import { SectionsComponent } from '../components/sections/sections.component';


const routes: Routes = [
  { path: '',
    component: ProviderComponent,
    canActivate: [ProviderGuard],
    children: [
      { path: '', component: SectionsComponent },
      { path: 'section/:sectionId', component: SectionsComponent },
      { path: 'subject/:subjectId', component: SubjectsComponent },
      { path: 'entity/:entityId', component: EntitiesComponent }
    ]
  },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [ProviderGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
