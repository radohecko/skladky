import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Dump } from 'src/app/shared/interfaces/dump';

@Component({
  selector: 'app-dump-edit',
  templateUrl: './dump-edit.component.html',
  styleUrls: ['./dump-edit.component.scss']
})
export class DumpEditComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Dump) { }

  ngOnInit() {
  }

}
