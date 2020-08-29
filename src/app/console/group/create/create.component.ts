import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';
import { GroupService } from '@services/group/group.service';
import { AuthService } from '@core/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LimitExceededComponent } from '@components/limit-exceeded/limit-exceeded.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  groupForm: FormGroup;
  loading: boolean;

  constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthService,
              private group: GroupService, private snackBar: MatSnackBar,
              private matDialog: MatDialog, private analytics: AngularFireAnalytics) {
    this.groupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern('[A-z\\s]+')]],
      id: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('[A-z0-9-]+')]]
    });
  }

  ngOnInit(): void {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  get groupFormControls() { return this.groupForm.controls; }

  async onSubmit() {
    const { name, id } = this.groupFormControls;
    if (this.groupForm.invalid) {
      if (name.errors) {
        const { errors } = name;
        if (errors.required) { this.openSnackBar('Group name is required'); }
        else if (errors.maxlength) { this.openSnackBar('Group name: Maximum limit exceeded (30 chars)'); }
        else if (errors.minlength) { this.openSnackBar('Group name: At least 5 characters required'); }
        else if (errors.pattern) { this.openSnackBar('Invalid name: Should only contain A-z characters'); }
      } else if (id.errors) {
        const { errors } = id;
        if (errors.required) { this.openSnackBar('Group ID is required'); }
        else if (errors.maxlength) { this.openSnackBar('Group ID: Maximum limit exceeded (15 chars)'); }
        else if (errors.minlength) { this.openSnackBar('Group ID: At least five characters required'); }
        else if (errors.pattern) { this.openSnackBar('Group ID: Invalid pattern'); }
      }
      return;
    }

    this.loading = true;
    try {
      await this.group.create(id.value, name.value);
      await this.auth.getUser();
      this.analytics.logEvent('group', { create: true });
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['console']);
      });
    } catch (err) {
      if (err.includes('Limit Exceeded')) {
        const { sudo } = await this.auth.getCurrentUser();
        if (sudo) { this.matDialog.open(LimitExceededComponent); }
      }
      this.openSnackBar(err);
    }
    this.loading = false;

  }

  navSelectTier() {
    this.router.navigateByUrl(`console/group/tier`);
  }

}
