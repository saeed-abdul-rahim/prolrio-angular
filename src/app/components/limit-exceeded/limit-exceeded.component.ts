import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-limit-exceeded',
  templateUrl: './limit-exceeded.component.html',
  styleUrls: ['./limit-exceeded.component.scss']
})
export class LimitExceededComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LimitExceededComponent>, private router: Router) { }

  ngOnInit(): void {
  }

  pro() {
    this.router.navigateByUrl('/console/group/tier', { skipLocationChange: true });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
