import { Component, OnInit } from '@angular/core';
import { ToggleGroupOption } from 'src/app/shared/components/toggle-buttons/toggle-buttons.component';
import { toggleOptionsLeft, toggleOptionsRight } from '../../services/dumps.service';

@Component({
  selector: 'app-dump-map',
  templateUrl: './dump-map.component.html',
  styleUrls: ['./dump-map.component.scss']
})
export class DumpMapComponent implements OnInit {

  toggleOptionsLeft: ToggleGroupOption[] = toggleOptionsLeft;
  toggleOptionsRight: ToggleGroupOption[] = toggleOptionsRight;
  optionSelectedValueLeft = 'Map';
  optionSelectedValueRight = 'All';

  constructor() { }

  ngOnInit() { }

  onSelectedValueChange($event) {
    console.log($event);
  }

}
