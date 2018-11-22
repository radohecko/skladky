import { Component, OnInit } from '@angular/core';
import { Dump } from 'src/app/shared/interfaces/dump';
import { DumpsService } from '../../services/dumps.service';
import { Subscription } from 'rxjs';
import { ToggleGroupOption } from 'src/app/shared/components/toggle-buttons/toggle-buttons.component';

@Component({
  selector: 'app-dump-list',
  templateUrl: './dump-list.component.html',
  styleUrls: ['./dump-list.component.scss']
})
export class DumpListComponent implements OnInit {

  dumps: Dump[];
  dumpsSubscription: Subscription;

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

  constructor(private dumpsService: DumpsService) { }

  ngOnInit() {
    this.dumpsService.getDumps();
    this.dumpsSubscription = this.dumpsService.dumpsObservable$.subscribe(data => {
      this.dumps = data;
    });
  }

  onSelectedValueChange($event) {
    console.log($event);
  }

}
