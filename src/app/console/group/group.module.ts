import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ImageCropperModule } from 'ngx-image-cropper';
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
import { ProfileComponent } from './profile/profile.component';
import { MediaService } from '@services/media/media.service';


@NgModule({
  declarations: [
    GroupComponent,
    ProfileComponent,
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
    ImageCropperModule,
    FontAwesomeModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NgxStripeModule.forRoot(environment.stripeKey),
  ],
  providers: [
    GroupService,
    MediaService
  ]
})
export class GroupModule { }
