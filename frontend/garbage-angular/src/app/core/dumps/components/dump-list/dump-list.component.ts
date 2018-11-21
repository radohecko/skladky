import { Component, OnInit } from '@angular/core';
import { Dump } from 'src/app/shared/interfaces/dump';
import { DumpsService } from '../../services/dumps.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dump-list',
  templateUrl: './dump-list.component.html',
  styleUrls: ['./dump-list.component.scss']
})
export class DumpListComponent implements OnInit {

  dumps: Dump[];
  dumpsSubscription: Subscription;

  constructor(private dumpsService: DumpsService) { }

  ngOnInit() {
    this.dumpsService.getDumps();
    this.dumpsSubscription = this.dumpsService.dumpsObservable$.subscribe(data => {
      this.dumps = data;
    });
  }

}
