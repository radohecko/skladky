import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DumpAddComponent } from './components/dump-add/dump-add.component';
import { ToggleGroupOption } from 'src/app/shared/components/toggle-buttons/toggle-buttons.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dumps',
  templateUrl: './dumps.component.html',
  styleUrls: ['./dumps.component.scss']
})
export class DumpsComponent implements OnInit {

  constructor(public dialog: MatDialog, private titleService: Title) {
    this.titleService.setTitle('Forest Dump Dumps');
  }

  ngOnInit() {}

  onOpenAddReport() {
    const dialogRef = this.dialog.open(DumpAddComponent, {
      width: '650px',
      height: '600px'
    });
  }

}
