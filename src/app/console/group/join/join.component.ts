import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';
import { GroupService } from '@services/group/group.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit, OnDestroy {

  groupForm: FormGroup;
  loading: boolean;
  requests: Array<{id: string, openDropdown: boolean, loading: boolean}>;

  requestSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private analytics: AngularFireAnalytics,
              private group: GroupService, private snackBar: MatSnackBar) {
    this.requestSubscription = this.group.getRequests().subscribe(requests =>  {
      const openDropdown = false;
      const loading = false;
      this.requests = [];
      requests.map((id: string) => this.requests.push({ id, openDropdown, loading }));
    });
    this.groupForm = this.formBuilder.group({
      id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.requestSubscription && !this.requestSubscription.closed) { this.requestSubscription.unsubscribe(); }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  async cancelRequest(groupId: string) {
    this.requests.find(request => request.id === groupId && ( request.loading = true, true ));
    try {
      await this.group.cancelRequest(groupId);
    } catch (err) {
      this.openSnackBar('Could not cancel request');
    }
    this.requests.find(request => request.id === groupId && ( request.loading = false, true ));
  }

  get groupFormControls() { return this.groupForm.controls; }

  async onSubmit() {
    const { id } = this.groupFormControls;
    if (this.groupForm.invalid) {
      if (id.errors) {
        const { errors } = id;
        if (errors.required) { this.openSnackBar('Group ID is required'); }
      }
      return;
    }

    this.loading = true;
    try {
      await this.group.request(id.value);
      this.analytics.logEvent('group', { join: true });
    } catch (err) {
      this.openSnackBar('Not able to create request');
    }
    this.loading = false;

  }

}
