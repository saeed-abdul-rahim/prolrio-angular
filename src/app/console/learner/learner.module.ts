import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlyrModule } from 'ngx-plyr';

import { LearnerRoutingModule } from './learner-routing.module';
import { LearnerComponent } from './learner.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './components/home/home.component';
import { LearnerService } from '@services/learner/learner.service';
import { ComponentsModule } from '@components/components.module';


@NgModule({
  declarations: [
    LearnerComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    LearnerRoutingModule,
    MatDialogModule,
    PlyrModule
  ],
  providers: [LearnerService]
})
export class LearnerModule { }
