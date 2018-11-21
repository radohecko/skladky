import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dump } from 'src/app/shared/interfaces/dump';
import { DumpsService } from './services/dumps.service';
import { MatDialog } from '@angular/material';
import { DumpAddComponent } from './components/dump-add/dump-add.component';

@Component({
  selector: 'app-dumps',
  templateUrl: './dumps.component.html',
  styleUrls: ['./dumps.component.scss']
})
export class DumpsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  onOpenAddReport() {
    const dialogRef = this.dialog.open(DumpAddComponent, {
      width: '650px'
    });
  }

}
