import { Component, OnInit } from '@angular/core';
import { DumpAddComponent } from '../dumps/components/dump-add/dump-add.component';
import { MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog, private titleService: Title) {
    this.titleService.setTitle('Forest Dump | Home');
  }

  ngOnInit() {
  }

  onOpenAddReport() {
    const dialogRef = this.dialog.open(DumpAddComponent, {
      width: '650px',
      height: '600px'
    });
  }
}
