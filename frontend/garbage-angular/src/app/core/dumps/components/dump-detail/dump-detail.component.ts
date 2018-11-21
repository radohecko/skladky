import { Component, OnInit, Input } from '@angular/core';
import { Dump } from 'src/app/shared/interfaces/dump';
import { MatDialog } from '@angular/material';
import { DumpEditComponent } from '../dump-edit/dump-edit.component';

@Component({
  selector: 'app-dump-detail',
  templateUrl: './dump-detail.component.html',
  styleUrls: ['./dump-detail.component.scss']
})
export class DumpDetailComponent implements OnInit {

  @Input() dump: Dump;

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  // TODO: Open image in new tab - full size
  onOpenImage() { }

  onOpenEdit() {
    const dialogRef = this.dialog.open(DumpEditComponent, {
      width: '650px',
      data: this.dump
    });
  }

}
