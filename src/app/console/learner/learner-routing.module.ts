import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LearnerComponent } from './learner.component';
import { LearnerGuard } from '@core/learner/learner.guard';
import { SectionsComponent } from '../components/sections/sections.component';
import { SubjectsComponent } from '../components/subjects/subjects.component';
import { EntitiesComponent } from '../components/entities/entities.component';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
  { path: '',
    component: LearnerComponent,
    canActivate: [LearnerGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'section/:sectionId', component: SectionsComponent },
      { path: 'subject/:subjectId', component: SubjectsComponent },
      { path: 'entity/:entityId', component: EntitiesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnerRoutingModule { }
