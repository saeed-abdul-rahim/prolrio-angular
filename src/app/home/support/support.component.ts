import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicService } from '@services/public/public.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  loading = false;
  supportForm: FormGroup;

  constructor(private fb: FormBuilder, private publicService: PublicService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.supportForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  get supportFormControls() { return this.supportForm.controls; }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  async onSubmit() {
    if (!this.validateForm()) { return; }
    this.loading = true;
    const { name, email, message } = this.supportForm.value;
    const date = Date();
    const html = `
      <div>From: ${name}</div>
      <div>Email: <a href="mailto:${email}">${email}</a></div>
      <div>Date: ${date}</div>
      <div>Message: ${message}</div>
    `;
    const formRequest = { name, email, message, date, html };
    try {
      await this.publicService.writeMessage(formRequest);
      this.openSnackBar('Message sent');
    } catch (_) {
      this.openSnackBar('Unable to send message');
    }
    this.supportForm.reset();
    this.loading = false;
  }

  validateForm(): boolean {
    const { name, email, message } = this.supportFormControls;
    if (this.supportForm.invalid) {
      if (name.errors) { this.openSnackBar('Name required'); }
      if (email.errors) {
        const { errors } = email;
        if (errors.required) { this.openSnackBar('Email required'); }
        else { this.openSnackBar('Invalid Email'); }
      }
      if (message.errors) { this.openSnackBar('Message required'); }
      return false;
    }
    return true;
  }

}
