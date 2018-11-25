declare const google: any;

import { Component, OnInit } from '@angular/core';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Status } from 'src/app/shared/interfaces/status';

@Component({
  selector: 'app-dump-add',
  templateUrl: './dump-add.component.html',
  styleUrls: ['./dump-add.component.scss']
})
export class DumpAddComponent implements OnInit {

  form: FormGroup;
  statusOptions: Status[] = [
    {label: 'Resolved', value: 'Resolved'},
    {label: 'Pending', value: 'Pending'},
    {label: 'In Process', value: 'In Process'}
  ];

  constructor(private fb: FormBuilder) {}

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

  saveForm() {
    const value = this.form.value;
    console.log(value);
  }

}
