import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AuthService } from '@core/auth.service';
import { PublicService } from '@services/public/public.service';
import snackBarSettings from '@settings/snackBar';
import callingCodes from '@utils/callingCodes';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  emailForm: FormGroup;
  emailPhone: 'email' | 'phone' = 'email';
  loading = false;
  returnUrl: string;
  callingCodes = callingCodes;
  countryCode: string;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router,
              private auth: AuthService, private publicService: PublicService) { }

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      callCode: [''],
      email: ['', [Validators.required, Validators.minLength(2)]]
    });
    this.getCountry();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  charOrNumber(val: string) {
    if (val) {
      if (val.match(/[A-z]/g)) {
        this.emailForm.get('email').setValidators([Validators.required, Validators.email]);
        this.emailPhone = 'email';
      } else if (val.match(/[0-9]/g)) {
        this.emailForm.get('email').setValidators([
          Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')
        ]);
        this.emailPhone = 'phone';
      }
    } else {
      this.emailPhone = 'email';
    }
  }

  async getCountry() {
    try {
      this.countryCode = await this.publicService.getLocation();
      const country = this.callingCodes.filter(c => c.code === this.countryCode)[0];
      this.emailFormControls.callCode.setValue(country.callingCode);
    } catch (_) {}
  }

  get emailFormControls() { return this.emailForm.controls; }

  async onSubmit() {
    const { email, callCode } = this.emailFormControls;

    if (this.emailForm.invalid) {
      if (email.errors) {
        const { errors } = email;
        if (errors.required) { this.openSnackBar('Email / Phone required'); }
        if (errors.email) { this.openSnackBar('Invalid email'); }
        if (errors.minLength || errors.maxLength || errors.pattern) { this.openSnackBar('Invalid mobile number'); }
      }
      if (callCode.errors) {
        const { errors } = callCode;
        if (errors.required) { this.openSnackBar('Dial code required'); }
      }
      return;
    }

    this.loading = true;
    try {
      if (this.emailPhone === 'email') {
        const exist = await this.auth.fetchEmail(email.value);
        if (exist.includes('password')) {
          this.auth.setCurrentEmailPhone(email.value);
          this.router.navigateByUrl('auth/auth');
        }
        if (exist.length === 0 || !exist.includes('password')) {
          try {
            await this.auth.signUpWithEmail(email.value);
            this.openSnackBar('Verification email has been sent');
          } catch (err) {
            if (err && err.includes('-')) {
              this.openSnackBar(err.split('- ')[1]);
            } else if (err) {
              this.openSnackBar(err);
            } else {
              this.openSnackBar('Could not sign up');
            }
          }
        }
      } else if (this.emailPhone === 'phone') {
        const phone = callCode.value + email.value;
        this.auth.setCurrentEmailPhone(phone);
        const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          size: 'invisible',
          callback: (response: string) => {}
        });
        await this.auth.signInWithPhone(phone, recaptchaVerifier);
        this.router.navigateByUrl('auth/otp');
        this.openSnackBar('OTP Sent');
      }
    } catch (err) {
      this.openSnackBar(err);
    }
    this.loading = false;

  }

}
