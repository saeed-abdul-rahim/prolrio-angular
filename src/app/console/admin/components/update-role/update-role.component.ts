import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import roleValidator from '@utils/roleValidator';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';
import { AdminService } from '@services/admin/admin.service';
import { displayRoleMap } from '@models/User';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.scss']
})
export class UpdateRoleComponent implements OnInit {

  displayRoleMap = displayRoleMap;
  uid: string;
  loading: boolean;
  updateRoleForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private admin: AdminService,
              public dialogRef: MatDialogRef<UpdateRoleComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    const { id } = data;
    this.uid = id;
  }

  ngOnInit(): void {
    this.updateRoleForm = this.formBuilder.group({
      role: ['', [Validators.required, roleValidator]]
    });
  }

  close() {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  get updateRoleControls() { return this.updateRoleForm.controls; }

  async onUpdateRoleSubmit() {
    const { role } = this.updateRoleControls;
    if (this.updateRoleForm.invalid) {
      if (role.errors) {
        const { errors } = role;
        if (errors.required) { this.openSnackBar('Role is required'); }
        else { this.openSnackBar('Invalid Role'); }
      }
      return;
    }
    if (!this.uid) {
      this.openSnackBar('Unknown error occurred');
      this.close();
      return;
    }
    this.loading = true;
    try {
      const response = await this.admin.updateRole(this.uid, role.value);
      this.openSnackBar(response);
      this.close();
    } catch (err) {
      if (err) { this.openSnackBar(err); }
      else { this.openSnackBar('Could not update user'); }
    }
    this.loading = false;
  }

}
