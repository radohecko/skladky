import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dump } from 'src/app/shared/interfaces/dump';
import { ToggleGroupOption } from 'src/app/shared/components/toggle-buttons/toggle-buttons.component';

@Injectable()
export class DumpsService {

  dumpsCollection: AngularFirestoreCollection<Dump>;
  dumpsObservable$: Observable<Dump[]>;

  constructor(private afs: AngularFirestore) { }

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
