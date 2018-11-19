import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dumps } from 'src/app/shared/interfaces/dumps';
import { DumpsService } from './services/dumps.service';

@Component({
  selector: 'app-dumps',
  templateUrl: './dumps.component.html',
  styleUrls: ['./dumps.component.scss']
})
export class DumpsComponent implements OnInit {

  dumps: Dumps[];
  dumpsSubscription: Subscription;

  constructor(private dumpsService: DumpsService) { }

  ngOnInit() {
    this.dumpsService.getDumps();
    this.dumpsSubscription = this.dumpsService.dumpsObservable$.subscribe(data => {
      this.dumps = data;
    });
  }

}
