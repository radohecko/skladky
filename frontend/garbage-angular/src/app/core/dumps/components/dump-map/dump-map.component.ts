import { Component, OnInit, Input } from '@angular/core';
import { Dump } from 'src/app/shared/interfaces/dump';

@Component({
  selector: 'app-dump-map',
  templateUrl: './dump-map.component.html',
  styleUrls: ['./dump-map.component.scss']
})
export class DumpMapComponent implements OnInit {

  @Input() dumps: Dump[];

  constructor() { }

  ngOnInit() {
  }

}
