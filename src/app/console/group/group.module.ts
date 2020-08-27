import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxStripeModule } from 'ngx-stripe';

import { GroupService } from '@services/group/group.service';
import { ComponentsModule } from '@components/components.module';

import { GroupRoutingModule } from './group-routing.module';
import { GroupComponent } from './group.component';
import { JoinComponent } from './join/join.component';
import { CreateComponent } from './create/create.component';
import { GroupsComponent } from './groups/groups.component';
import { PaymentComponent } from './payment/payment.component';
import { TiersComponent } from './tiers/tiers.component';
import { environment } from '@environment';


@NgModule({
  declarations: [
    GroupComponent,
    JoinComponent,
    CreateComponent,
    GroupsComponent,
    PaymentComponent,
    TiersComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    GroupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatDialogModule,
    NgxStripeModule.forRoot(environment.stripeKey),
  ],
  providers: [
    GroupService
  ]
})
export class GroupModule { }
