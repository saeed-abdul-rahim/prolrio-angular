import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth.service';
import snackBarSettings from '@settings/snackBar';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {

  otpForm: FormGroup;
  loading = false;
  phone: string;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.getPhone();
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('[0-9]+')]]
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  async getPhone() {
    this.phone = await this.auth.getCurrentEmailPhone();
  }

  get emailFormControls() { return this.otpForm.controls; }

  async onSubmit() {
    const { otp } = this.emailFormControls;

    if (this.otpForm.invalid) {
      if (otp.errors) {
        const { errors } = otp;
        if (errors.required) { this.openSnackBar('OTP required'); }
        if (errors.minLength || errors.maxLength || errors.pattern) { this.openSnackBar('Invalid OTP'); }
      }
      return;
    }

    this.loading = true;
    try {
      await this.auth.verifyOtp(otp.value);
      const { uid } = await this.auth.getAfsCurrentUser();
      const data = await this.auth.getUserDocument(uid).pipe(first()).toPromise();
      if (data === null) {
        await this.auth.createUserByPhone(this.phone);
      }
      this.router.navigate(['console']);
    } catch (err) {
      this.openSnackBar(err);
    }
    this.loading = false;
  }

}
