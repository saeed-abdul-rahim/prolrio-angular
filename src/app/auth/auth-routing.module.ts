import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { EmailComponent } from './email/email.component';
import { PasswordComponent } from './password/password.component';
import { OtpComponent } from './otp/otp.component';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'set-password', component: SetPasswordComponent },
      { path: 'sign-in', component: EmailComponent },
      { path: 'auth', component: PasswordComponent },
      { path: 'otp', component: OtpComponent },
      { path: '', redirectTo: 'sign-in' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
