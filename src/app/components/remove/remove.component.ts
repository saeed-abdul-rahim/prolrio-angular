import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.scss']
})
export class RemoveComponent implements OnInit {

  title: string;
  input: string;
  buttonName: string;
  userInput: string;
  danger = false;

  constructor(public dialogRef: MatDialogRef<RemoveComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar) {
    const { title, input, buttonName, danger } = data;
    this.title = title;
    this.input = input;
    this.buttonName = buttonName;
    this.danger = danger;
  }

  ngOnInit(): void {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  inputVal(input: string) {
    this.userInput = input;
  }

  remove() {
    if (this.input !== this.userInput && this.danger) {
      this.openSnackBar(`Type ${this.input}`);
      return;
    }
    this.dialogRef.close(true);
  }

}
