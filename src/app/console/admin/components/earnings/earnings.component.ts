import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsComponent implements OnInit, OnDestroy {

  loading = false;
  paymentForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  async onSubmit() {}

}
