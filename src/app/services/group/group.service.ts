import { Injectable } from '@angular/core';
import {
  AngularFirestoreDocument,
  AngularFirestore
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';

import { environment } from '@environment';
import { AuthService } from '@core/auth.service';
import { Request } from '@utils/request';
import { User, UserInterface } from '@models/User';
import { getDataFromDocument } from '@utils/getFirestoreData';
import { MetadataInterface } from '@models/Metadata';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private dbMetadata: string;

  private db: AngularFirestoreDocument;
  private user: AngularFirestoreDocument;

  private currentUser: User;
  private apiGroup: string;
  private apiUser: string;
  private apiPayment: string;
  private apiSubscription: string;
  private apiUserRequest: string;

  private cards: BehaviorSubject<any[]> = new BehaviorSubject<any[]> (null);
  private cards$ = this.cards.asObservable();

  constructor(private req: Request, private afs: AngularFirestore, private auth: AuthService) {
    const { uid } = this.getCurrentUser();
    const { db, api } = environment;
    const { url, _group, _user, _request, _payment, _subscription } = api;
    const { version, name, users, metadata } = db;
    this.apiGroup = url + _group;
    this.apiUser = url + _user;
    this.apiPayment = this.apiUser + _payment;
    this.apiSubscription = this.apiUser + _subscription;
    this.apiUserRequest = this.apiUser + _request;
    this.db = this.afs.collection(version).doc(name);
    this.user = this.db.collection(users).doc(uid);
    this.dbMetadata = metadata;
  }

  async create(groupId: string, groupName: string) {
    try {
      await this.req.post(this.apiGroup, { groupId, groupName });
    } catch (err) {
      throw err;
    }
  }

  async remove(groupId: string) {
    try {
      await this.req.delete(`${this.apiGroup}/${groupId}`);
    } catch (err) {
      throw err;
    }
  }

  async removeUserFromGroup(groupId: string, uid: string) {
    try {
      return await this.req.delete(`${this.apiGroup}/${groupId}/user/${uid}`);
    } catch (err) {
      throw err;
    }
  }

  async request(groupId: string) {
    try {
      await this.req.post(this.apiUserRequest, { groupId });
    } catch (err) {
      throw err;
    }
  }

  async acceptRequest(groupId: string) {
    try {
      await this.req.patch(this.apiUserRequest, { groupId });
    } catch (err) {
      throw err;
    }
  }

  async cancelRequest(groupId: string) {
    try {
      await this.req.delete(`${this.apiUserRequest}/${groupId}`);
    } catch (err) {
      throw err;
    }
  }

  getRequests(): Observable<string[]> {
    return this.user.valueChanges().pipe(map(user => user.requests));
  }

  getGroups(groupIds: string[]) {
    const queries = groupIds.map(id => {
      const userData = this.db.collection(this.dbMetadata).doc<MetadataInterface>(id);
      return getDataFromDocument(userData) as Observable<MetadataInterface>;
    });
    return combineLatest(queries);
  }

  getCardsStream(): Observable<any[]> {
    return this.cards$;
  }


  async updateUser(user: UserInterface) {
    const { uid } = this.currentUser;
    try {
      await this.req.patch(`${this.apiUser}/${uid}`, user);
    } catch (err) {
      throw err;
    }
  }

  async createPaymentIntent() {
    try {
      return await this.req.post(`${this.apiPayment}/intent`, {});
    } catch (err) {
      throw err;
    }
  }

  async getInvoice() {
    try {
      return await this.req.get(`${this.apiUser}/invoice`);
    } catch (err) {
      throw err;
    }
  }

  async getCards() {
    try {
      const { data } = await this.req.get(this.apiPayment);
      this.cards.next(data);
    } catch (err) {
      throw err;
    }
  }

  async addCard(token: string) {
    try {
      return await this.req.post(this.apiPayment, { token });
    } catch (err) {
      throw err;
    }
  }

  async removeCard(sourceId: string) {
    try {
      return await this.req.delete(`${this.apiPayment}/${sourceId}`);
    } catch (err) {
      throw err;
    }
  }

  async createSubscription(tierId: string) {
    try {
      return await this.req.post(this.apiSubscription, { tierId });
    } catch (err) {
      throw err;
    }
  }

  async cancelSubscription() {
    try {
      return await this.req.delete(this.apiSubscription);
    } catch (err) {
      throw err;
    }
  }

  private getCurrentUser() {
    this.auth.getCurrentUserStream().subscribe((user: User) => this.currentUser = user);
    return this.currentUser;
  }

}
