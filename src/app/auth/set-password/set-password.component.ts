import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';
import { AuthService } from '@core/auth.service';
import validatePasswordEqual from '@utils/validatePasswordEqual';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {

  url: string;
  mode: string;
  code: string;
  email: string;
  signUpForm: FormGroup;
  loading = false;
  componentLoading = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute,
              private auth: AuthService, private snackBar: MatSnackBar) {
    const { mode, oobCode } = this.route.snapshot.queryParams;
    if (!mode) { this.router.navigate(['auth']); }
    if (mode === 'signIn' && oobCode) {
      this.signInMethod();
    }
    this.url = this.router.url;
    this.mode = mode;
    this.code = oobCode;
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      name: [''],
      password: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(8),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*^~()#?&])[A-Za-z\d$@$!%*?&].{7,}')]],
      confirmPassword: ['', Validators.required]
    });
    if (this.mode === 'signIn') {
      this.signUpForm.get('name').setValidators([Validators.required, Validators.maxLength(50), Validators.pattern('[A-z\\s]+')]);
    }
  }

  async signInMethod() {
    this.componentLoading = true;
    try {
      await this.verifySignIn();
      const user = await this.auth.getCurrentUser();
      const { email } = user;
      this.email = email;
      const signInMethod = await this.auth.fetchEmail(email);
      if (signInMethod.includes('password')) {
        this.router.navigate(['auth']);
      }
    } catch (_) { }
    this.componentLoading = false;
  }

  async verifySignIn() {
    this.loading = true;
    try {
      await this.auth.confirmSignIn(this.router.url);
      await this.auth.isAuthenticated();
      this.openSnackBar('Email verified');
    } catch (err) {
      this.openSnackBar('Unable to verify email. Please try again.');
      this.router.navigate(['sign-in']);
    }
    this.loading = false;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  get setPasswordControls() { return this.signUpForm.controls; }

  async onSubmit() {
    const { password, confirmPassword, name } = this.setPasswordControls;
    if (this.signUpForm.invalid) {
      if (password.errors) {
        const { errors } = password;
        if (errors.required) { this.openSnackBar('Password is required'); }
        else if (errors.maxLength) { this.openSnackBar('Password limit exceeded'); }
        else if (errors.minLength) { this.openSnackBar('Password requres atleast 8 characters'); }
        else if (errors.pattern) { this.openSnackBar('Password is weak! Please input specified pattern'); }
      } else if (confirmPassword.errors) {
        const { errors } = confirmPassword;
        if (errors.required) { this.openSnackBar('Please retype the password'); }
      } else if (name.errors) {
        const { errors } = name;
        if (errors.required) { this.openSnackBar('Name is required'); }
        else { this.openSnackBar('Invalid name'); }
      }
      return;
    } else if (!validatePasswordEqual(confirmPassword.value, password.value)) {
      this.openSnackBar('Password mismatch!');
      return;
    }
    else {
      this.loading = true;
      try {
        if (this.mode === 'signIn') {
          if (!this.email) {
            const user = await this.auth.getCurrentUser();
            const { email } = user;
            this.email = email;
          }
          await this.auth.createUser(name.value, this.email, password.value);
          await this.auth.signIn(this.email, password.value);
          this.router.navigate(['console']);
        } else if (this.mode === 'resetPassword') {
          await this.auth.setPassword(this.code, password.value);
          this.router.navigate(['auth']);
        }
        this.openSnackBar('Password has been set');
      } catch (err) {
        this.openSnackBar(err);
      }
      this.loading = false;
    }
  }

}
