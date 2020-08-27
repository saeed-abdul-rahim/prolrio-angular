import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PlyrModule } from 'ngx-plyr';
import { ChartsModule } from 'ng2-charts';

import { ProviderService } from '@services/provider/provider.service';
import { MediaService } from '@services/media/media.service';
import { ComponentsModule } from '@components/components.module';

import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderComponent } from './provider.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [ProviderComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ProviderRoutingModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    DragDropModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    PlyrModule,
    ChartsModule
  ],
  providers: [
    ProviderService,
    MediaService
  ]
})
export class ProviderModule { }
