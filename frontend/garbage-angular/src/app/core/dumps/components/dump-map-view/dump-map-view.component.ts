import { Component, OnInit } from '@angular/core';
import { ToggleGroupOption, ToggleGroupValue } from 'src/app/shared/components/toggle-buttons/toggle-buttons.component';
import { toggleOptionsLeft, toggleOptionsRight, DumpsService } from '../../services/dumps.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dump } from 'src/app/shared/interfaces/dump';

@Component({
  selector: 'app-dump-map-view',
  templateUrl: './dump-map-view.component.html',
  styleUrls: ['./dump-map-view.component.scss']
})
export class DumpMapViewComponent implements OnInit {

  dumps: Dump[];
  filteredDumps: Dump[];
  dumpsSubscription: Subscription;

  toggleOptionsLeft: ToggleGroupOption[] = toggleOptionsLeft;
  toggleOptionsRight: ToggleGroupOption[] = toggleOptionsRight;
  optionSelectedValueLeft = 'Map';
  optionSelectedValueRight = 'All';

  constructor(private dumpsService: DumpsService, private router: Router) { }

  ngOnInit() {
    this.dumpsService.getDumps();
    this.dumpsSubscription = this.dumpsService.dumpsObservable$.subscribe(data => {
      this.dumps = data;
      this.filteredDumps = this.dumps;
    });
  }

  filterByStatus(status: string) {
    if (status !== 'All') {
      this.filteredDumps = this.dumps.filter(dump => dump.status === status);
    } else {
      this.filteredDumps = this.dumps;
    }
  }

  onSelectedValueChange($event: ToggleGroupValue) {
    switch ($event) {
      case 'List':
        this.router.navigate(['/dumps/list']);
        break;
      case 'Map':
        this.router.navigate(['/dumps/map']);
        break;
      case 'All':
      case 'Pending':
      case 'Resolved':
      case 'In Process':
        this.filterByStatus($event);
        break;
      default:
        break;
    }
  }

}
