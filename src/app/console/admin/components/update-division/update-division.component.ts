import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '@services/admin/admin.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import snackBarSettings from '@settings/snackBar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import toTitleCase from '@utils/toTitleCase';

@Component({
  selector: 'app-update-division',
  templateUrl: './update-division.component.html',
  styleUrls: ['./update-division.component.scss']
})
export class UpdateDivisionComponent implements OnInit {

  id: string;
  name: string;
  type: 'section' | 'subject';
  input: string;
  loading = false;
  updateDivForm: FormGroup;

  constructor(private snackBar: MatSnackBar, private admin: AdminService, private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<UpdateDivisionComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    const { id, name, type } = data;
    if (!id || !name || !type) { this.close(); }
    this.id = id;
    this.name = name;
    this.type = type;
  }

  ngOnInit(): void {
    this.updateDivForm = this.formBuilder.group({
      name: [this.name, [Validators.required, Validators.maxLength(50)]]
    });
  }

  get updateDivControls() { return this.updateDivForm.controls; }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  close() {
    this.dialogRef.close();
  }

  async onSubmit() {
    const { name } = this.updateDivControls;
    if (this.updateDivControls.invalid) {
      if (name.errors) {
        const { errors } = name;
        if (errors.required) { this.openSnackBar(`${toTitleCase(this.type)} name required`); }
        else if (errors.maxlength) { this.openSnackBar('Maximum of only 50 characters allowed'); }
      }
      return;
    }
    this.loading = true;
    try {
      if (this.type === 'section') { await this.admin.updateSectionName(this.id, name.value); }
      else if (this.type === 'subject') { await this.admin.updateSubjectName(this.id, name.value); }
      this.openSnackBar(`Successfully updated`);
      this.close();
    } catch (err) {
      this.openSnackBar(`Unable to update ${this.name}`);
    }
    this.loading = false;
  }

}
