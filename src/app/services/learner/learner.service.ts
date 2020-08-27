import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore, Query } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { EntityInterface } from '@models/Entity';
import { environment } from '@environment';
import { getDataFromCollection } from '@utils/getFirestoreData';

@Injectable()
export class LearnerService {

  dbEntities: string;
  db: AngularFirestoreDocument;
  entities: AngularFirestoreCollection;
  allSubEntities$: Observable<EntityInterface[][]>;

  constructor(private afs: AngularFirestore) {
    const { db } = environment;
    const { version, name, entities } = db;
    this.db = this.afs.collection(version).doc(name);
    this.dbEntities = entities;
  }

  getAllEntities(subjectIds: string[], groupId: string): Observable<EntityInterface[][]> {
    const queries = subjectIds.map(subjectId => {
      const entityData = this.db.collection<EntityInterface[]>(this.dbEntities, ref =>
        this.commonFilter(ref, groupId)
        .where('subjectId', '==', subjectId)
        .orderBy('createdAt', 'desc')
        .limit(8));
      return getDataFromCollection(entityData) as Observable<EntityInterface[]>;
    });
    this.allSubEntities$ = combineLatest(queries);
    return this.allSubEntities$;
  }

  private commonFilter(dbRef: any, groupId: string): Query {
    return dbRef.where('groupId', '==', groupId);
  }

}
