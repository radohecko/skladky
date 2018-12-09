import { Component, OnInit } from '@angular/core';
import { Dump } from 'src/app/shared/interfaces/dump';
import { DumpsService, toggleOptionsLeft, toggleOptionsRight } from '../../services/dumps.service';
import { Subscription } from 'rxjs';
import { ToggleGroupOption, ToggleGroupValue } from 'src/app/shared/components/toggle-buttons/toggle-buttons.component';
import { Router } from '@angular/router';
import { ConsoleReporter } from 'jasmine';

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

  dis_prev = true;
  dis_next = false;

  constructor(private dumpsService: DumpsService, private router: Router) { }

  ngOnInit() {
    this.dumpsService.getDumps();
    this.dumpsSubscription = this.dumpsService.dumpsObservable$.subscribe(data => {
      this.dumps = data;
      this.filteredDumps = this.dumps;
      this.filterByStatus('All');
    });
  }

  filterByStatus(status: string) {

    if (status !== 'All') {
      this.filteredDumps = this.dumps.filter(dump => dump.status === status);
    } else {
      this.filteredDumps = this.dumps;
    }
    if (this.filteredDumps) {
      if ((this.page * this.perPage) >= this.filteredDumps.length) {
        this.dis_next = true;
      } else {
        this.dis_next = false;
      }
    }

  }

  onNext() {
    if ((this.page * this.perPage) < this.filteredDumps.length) {
      this.page++;
      this.dis_prev = false;
      if (this.page === Math.ceil(this.filteredDumps.length / this.perPage)) {
        this.dis_next = true;
      }
    }
  }

  onPrevious() {
    if (this.page > 1) {
      this.page--;
      this.dis_next = false;
      if (this.page === 1) {
        this.dis_prev = true;
      }
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
        this.page = 1;
        this.dis_prev = true;
        this.filterByStatus($event);
        break;
      default:
        break;
    }
  }
}
