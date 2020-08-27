import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() template: TemplateRef<any>;
  open = false;

  constructor() { }

  ngOnInit(): void {
  }

}
