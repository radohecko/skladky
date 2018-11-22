import { Component, OnInit } from '@angular/core';
import { Dump } from 'src/app/shared/interfaces/dump';
import { DumpsService, toggleOptionsLeft, toggleOptionsRight } from '../../services/dumps.service';
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

  toggleOptionsLeft: ToggleGroupOption[] = toggleOptionsLeft;
  toggleOptionsRight: ToggleGroupOption[] = toggleOptionsRight;
  optionSelectedValueLeft = 'List';
  optionSelectedValueRight = 'All';

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
