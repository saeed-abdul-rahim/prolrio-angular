import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '@services/admin/admin.service';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import toTitleCase from '@utils/toTitleCase';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';
import { LimitExceededComponent } from '@components/limit-exceeded/limit-exceeded.component';
import { AuthService } from '@core/auth.service';

@Component({
  selector: 'app-add-division',
  templateUrl: './add-division.component.html',
  styleUrls: ['./add-division.component.scss']
})
export class AddDivisionComponent implements OnInit {

  id: string;
  createDivForm: FormGroup;
  loading = false;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private admin: AdminService,
              private consoleNav: ConsoleNavService, private snackBar: MatSnackBar, private matDialog: MatDialog,
              public dialogRef: MatDialogRef<AddDivisionComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private analytics: AngularFireAnalytics) {
    const { id } = data;
    this.id = id;
  }

  ngOnInit(): void {
    this.createDivForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      division: ['subject', Validators.required]
    });
  }

  close() {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  get createDivControls() { return this.createDivForm.controls; }

  async onSubmit() {
    const { name, division } = this.createDivControls;
    if (this.createDivForm.invalid) {
      if (division.errors) {
        const { errors } = division;
        if (errors.required) { this.openSnackBar('Type required'); }
      } else if (name.errors) {
        const { errors } = name;
        if (errors.required) { this.openSnackBar(`${toTitleCase(division.value)} Required`); }
        else if (errors.maxlength) { this.openSnackBar('Maximum of only 50 characters allowed'); }
      }
      return;
    }
    if (division.value !== 'course' && division.value !== 'subject') {
      this.openSnackBar('Invalid division');
      return;
    }

    this.loading = true;
    this.consoleNav.getSectionId().subscribe((id: any) => this.id = id);
    try {
      if (division.value === 'course') {
        await this.admin.createSection(name.value, this.id);
        this.analytics.logEvent('section', { create: true });
      } else if (division.value === 'subject') {
        await this.admin.createSubject(name.value, this.id);
        this.analytics.logEvent('subject', { create: true });
      }
      this.close();
    } catch (err) {
      if (err.includes('Limit Exceeded')) {
        const { sudo } = await this.auth.getCurrentUser();
        if (sudo) { this.matDialog.open(LimitExceededComponent); }
      } else {
        this.openSnackBar(`Unable to create ${toTitleCase(division.value)}. ${err}`);
      }
      if (err.includes('Limit Exceeded') || err.includes('Unauthorized')) {
        this.openSnackBar(err);
        this.close();
      }
    }
    this.loading = false;
  }

  toTitle(text: string) {
    return toTitleCase(text);
  }

}
