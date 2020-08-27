import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '@services/admin/admin.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import snackBarSettings from '@settings/snackBar';

@Component({
  selector: 'app-remove-division',
  templateUrl: './remove-division.component.html',
  styleUrls: ['./remove-division.component.scss']
})
export class RemoveDivisionComponent implements OnInit {

  id: string;
  name: string;
  type: 'section' | 'subject';
  input: string;
  loading = false;

  constructor(private snackBar: MatSnackBar, private admin: AdminService, private analytics: AngularFireAnalytics,
              public dialogRef: MatDialogRef<RemoveDivisionComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    const { id, name, type } = data;
    if (!id || !name || !type) { this.close(); }
    this.id = id;
    this.name = name;
    this.type = type;
  }

  ngOnInit(): void {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  close() {
    this.dialogRef.close();
  }

  inputVal(id: string) {
    this.input = id;
  }

  removeDivision() {
    if (this.type === 'section') { this.removeSection(); }
    else if (this.type === 'subject') { this.removeSubject(); }
  }

  async removeSection() {
    this.loading = true;
    try {
      await this.admin.removeSection(this.id);
      this.analytics.logEvent('section', { remove: true });
      this.openSnackBar(`Successfully removed section ${name}`);
      this.close();
    } catch (err) {
      this.openSnackBar(`Unable to remove section ${name}`);
    }
    this.loading = false;
  }

  async removeSubject() {
    this.loading = true;
    try {
      await this.admin.removeSubject(this.id);
      this.analytics.logEvent('subject', { remove: true });
      this.openSnackBar(`Successfully removed section ${name}`);
      this.close();
    } catch (err) {
      this.openSnackBar(`Unable to remove subject ${name}`);
    }
    this.loading = false;
  }

}
