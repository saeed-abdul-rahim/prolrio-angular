import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AuthRoutingModule } from './auth-routing.module';
import { SetPasswordComponent } from './set-password/set-password.component';
import { EmailComponent } from './email/email.component';
import { PasswordComponent } from './password/password.component';
import { AuthComponent } from './auth.component';
import { AuthService } from '@core/auth.service';
import { OtpComponent } from './otp/otp.component';


@NgModule({
  declarations: [
    SetPasswordComponent,
    EmailComponent,
    PasswordComponent,
    AuthComponent,
    OtpComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [AuthService]
})
export class AuthModule { }
