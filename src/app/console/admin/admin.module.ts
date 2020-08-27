import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PlyrModule } from 'ngx-plyr';
import { ChartsModule } from 'ng2-charts';

import { AdminService } from '@services/admin/admin.service';
import { MediaService } from '@services/media/media.service';
import { DragAndDropDirective } from '@directives/DragAndDrop.directive';
import { ComponentsModule } from '@components/components.module';

import { SectionsComponent } from '../components/sections/sections.component';
import { EntitiesComponent } from '../components/entities/entities.component';
import { AddEntityComponent } from '../components/add-entity/add-entity.component';
import { SubjectsComponent } from '../components/subjects/subjects.component';
import { RemoveEntityComponent } from '../components/remove-entity/remove-entity.component';
import { EditEntityComponent } from '../components/edit-entity/edit-entity.component';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserComponent } from './components/user/user.component';
import { AddDivisionComponent } from './components/add-division/add-division.component';
import { UpdateRoleComponent } from './components/update-role/update-role.component';
import { RemoveUserComponent } from './components/remove-user/remove-user.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { RemoveDivisionComponent } from './components/remove-division/remove-division.component';
import { ProviderService } from '@services/provider/provider.service';
import { UpdateDivisionComponent } from './components/update-division/update-division.component';
import { GroupService } from '@services/group/group.service';
import { AnalyticsComponent } from '../components/analytics/analytics.component';


@NgModule({
  declarations: [
    AdminComponent,
    UserComponent,
    AddDivisionComponent,
    SectionsComponent,
    SubjectsComponent,
    EntitiesComponent,
    AddEntityComponent,
    DragAndDropDirective,
    UpdateRoleComponent,
    RemoveUserComponent,
    AddUserComponent,
    RemoveDivisionComponent,
    RemoveEntityComponent,
    EditEntityComponent,
    UpdateDivisionComponent,
    AnalyticsComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    DragDropModule,
    AdminRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    PlyrModule,
    ChartsModule
  ],
  exports: [AdminComponent],
  providers: [
    AdminService,
    ProviderService,
    GroupService,
    MediaService
  ]
})
export class AdminModule { }
