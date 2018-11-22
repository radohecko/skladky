import { Component, OnInit } from '@angular/core';
import { ToggleGroupOption } from 'src/app/shared/components/toggle-buttons/toggle-buttons.component';

@Component({
  selector: 'app-dump-map',
  templateUrl: './dump-map.component.html',
  styleUrls: ['./dump-map.component.scss']
})
export class DumpMapComponent implements OnInit {

  toggleOptionsLeft: ToggleGroupOption[] = [
    {
      value: 'List',
      label: 'List'
    },
    {
      value: 'Map',
      label: 'Map'
    }
  ];
  optionSelectedValueLeft = 'List';

  constructor() { }

  ngOnInit() { }

  onSelectedValueChange($event) {
    console.log($event);
  }

}
