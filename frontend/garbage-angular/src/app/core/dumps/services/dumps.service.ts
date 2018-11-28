import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dump } from 'src/app/shared/interfaces/dump';
import { ToggleGroupOption } from 'src/app/shared/components/toggle-buttons/toggle-buttons.component';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable()
export class DumpsService {

  dumpsCollection: AngularFirestoreCollection<Dump>;
  dumpsObservable$: Observable<Dump[]>;
  uploadPercent$: Observable<number>;

  private basePath = '/uploads';

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) { }

  getDumps() {
    this.dumpsCollection = this.afs.collection<Dump>(`dumps`);
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
        console.log('Document successfully written!');
      })
      .catch((error) => {
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
        console.log('Document successfully written!');
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }

  uploadFile(id: string, file: File) {
    const ref = this.storage.ref(`${this.basePath}/${id}`);
    const task = ref.put(file);
    // observe percentage changes
    this.uploadPercent$ = task.percentageChanges();
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

export const toggleOptionsPage: ToggleGroupOption[] = [
  {
    value: 'Previous',
    label: '<'
  },
  {
    value: 'Next',
    label: '>'
  }
];
