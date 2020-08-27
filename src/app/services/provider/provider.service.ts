import { Injectable } from '@angular/core';
import { AngularFirestore, Query, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Request } from '@utils/request';
import { environment } from '@environment';
import { EntityInterface } from '@models/Entity';
import { AuthService } from '@core/auth.service';
import { User, UserAnalyticsInterface, UserInterface } from '@models/User';
import { Role, Status } from '@models/Common';
import { Observable, combineLatest } from 'rxjs';
import { getDataFromDocument } from '@utils/getFirestoreData';
import { UsageRole } from '@models/Usage';

@Injectable()
export class ProviderService {

  user: User;

  apiEntity: string;

  private db: AngularFirestoreDocument;

  dbUsers: string;
  dbAnalytics: string;
  dbUserAnalytics: string;

  constructor(private req: Request, private afs: AngularFirestore, private auth: AuthService) {
    const { api, db } = environment;
    const { userAnalytics, analytics, users, name, version } = db;
    const { url, _entity } = api;
    this.db = this.afs.collection(version).doc(name);
    this.apiEntity = url + _entity;
    this.dbUsers = users;
    this.dbAnalytics = analytics;
    this.dbUserAnalytics = userAnalytics;
    this.getCurrentUser();
  }

  async createEntity(entity: EntityInterface) {
    try {
      return await this.req.post(this.apiEntity, entity);
    } catch (err) {
      throw err;
    }
  }

  async sendEntityMessage(id: string, uid: string) {
    try {
      return await this.req.post(`${this.apiEntity}/${id}/message`, { uid });
    } catch (err) {
      throw err;
    }
  }

  async removeEntity(id: string) {
    try {
      return await this.req.delete(`${this.apiEntity}/${id}`);
    } catch (err) {
      throw err;
    }
  }

  async updateEntity(entityId: string, title: string, description: string) {
    try {
      return await this.req.patch(`${this.apiEntity}/${entityId}`, { title, description });
    } catch (err) {
      throw err;
    }
  }

  async updateEntities(entities: EntityInterface[]) {
    try {
      return await this.req.patch(`${this.apiEntity}/all`, { entities });
    } catch (err) {
      throw err;
    }
  }

  getUsageAnalytics(id: string) {
    return this.db.collection(this.dbAnalytics).doc<UsageRole>(id).valueChanges();
  }

  getAnalytics(id: string, type: 'groupId' | 'sectionIds' | 'subjectId' | 'entityId', role: Role, status: Status = 'active') {
    if (type === 'groupId') {
      return this.afs.collectionGroup<UserAnalyticsInterface>(this.dbUserAnalytics, ref =>
        this.commonFilter(ref, role, status)
      ).valueChanges();
    } else if (type !== 'sectionIds') {
      return this.afs.collectionGroup<UserAnalyticsInterface>(this.dbUserAnalytics, ref =>
        this.commonFilter(ref, role, status).where(type, '==', id)
      ).valueChanges();
    } else {
      return this.afs.collectionGroup<UserAnalyticsInterface>(this.dbUserAnalytics, ref =>
        this.commonFilter(ref, role, status).where(type, 'array-contains', id)
      ).valueChanges();
    }
  }

  getUsersData(allUserIds: string[]): Observable<UserInterface[]> {
    const queries = allUserIds.map(uid => {
      const userData = this.db.collection<UserInterface>(this.dbUsers).doc(uid);
      return getDataFromDocument(userData) as Observable<UserInterface>;
    });
    return combineLatest(queries);
  }

  private commonFilter(dbRef: Query, role: Role, status?: Status): Query {
    const { groupId } = this.user;
    let query = dbRef;
    query = query
      .where('groupId', '==', groupId)
      .where('role', '==', role);
    if (status === 'active') {
      query.where('status', '==', status);
    }
    return query;
  }

  private getCurrentUser() {
    this.auth.getCurrentUserStream().subscribe((user: User) => this.user = user);
  }

}
