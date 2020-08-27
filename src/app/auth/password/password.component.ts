import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';
import { Router } from '@angular/router';
import { faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  faLock = faLock;
  loading = false;
  email: string;
  passwordForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private auth: AuthService, private router: Router) {
    this.getEmail();
  }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(20)]]
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  async getEmail() {
    this.email = await this.auth.getCurrentEmailPhone();
  }

  get passwordFormControls() { return this.passwordForm.controls; }

  async onSubmit() {
    const { email, password } = this.passwordFormControls;
    if (this.passwordForm.invalid) {
      this.openSnackBar('Invalid Email or Password');
      return;
    }

    this.loading = true;
    try {
      await this.auth.signIn(email.value, password.value);
      this.router.navigate(['console']);
    } catch (err) {
      this.openSnackBar(err);
    }
    this.loading = false;
  }

  async forgotPassword() {
    const { email } = this.passwordFormControls;
    if (this.passwordForm.invalid) {
      if (email.errors) {
        const { errors } = email;
        if (errors.required) {
          this.openSnackBar('Email required');
        } else {
          this.openSnackBar('Invalid Email');
        }
        return;
      }
    }
    try {
      await this.auth.passwordReset(email.value);
      this.openSnackBar('Password reset email has been sent');
    } catch (err) {
      this.openSnackBar(err);
    }
  }

}
