import { Component, OnInit, Input } from '@angular/core';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() title: string;
  @Input() body: string;
  @Input() url: string;
  @Input() contentType: string;

  faCaretRight = faCaretRight;
  faFileAlt = faFileAlt;

  constructor() { }

  ngOnInit(): void {
    this.title = this.title.length > 70 ? `${this.title.slice(0, 67)}...` : this.title;
    this.body = this.body.length > 30 ? `${this.body.slice(0, 27)}...` : this.body;
  }

}
