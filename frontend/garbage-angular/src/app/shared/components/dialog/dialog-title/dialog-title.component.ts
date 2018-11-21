import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog-title',
  templateUrl: './dialog-title.component.html',
  styleUrls: ['./dialog-title.component.scss']
})
export class DialogTitleComponent implements OnInit {

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}
