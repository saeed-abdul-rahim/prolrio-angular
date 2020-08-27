import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DropdownComponent } from './dropdown/dropdown.component';
import { RemoveComponent } from './remove/remove.component';
import { CardComponent } from './card/card.component';
import { LimitExceededComponent } from './limit-exceeded/limit-exceeded.component';


@NgModule({
  declarations: [
    DropdownComponent,
    RemoveComponent,
    CardComponent,
    LimitExceededComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FontAwesomeModule
  ],
  exports: [
    DropdownComponent,
    RemoveComponent,
    CardComponent,
    LimitExceededComponent
  ]
})
export class ComponentsModule { }
