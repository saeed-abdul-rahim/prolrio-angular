import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import snackBarSettings from '@settings/snackBar';
import { ProviderService } from '@services/provider/provider.service';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.scss']
})
export class EditEntityComponent implements OnInit {

  id: string;
  title: string;
  description: string;
  entityForm: FormGroup;
  loading = false;

  editorConfig = {
    editable: true,
    placeholder: 'Description',
    toolbarHiddenButtons: [
      ['insertImage'],
      ['insertVideo']
    ]
  };

  constructor(public dialogRef: MatDialogRef<EditEntityComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,
              private formBuilder: FormBuilder, private provider: ProviderService, private consoleNav: ConsoleNavService) {
    const { id, title, description } = data;
    this.id = id;
    this.title = title;
    this.description = description;
    if (!this.id) { this.close(); }
  }

  ngOnInit(): void {
    this.entityForm = this.formBuilder.group({
      title: [this.title, [Validators.required, Validators.maxLength(100)]],
      description: [this.description, [Validators.maxLength(10000)]]
    });
  }

  get form() { return this.entityForm.controls; }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  close() {
    this.dialogRef.close();
  }

  async onSubmit() {
    const error = this.checkFormErrors();
    if (!error) {
      this.loading = true;
      const { title, description } = this.form;
      try {
        await this.provider.updateEntity(this.id, title.value, description.value);
        this.openSnackBar('Updated Successfully');
        this.consoleNav.popUrl();
        const baseUrl = this.consoleNav.getBaseUrl();
        const url = `${baseUrl}/entity/${this.id}`;
        this.consoleNav.pushUrl({ label: title.value, url });
        this.close();
      } catch (err) {
        this.openSnackBar('Error: Unable to update content');
      }
      this.loading = false;
    }
  }

  checkFormErrors() {
    let error = false;
    const { title, description } = this.form;
    if (this.entityForm.invalid) {
      if (title.errors) {
        const { errors } = title;
        if (errors.required) { this.openSnackBar('Title is required'); }
        if (errors.maxlength) { this.openSnackBar('Title: Maximum limit exceeded (100 chars)'); }
      }
      else if (description.errors) {
        const { errors } = description;
        if (errors.maxlength) { this.openSnackBar('Description: Maximum limit exceeded (10,000 chars)'); }
      }
      error = true;
    }
    return error;
  }

}
