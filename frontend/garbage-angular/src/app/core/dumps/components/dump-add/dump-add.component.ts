import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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

  form: FormGroup;
  percentageSubscription: Subscription;
  uploadPercentage: number;
  location: GoogleLocation;
  file: File;
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
      console.log(this.dump);
      this.setDefaultValues();
    }
  }

  ngOnDestroy() {
    unsubscribe(this.percentageSubscription);
  }

  createForm() {
    this.form = this.fb.group({
      locationName: ['', Validators.required],
      status: [this.statusOptions[1].value, Validators.required],
      amount: ['car', Validators.required],
      materials: this.fb.array([
        this.fb.control(null)
      ]),
      substances: this.fb.array([
        this.fb.control(null)
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
    this.materials.push(this.fb.control(''));
  }

  addSubstance() {
    this.substances.push(this.fb.control(''));
  }

  removeMaterial(index: number) {
    this.materials.removeAt(index);
  }

  removeSubstance(index: number) {
    this.substances.removeAt(index);
  }

  onClose() {
    this.dialogRef.close();
  }

}
