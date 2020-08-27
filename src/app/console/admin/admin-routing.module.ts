import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from '@core/admin/admin.guard';
import { AnalyticsComponent } from '../components/analytics/analytics.component';
import { SectionsComponent } from '../components/sections/sections.component';
import { SubjectsComponent } from '../components/subjects/subjects.component';
import { EntitiesComponent } from '../components/entities/entities.component';


const routes: Routes = [
  { path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: SectionsComponent },
      { path: 'section/:sectionId', component: SectionsComponent },
      { path: 'subject/:subjectId', component: SubjectsComponent },
      { path: 'entity/:entityId', component: EntitiesComponent }
    ]
  },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
