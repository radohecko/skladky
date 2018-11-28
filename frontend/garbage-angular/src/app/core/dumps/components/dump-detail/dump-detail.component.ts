import { Component, OnInit, Input } from '@angular/core';
import { Dump } from 'src/app/shared/interfaces/dump';
import { MatDialog } from '@angular/material';
import { DumpEditComponent } from '../dump-edit/dump-edit.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dump-detail',
  templateUrl: './dump-detail.component.html',
  styleUrls: ['./dump-detail.component.scss']
})
export class DumpDetailComponent implements OnInit {

  @Input() dump: Dump;

  imageUrl: Observable<string | null>;

  constructor(public dialog: MatDialog, private storage: AngularFireStorage) { }

  ngOnInit() {
    if (this.dump.image !== null) {
      this.getImage(this.dump.image);
    }
  }

  getImage(id: string) {
    const ref = this.storage.ref(`/uploads/${id}`);
    this.imageUrl = ref.getDownloadURL();
  }

  // TODO: Open image in new tab - full size
  onOpenImage() { }

  onOpenEdit() {
    const dialogRef = this.dialog.open(DumpEditComponent, {
      width: '650px',
      data: this.dump
    });
  }

}
