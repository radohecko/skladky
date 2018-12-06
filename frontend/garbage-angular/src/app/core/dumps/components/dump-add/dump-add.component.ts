import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Status } from 'src/app/shared/interfaces/status';
import { DumpsService } from '../../services/dumps.service';
import { Subscription, Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { firestore } from 'firebase/app';
import { Dump } from 'src/app/shared/interfaces/dump';
import { GoogleLocation } from 'src/app/shared/interfaces/location';
import { unsubscribe } from 'src/app/shared/utils/subscription.util';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-dump-add',
  templateUrl: './dump-add.component.html',
  styleUrls: ['./dump-add.component.scss']
})
export class DumpAddComponent implements OnInit, OnDestroy {

  @Input() dump: Dump;

  searchAdress: string;
  form: FormGroup;
  percentageSubscription: Subscription;
  uploadPercentage: number;
  location: GoogleLocation;
  file: File;
  addressSubscription: Subscription;
  statusOptions: Status[] = [
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Pending', value: 'Pending' },
    { label: 'In Process', value: 'In Process' }
  ];

  color = 'primary';
  mode = 'query';

  get materials() {
    return this.form.get('materials') as FormArray;
  }

  get substances() {
    return this.form.get('substances') as FormArray;
  }

  get materialsLength() {
    return this.materials.length;
  }

  get substancesLength() {
    return this.substances.length;
  }

  constructor(
    private fb: FormBuilder,
    private dumpsService: DumpsService,
    private dialogRef: MatDialogRef<DumpAddComponent>,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.createForm();
    if (this.dump) {
      this.setDefaultValues();
    }
    this.addressSubscription = this.form.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        this.materials.controls[0].markAsTouched();
        this.materials.controls[0].markAsDirty();
      }
    });

    this.form.get('locationName').valueChanges.subscribe(address => {
      console.log(address);
      if (address.length > 4) {
        this.searchAdress = address;
      }
    });
  }

  ngOnDestroy() {
    unsubscribe(this.percentageSubscription);
    unsubscribe(this.addressSubscription);
  }

  createForm() {
    this.form = this.fb.group({
      locationName: ['', Validators.required],
      status: [{ value: this.statusOptions[1].value, disabled: true }, Validators.required],
      amount: ['car', Validators.required],
      materials: this.fb.array([
        this.fb.control('', Validators.required)
      ], Validators.required),
      substances: this.fb.array([
        this.fb.control('')
      ]),
      email: ['', Validators.email]
    });
  }

  setDefaultValues() {
    this.form = this.fb.group({
      locationName: [this.dump.locationName, Validators.required],
      status: [this.dump.status, Validators.required],
      amount: [this.dump.amount, Validators.required],
      materials: this.fb.array(this.dump.materials || []),
      substances: this.fb.array(this.dump.substances || []),
      email: [this.dump.email || '', Validators.email]
    });
  }

  setLocationTitle($event: GoogleLocation) {
    this.location = $event;
    this.form.get('locationName').setValue($event.adressName);
  }

  uploadFile($event) {
    this.file = $event.target.files[0];
  }

  saveForm() {
    const value = this.form.value;
    const data: Dump = {
      ...this.form.value,
      location: new firestore.GeoPoint(this.location.lat, this.location.lng),
      region: this.location.region,
      timestamp: new Date()
    };
    if (this.file) {
      this.dumpsService.addDump(data, this.file);
      if (this.dumpsService.uploadPercent$) {
        this.percentageSubscription = this.dumpsService.uploadPercent$.subscribe(
          percentage =>
            this.uploadPercentage = percentage);
      }
    } else {
      this.dumpsService.addDump(data, null);
      this.onClose();
    }
  }

  updateForm() {
    const value = this.form.value;
    const data: Dump = {
      ...this.form.value,
      location: new firestore.GeoPoint(this.location.lat, this.location.lng),
      region: this.location.region,
      timestamp: new Date()
    };
    if (this.file) {
      this.dumpsService.updateDump(this.dump.id, data, this.file);
      if (this.dumpsService.uploadPercent$) {
        this.percentageSubscription = this.dumpsService.uploadPercent$.subscribe(
          percentage =>
            this.uploadPercentage = percentage);
      }
    } else {
      this.dumpsService.updateDump(this.dump.id, data, null);
      this.onClose();
    }
  }

  addMaterial() {
    this.materials.push(this.fb.control('', Validators.required));
    this.materials.controls[this.materialsLength - 1].markAsTouched();
  }

  addSubstance() {
    this.substances.push(this.fb.control('', Validators.required));
    this.substances.controls[this.substancesLength - 1].markAsTouched();
  }

  removeMaterial(index: number) {
    this.materials.removeAt(index);
  }

  removeSubstance(index: number) {
    this.substances.removeAt(index);
    if (this.substancesLength === 1 && this.substances.controls[0].value === '') {
      this.substances.controls[0].clearValidators();
      this.substances.controls[0].markAsUntouched();
    }
  }

  showMaterialAddButton(index: number, control: FormControl) {
    if (index === this.materialsLength - 1 && control.value !== '') {
      return true;
    }
    return false;
  }

  showSubstanceslAddButton(index: number, control: FormControl) {
    if (index === this.substancesLength - 1 && control.value !== '') {
      return true;
    }
    return false;
  }

  onClose() {
    this.dialogRef.close();
  }

}
