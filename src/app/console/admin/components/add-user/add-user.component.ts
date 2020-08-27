import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminService } from '@services/admin/admin.service';
import roleValidator from '@utils/roleValidator';
import snackBarSettings from '@settings/snackBar';
import { UserInterface, displayRoleMap, roles } from '@models/User';
import { Subscription } from 'rxjs';
import { LimitExceededComponent } from '@components/limit-exceeded/limit-exceeded.component';
import { AuthService } from '@core/auth.service';
import callingCodes from '@utils/callingCodes';
import { PublicService } from '@services/public/public.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  @Input() dialogRef: any;

  displayRoleMap = displayRoleMap;
  addUserForm: FormGroup;
  loading = false;
  emailPhone: 'email' | 'phone' = 'email';
  callingCodes = callingCodes;
  countryCode: string;

  userRequests: UserInterface[];
  userRequestsSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private admin: AdminService,
              private snackBar: MatSnackBar, private matDialog: MatDialog, private analytics: AngularFireAnalytics,
              private publicService: PublicService) {
    this.userRequestsSubscription = this.admin.getUsersByRequests().subscribe(userRequests => this.userRequests = userRequests);
  }

  ngOnInit(): void {
    this.getCountry();
    this.addUserForm = this.formBuilder.group({
      callCode: [''],
      email: ['', [Validators.required]],
      role: ['', [Validators.required, roleValidator]]
    });
  }

  ngOnDestroy(): void {
    if (this.userRequestsSubscription && !this.userRequestsSubscription.closed) { this.userRequestsSubscription.unsubscribe(); }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  async getCountry() {
    try {
      this.countryCode = await this.publicService.getLocation();
      const country = this.callingCodes.filter(c => c.code === this.countryCode)[0];
      this.addUserControls.callCode.setValue(country.callingCode);
    } catch (_) {}
  }

  charOrNumber(val: string) {
    if (val) {
      if (val.match(/[A-z]/g)) {
        this.addUserForm.get('email').setValidators([Validators.required, Validators.email]);
        this.emailPhone = 'email';
      } else if (val.match(/[0-9]/g)) {
        this.addUserForm.get('email').setValidators([
          Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')
        ]);
        this.emailPhone = 'phone';
      }
    } else {
      this.emailPhone = 'email';
    }
  }

  get addUserControls() { return this.addUserForm.controls; }

  async onAddUserSubmit() {
    const { email, role, callCode } = this.addUserControls;
    if (this.addUserForm.invalid) {
      if (email.errors) {
        const { errors } = email;
        if (errors.required) { this.openSnackBar('Email / Phone required'); }
        if (errors.email) { this.openSnackBar('Invalid email'); }
        if (errors.minLength || errors.maxLength || errors.pattern) { this.openSnackBar('Invalid mobile number'); }
      } else if (role.errors) {
        const { errors } = role;
        if (errors.required) { this.openSnackBar('Role is required'); }
        else { this.openSnackBar('Invalid role'); }
      }
      return;
    }
    this.loading = true;
    try {
      let data: string;
      if (this.emailPhone === 'email') {
        data = email.value;
      } else {
        data = callCode.value + email.value;
      }
      await this.admin.createUser(data, role.value, this.emailPhone);
      this.analytics.logEvent('user', { add: true, group: true });
      if (this.emailPhone === 'email') {
        this.openSnackBar(`User added. Invitation sent to ${email.value}.`);
      } else {
        this.openSnackBar('User added');
      }
    } catch (err) {
      if (err.includes('Limit Exceeded')) {
        const { sudo } = await this.auth.getCurrentUser();
        if (sudo) { this.matDialog.open(LimitExceededComponent); }
      } else if (err.includes('exist')) {
        this.openSnackBar('User already exists');
      } else {
        this.openSnackBar('Could not create user');
      }
      if (err.includes('Limit Exceeded') || err.includes('Unauthorized')) {
        this.openSnackBar(err);
        this.dialogRef.close();
      }
    }
    this.loading = false;
  }

  async acceptRequest(uid: string, role: any) {
    if (!roles.includes(role)) {
      this.openSnackBar('Role is required');
      return;
    }
    this.setUserRequestsLoading(uid, true);
    try {
      await this.admin.acceptRequest(uid, role);
      this.analytics.logEvent('user', { add: true, group: true });
      this.openSnackBar('User added');
    } catch (err) {
      if (err.includes('Limit Exceeded')) {
        const { sudo } = await this.auth.getCurrentUser();
        if (sudo) { this.matDialog.open(LimitExceededComponent); }
      } else {
        this.openSnackBar('Unable to accept request');
      }
      if (err.includes('Limit Exceeded') || err.includes('Unauthorized')) {
        this.openSnackBar(err);
        this.dialogRef.close();
      }
    }
    this.setUserRequestsLoading(uid, false);
  }

  async rejectRequest(uid: string) {
    this.setUserRequestsLoading(uid, true);
    try {
      await this.admin.cancelRequest(uid);
      this.openSnackBar('Request rejected');
    } catch (err) {
      this.openSnackBar('Unable to reject request');
    }
    this.setUserRequestsLoading(uid, false);
  }

  setUserRequestsLoading(uid: string, loading: boolean) {
    this.userRequests.find(user => user.uid === uid && ( user.loading = loading, true ));
  }

  checkRole(role: any): boolean {
    if (!roles.includes(role)) {
      this.openSnackBar('Role is required');
      return false;
    }
    return true;
  }

}
