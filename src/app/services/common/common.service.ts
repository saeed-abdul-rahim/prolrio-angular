import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, Query } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, Subscription, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import fileSaver from 'file-saver';

import { environment } from '@environment';
import { SubjectInterface } from '@models/Subject';
import { SectionInterface } from '@models/Section';
import { EntityInterface } from '@models/Entity';
import { AuthService } from '@core/auth.service';
import { User, UserAnalyticsInterface } from '@models/User';
import { getDataFromCollection } from '@utils/getFirestoreData';
import { MetadataInterface } from '@models/Metadata';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private user: User;

  private dbSections: string;
  private dbSubjects: string;
  private dbEntities: string;
  private dbMetadata: string;
  private dbUsers: string;

  private db: AngularFirestoreDocument;

  private sections: AngularFirestoreCollection;
  private subjects: AngularFirestoreCollection;
  private entities: AngularFirestoreCollection;

  private subjectId: BehaviorSubject<string> = new BehaviorSubject<string> (null);
  private subject: BehaviorSubject<SubjectInterface> = new BehaviorSubject<SubjectInterface> (null);
  private allEntities: BehaviorSubject<EntityInterface[]> = new BehaviorSubject<EntityInterface[]> (null);
  entitiesError: BehaviorSubject<string> = new BehaviorSubject<string> (null);
  entitiesLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean> (false);
  subjectError: BehaviorSubject<string> = new BehaviorSubject<string> (null);
  subjectLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean> (false);

  section$: Observable<SectionInterface>;
  entity$: Observable<EntityInterface>;
  sections$: Observable<SectionInterface[]>;
  subjects$: Observable<SubjectInterface[]>;
  entities$: Observable<EntityInterface[]>;
  subject$: Observable<SubjectInterface> = this.subject.asObservable();
  allEntities$: Observable<EntityInterface[]> = this.allEntities.asObservable();

  private allEntitiesSubscription: Subscription;
  private subjectSubscription: Subscription;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    const { db } = environment;
    const { version, name, sections, subjects, entities, metadata, users } = db;
    this.db = this.afs.collection(version).doc(name);
    this.dbSections = sections;
    this.dbSubjects = subjects;
    this.dbEntities = entities;
    this.dbMetadata = metadata;
    this.dbUsers = users;
    this.getCurrentUser();
  }

  onDestroy() {
    this.unsubscribeSubject();
    this.unsubscribeAllEntities();
  }

  getUser(): User {
    return this.user;
  }

  getMetadata(): Observable<MetadataInterface> {
    const { groupId } = this.user;
    return this.db.collection(this.dbMetadata).doc<MetadataInterface>(groupId).valueChanges();
  }

  getSections(id = ''): Observable<SectionInterface[]> {
    this.sections = this.db.collection(this.dbSections, ref =>
      this.commonFilter(ref).where('parentId', '==', id).orderBy('createdAt', 'asc')
    );
    this.sections$ = getDataFromCollection(this.sections);
    return this.sections$;
  }

  getSubjects(id = ''): Observable<SubjectInterface[]> {
    this.subjects = this.db.collection(this.dbSubjects, ref =>
      this.commonFilter(ref).where('sectionId', '==', id)
    );
    this.subjects$ = getDataFromCollection(this.subjects);
    return this.subjects$;
  }

  getSection(sectionId: string): Observable<SectionInterface> {
    this.section$ = this.db.collection(this.dbSections).doc<SectionInterface>(sectionId).valueChanges();
    return this.section$;
  }

  setCurrentSubject(subjectId: string) {
    const currentSubject = this.subject.getValue();
    if (currentSubject && currentSubject.subjectId === subjectId) { return; }
    this.unsubscribeSubject();
    this.subjectSubscription = this.db.collection(this.dbSubjects).doc<SubjectInterface>(subjectId).valueChanges().subscribe(
      subject => this.subject.next(subject)
    );
  }

  getCurrentSubject(): Observable<SubjectInterface> {
    return this.subject$;
  }

  getEntity(entityId: string): Observable<EntityInterface> {
    this.entity$ = this.db.collection<EntityInterface>(this.dbEntities).doc(entityId).valueChanges();
    return this.entity$;
  }

  setAllEntities(entities$: Observable<EntityInterface[]>) {
    this.entitiesLoader.next(true);
    this.unsubscribeAllEntities();
    this.allEntitiesSubscription = entities$.subscribe(
      entities => {
        const cleanEntities = entities.filter(e => e);
        this.allEntities.next(cleanEntities);
        this.entitiesLoader.next(false);
      },
      (err) => {
        this.entitiesError.next(err);
        this.entitiesLoader.next(false);
      }
    );
  }

  getAllEntities(): Observable<EntityInterface[]> {
    return this.allEntities$;
  }

  getEntities(subjectId: string): Observable<EntityInterface[]> {
    this.entitiesError.next('');
    if (this.subjectId.getValue() === subjectId && this.allEntities.getValue()) { return; }
    this.subjectId.next(subjectId);
    this.entities = this.db.collection(this.dbEntities, ref => this.subjectFilter(ref, subjectId).orderBy('order', 'asc'));
    this.entities$ = getDataFromCollection(this.entities);
    this.setAllEntities(this.entities$);
    return this.entities$;
  }

  getThreeEntities(entityId: string) {
    const dbEntities = this.db.collection<EntityInterface[]>(this.dbEntities);
    const dbEntity = dbEntities.doc(entityId).snapshotChanges().pipe(
      switchMap(enty => {
        const entity = enty.payload.data() as EntityInterface;
        entity.id = enty.payload.id;
        const nextEntity = this.db.collection<EntityInterface[]>(this.dbEntities, ref => this.nextEntitySet(ref, entity, 'order', 1));
        const prevEntity = this.db.collection<EntityInterface[]>(this.dbEntities, ref => this.prevEntitySet(ref, entity, 'order', 1));
        const nextEntity$ = getDataFromCollection(nextEntity).pipe(map(ent => ent[0])) as Observable<EntityInterface>;
        const prevEntity$ = getDataFromCollection(prevEntity).pipe(map(ent => ent[0])) as Observable<EntityInterface>;
        const allEntities$ = combineLatest([prevEntity$, nextEntity$, of(entity)]);
        return allEntities$;
      })
    );
    this.entities$ = dbEntity;
    this.setAllEntities(dbEntity);
  }

  nextEntitySet(ref: Query, lastDoc: EntityInterface, field: string, limit: number) {
    return ref.where('subjectId', '==', lastDoc.subjectId)
          .orderBy(field)
          .startAfter(lastDoc[field])
          .limit(limit);
  }

  prevEntitySet(ref: Query, firstDoc: EntityInterface, field: string, limit: number) {
    return ref.where('subjectId', '==', firstDoc.subjectId)
          .orderBy(field)
          .endBefore(firstDoc[field])
          .limitToLast(limit);
  }

  unsubscribeAllEntities() {
    if (this.allEntitiesSubscription && !this.allEntitiesSubscription.closed) {
      this.allEntitiesSubscription.unsubscribe();
      this.subjectId.next(null);
    }
  }

  unsubscribeSubject() {
    if (this.subjectSubscription && !this.subjectSubscription.closed) {
      this.subjectSubscription.unsubscribe();
      this.subject.next(null);
    }
  }

  async getFileFromLink(link: string, title: string) {
    try {
      const blob = await (await fetch(link)).blob();
      fileSaver.saveAs(blob, `${title}-${Date.now()}.pdf`);
    } catch (err) {
      throw err;
    }
  }

  async getAnalytics(entityId: string) {
    try {
      const doc = await this.getUserDocument().collection(this.dbEntities).doc(entityId).get().toPromise();
      return doc.exists ? doc.data() as UserAnalyticsInterface : null;
    } catch (_) {
      return undefined;
    }
  }

  setAnalytics(data: UserAnalyticsInterface) {
    const { uid, name, email, role } = this.user;
    const { entityId } = data;
    const userData = { ...data, uid, name, email, role };
    this.getUserDocument()
      .collection(this.dbEntities).doc(entityId).set(userData)
      .then(() => {})
      .catch(err => {});
  }

  updateAnalytics(data: UserAnalyticsInterface) {
    const { entityId } = data;
    this.getUserDocument().collection(this.dbEntities).doc(entityId).update(data);
  }

  private getUserDocument() {
    const { uid } = this.user;
    return this.db.collection(this.dbUsers).doc(uid);
  }

  private commonFilter(dbRef: Query): Query {
    const { role, groupId, uid } = this.user;
    let query = dbRef;
    query = query.where('groupId', '==', groupId);
    if (role === 'admin') { return query; }
    return query.where('users', 'array-contains', uid);
  }

  private subjectFilter(dbRef: Query, subjectId: string): Query {
    const { groupId } = this.user;
    return dbRef.where('groupId', '==', groupId).where('subjectId', '==', subjectId);
  }

  private getCurrentUser() {
    this.auth.getCurrentUserStream().subscribe((user: User) => this.user = user);
  }

}
