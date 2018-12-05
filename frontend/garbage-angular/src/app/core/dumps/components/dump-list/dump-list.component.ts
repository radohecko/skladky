import { Component, OnInit } from '@angular/core';
import { Dump } from 'src/app/shared/interfaces/dump';
import { DumpsService, toggleOptionsLeft, toggleOptionsRight } from '../../services/dumps.service';
import { Subscription } from 'rxjs';
import { ToggleGroupOption, ToggleGroupValue } from 'src/app/shared/components/toggle-buttons/toggle-buttons.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dump-list',
  templateUrl: './dump-list.component.html',
  styleUrls: ['./dump-list.component.scss']
})
export class DumpListComponent implements OnInit {

  dumps: Dump[];
  filteredDumps: Dump[];
  dumpsSubscription: Subscription;

  toggleOptionsLeft: ToggleGroupOption[] = toggleOptionsLeft;
  toggleOptionsRight: ToggleGroupOption[] = toggleOptionsRight;
  optionSelectedValueLeft = 'List';
  optionSelectedValueRight = 'All';

  page = 1;
  perPage = 5;

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

  onNext() {
    if ((this.page * this.perPage) < this.filteredDumps.length) {
      this.page++;
    }
  }

  onPrevious() {
    if (this.page > 1) {
      this.page--;
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
        this.page = 1;
        break;
      default:
        break;
    }
  }
}
