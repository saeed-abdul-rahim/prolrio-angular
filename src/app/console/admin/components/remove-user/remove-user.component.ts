import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '@services/admin/admin.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import snackBarSettings from '@settings/snackBar';
import { GroupService } from '@services/group/group.service';

@Component({
  selector: 'app-remove-user',
  templateUrl: './remove-user.component.html',
  styleUrls: ['./remove-user.component.scss']
})
export class RemoveUserComponent implements OnInit {

  uid: string;
  user: string;
  name: string;
  groupId: string;
  sectionId: string;
  subjectId: string;
  loading = false;
  inputId: string;

  constructor(private snackBar: MatSnackBar, private admin: AdminService, private group: GroupService,
              public dialogRef: MatDialogRef<RemoveUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private analytics: AngularFireAnalytics) {
    const { id, user, name, groupId, sectionId, subjectId } = data;
    this.uid = id;
    this.user = user;
    this.name = name;
    this.groupId = groupId;
    this.sectionId = sectionId;
    this.subjectId = subjectId;
  }

  ngOnInit(): void {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  close(success: boolean) {
    this.dialogRef.close(success);
  }

  inputVal(id: string) {
    this.inputId = id;
  }

  async removeUser() {
    this.loading = true;
    if (this.sectionId && this.sectionId !== 'admin') {
      await this.removeUserFromSection();
    } else if (this.subjectId) {
      await this.removeUserFromSubject();
    } else {
      await this.removeUserFromGroup();
    }
    this.loading = false;
  }

  async removeUserFromGroup() {
    if (this.user) {
      if (this.inputId !== this.user) {
        this.openSnackBar(`Type: ${this.user}`);
        return;
      }
      this.loading = true;
      try {
        await this.group.removeUserFromGroup(this.groupId, this.uid);
        this.analytics.logEvent('user', { remove: true, group: true });
        this.close(true);
        return;
      } catch (err) {
        if (err) { this.openSnackBar(err); }
        else { this.openSnackBar('Could not delete user'); }
      }
    } else {
      this.openSnackBar('Cannot process request!');
      this.close(false);
      return;
    }
  }

  async removeUserFromSection() {
    try {
      const response = await this.admin.removeUserFromSection(this.sectionId, this.uid);
      this.analytics.logEvent('user', { remove: true, section: true });
      this.openSnackBar(response);
      this.close(true);
      return;
    } catch (err) {
      if (err) { this.openSnackBar(err); }
      else { this.openSnackBar('Could not delete user'); }
    }
  }


  async removeUserFromSubject() {
    try {
      const response = await this.admin.removeUserFromSubject(this.subjectId, this.uid);
      this.analytics.logEvent('user', { remove: true, subject: true });
      this.openSnackBar(response);
      this.close(true);
      return;
    } catch (err) {
      if (err) { this.openSnackBar(err); }
      else { this.openSnackBar('Could not delete user'); }
    }
  }

}
