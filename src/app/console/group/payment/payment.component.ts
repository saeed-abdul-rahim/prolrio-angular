import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';
import { GroupService } from '@services/group/group.service';
import countryList from '@utils/countryList';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { AuthService } from '@core/auth.service';
import { Subscription } from 'rxjs';
import { User } from '@models/User';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {

  faLock = faLock;

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#56CFE1',
        color: '#2DA8F4',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  loading = false;
  showEmail = false;
  countryList = countryList;
  stripeForm: FormGroup;

  user: User;
  userSubscription: Subscription;

  constructor(public dialogRef: MatDialogRef<PaymentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,
              private fb: FormBuilder, private stripeService: StripeService,
              private group: GroupService, private auth: AuthService) {}

  ngOnInit(): void {
    this.stripeForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [this.user && this.user.email],
      line1: ['', [Validators.required]],
      line2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
    this.userSubscription = this.auth.getCurrentUserStream().subscribe(user => {
      this.user = user;
      console.log(user);
      if (user && !user.email) {
        this.form.email.setValidators([Validators.required, Validators.email]);
        this.showEmail = true;
      } else {
        this.form.email.clearValidators();
        this.showEmail = false;
      }
    });
  }

  ngOnDestroy(): void {}

  get form() { return this.stripeForm.controls; }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  async onSubmit() {
    const { name, email, line1, line2, city, state, country } = this.form;
    if (this.stripeForm.invalid) {
      if (name.errors) { this.openSnackBar('Name is required'); }
      if (line1.errors) { this.openSnackBar('Address line 1 is required'); }
      if (city.errors) { this.openSnackBar('City is required'); }
      if (state.errors) { this.openSnackBar('State is required'); }
      if (country.errors) { this.openSnackBar('Country is required'); }
      if (email.errors) { this.openSnackBar('Email is required'); }
    }
    this.loading = true;
    try {
      const { secret } = await this.group.createPaymentIntent();
      this.stripeService.confirmCardPayment(secret, {
        payment_method: {
          card: this.card.element,
          billing_details: {
            name: name.value,
            address: {
              city: city.value,
              line1: line1.value,
              line2: line2.value,
              state: state.value,
              country: country.value
            }
          }
        },
        setup_future_usage: 'off_session'
      }).subscribe(async intent => {
        if (intent.error) {
          this.openSnackBar(intent.error.message);
        } else {
          try {
            await this.group.updateUser({ email: email.value });
          } catch (_) {
            this.openSnackBar('Unable to save email. Please update your email in profile to recieve payment related messages');
          }
          this.dialogRef.close(true);
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.openSnackBar('Unable to validate card');
      });
    } catch (err) {
      this.openSnackBar(err);
      this.loading = false;
    }
  }

}
