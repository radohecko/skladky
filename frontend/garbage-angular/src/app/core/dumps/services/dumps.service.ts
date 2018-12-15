import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dump } from 'src/app/shared/interfaces/dump';
import { ToggleGroupOption } from 'src/app/shared/components/toggle-buttons/toggle-buttons.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class DumpsService {

  dumpsCollection: AngularFirestoreCollection<Dump>;
  dumpsObservable$: Observable<Dump[]>;
  uploadPercent$: Observable<number>;

  private basePath = '/uploads';

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage, private snackBar: MatSnackBar) { }

  getDumps() {
    this.dumpsCollection = this.afs.collection<Dump>(`dumps`, ref => ref.orderBy('timestamp', 'desc'));
    this.dumpsObservable$ = this.dumpsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Dump;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addDump(data: Dump, file: File | null) {
    const id = this.afs.createId();
    const dumpRef: AngularFirestoreDocument<Dump> = this.afs.doc(`dumps/${id}`);
    const image = file !== null ? id : null;
    dumpRef.set({ ...data, image: image })
      .then(() => {
        if (file) {
          this.uploadFile(id, file);
        }
        this.toastMessage('New dump added!');
        console.log('Document successfully written!');
      })
      .catch((error) => {
        this.toastMessage('Adding dump attempt failed!');
        console.error('Error writing document: ', error);
      });
  }

  updateDump(id: string, data: Dump, file: File | null) {
    const dumpRef: AngularFirestoreDocument<Dump> = this.afs.doc(`dumps/${id}`);
    const image = file !== null ? id : null;
    dumpRef.update({ ...data, image: image })
      .then(() => {
        if (file) {
          this.uploadFile(id, file);
        }
        this.toastMessage('Dump edited!');
        console.log('Document successfully written!');
      })
      .catch((error) => {
        this.toastMessage('Dump edit attempt failed!');
        console.error('Error writing document: ', error);
      });
  }

  uploadFile(id: string, file: File) {
    const ref = this.storage.ref(`${this.basePath}/${id}`);
    const task = ref.put(file);
    // observe percentage changes
    this.uploadPercent$ = task.percentageChanges();
  }

  toastMessage(message: string) {
    this.snackBar.open(message, null, {
      duration: 3000,
    });
  }

}

export const toggleOptionsLeft: ToggleGroupOption[] = [
  {
    value: 'List',
    label: 'List View'
  },
  {
    value: 'Map',
    label: 'Map View'
  }
];

export const toggleOptionsRight: ToggleGroupOption[] = [
  {
    value: 'All',
    label: 'All'
  },
  {
    value: 'Pending',
    label: 'Pending'
  },
  {
    value: 'Resolved',
    label: 'Resolved'
  },
  {
    value: 'In Process',
    label: 'In Process'
  }
];
