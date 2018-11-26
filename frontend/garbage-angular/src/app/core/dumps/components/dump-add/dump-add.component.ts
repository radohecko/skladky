declare const google: any;

import { Component, OnInit } from '@angular/core';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Status } from 'src/app/shared/interfaces/status';
import { DumpsService } from '../../services/dumps.service';
import { Observable, Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dump-add',
  templateUrl: './dump-add.component.html',
  styleUrls: ['./dump-add.component.scss']
})
export class DumpAddComponent implements OnInit {

  form: FormGroup;
  percentageSubscription: Subscription;
  uploadPercentage: number;
  location: any;
  statusOptions: Status[] = [
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Pending', value: 'Pending' },
    { label: 'In Process', value: 'In Process' }
  ];

  color = 'primary';
  mode = 'query';

  constructor(
    private fb: FormBuilder,
    private dumpsService: DumpsService,
    private dialogRef: MatDialogRef<DumpAddComponent>) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      location: [],
      status: [this.statusOptions[1].value],
      amount: [],
      materials: [],
      substances: [],
      image: [],
    });
  }

  setLocationTitle($event) {
    this.location = $event;
    this.form.get('location').setValue($event.adressName.formatted_address);
    console.log($event.adressName.formatted_address);
  }

  uploadFile($event) {
    this.dumpsService.uploadFile($event.target.files[0]);
    this.percentageSubscription = this.dumpsService.uploadPercent$.subscribe(
      percentage =>
        this.uploadPercentage = percentage);
  }

  saveForm() {
    const value = this.form.value;
    console.log(value);
  }

  onClose() {
    this.dialogRef.close();
  }

}
