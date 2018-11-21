import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  @Input() text: string;
  @Input() confirmText =  'Potvrdiť';
  @Input() cancelText = 'Zrušiť';

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  ngOnInit() {
  }

}
