import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {
  imageUrl: Observable<string | null>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string, private storage: AngularFireStorage) { }

  getImage(id: string) {
    const ref = this.storage.ref(`/uploads/${id}`);
    this.imageUrl = ref.getDownloadURL();
  }

  ngOnInit() {
    this.getImage(this.data);
    console.log(this.data);
  }

}
