import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dumps } from 'src/app/shared/interfaces/dumps';

@Injectable()
export class DumpsService {

  dumpsCollection: AngularFirestoreCollection<Dumps>;
  dumpsObservable$: Observable<Dumps[]>;

  constructor(private afs: AngularFirestore) {}

  getDumps() {
    this.dumpsCollection = this.afs.collection<Dumps>(`dumps`);
    this.dumpsObservable$ = this.dumpsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Dumps;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
