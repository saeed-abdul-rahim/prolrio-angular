import { Injectable } from '@angular/core';
import { Request } from '@utils/request';
import { Observable, combineLatest, BehaviorSubject, Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Role } from '@models/Common';
import { UserInterface, User } from '@models/User';
import { environment } from '@environment';
import { AuthService } from '@core/auth.service';
import { SectionInterface } from '@models/Section';
import { SubjectInterface } from '@models/Subject';
import { getDataFromDocument, getDataFromCollection } from '@utils/getFirestoreData';

@Injectable()
export class AdminService {

  private user: User;

  private apiUser: string;
  private apiGroup: string;
  private apiSection: string;
  private apiSubject: string;
  private apiGroupRequest: string;

  private dbUsers: string;

  private db: AngularFirestoreDocument;

  private allUsers: BehaviorSubject<UserInterface[]> = new BehaviorSubject<UserInterface[]> (null);

  users$: Observable<UserInterface[]>;
  allUsers$ = this.allUsers.asObservable();
  userRequests$: Observable<UserInterface[]>;

  allUsersSubscription: Subscription;

  constructor(private req: Request, private afs: AngularFirestore, private auth: AuthService) {
    this.getCurrentUser();
    const { db, api } = environment;
    const { url, _user, _group, _section, _subject, _request } = api;
    const { version, name, users } = db;
    this.dbUsers = users;
    this.apiUser = url + _user;
    this.apiGroup = url + _group;
    this.apiSection = url + _section;
    this.apiSubject = url + _subject;
    this.apiGroupRequest = this.apiGroup + _request;
    this.db = this.afs.collection(version).doc(name);
  }

  onDestroy() {
    if (this.allUsersSubscription && !this.allUsersSubscription.closed) {
      this.allUsersSubscription.unsubscribe();
      this.allUsers.next(null);
    }
  }

  async createSection(sectionName: string, sectionId: string) {
    try {
      return await this.req.post(this.apiSection, { sectionName, sectionId });
    } catch (err) {
      throw err;
    }
  }

  async createSubject(subjectName: string, sectionId: string) {
    try {
      return await this.req.post(this.apiSubject, { subjectName, sectionId });
    } catch (err) {
      throw err;
    }
  }

  async createUser(emailPhone: string, role: Role, type: 'email' | 'phone') {
    try {
      const data = {
        role,
        email: type === 'email' ? emailPhone : undefined,
        phone: type === 'phone' ? emailPhone : undefined
      };
      console.log(data);
      return await this.req.post(`${this.apiUser}`, data);
    } catch (err) {
      throw err;
    }
  }

  async updateRole(uid: string, role: Role) {
    try {
      return await this.req.patch(`${this.apiUser}/role`, { uid, role });
    } catch (err) {
      throw err;
    }
  }

  async updateSectionName(sectionId: string, name: string) {
    try {
      return await this.req.patch(`${this.apiSection}/name`, { sectionId, name });
    } catch (err) {
      throw err;
    }
  }

  async updateSubjectName(subjectId: string, name: string) {
    try {
      return await this.req.patch(`${this.apiSubject}/name`, { subjectId, name });
    } catch (err) {
      throw err;
    }
  }

  async removeSection(sectionId: string) {
    try {
      return await this.req.delete(`${this.apiSection}/${sectionId}`);
    } catch (err) {
      throw err;
    }
  }

  async removeSubject(subjectId: string) {
    try {
      return await this.req.delete(`${this.apiSubject}/${subjectId}`);
    } catch (err) {
      throw err;
    }
  }

  async addUserToSection(sectionId: string, uid: string) {
    try {
      return await this.req.post(`${this.apiSection}/user`, { sectionId, uid });
    } catch (err) {
      throw err;
    }
  }

  async addUserToSubject(subjectId: string, uid: string) {
    try {
      return await this.req.post(`${this.apiSubject}/user`, { subjectId, uid });
    } catch (err) {
      throw err;
    }
  }

  async removeUserFromSection(sectionId: string, uid: string) {
    try {
      return await this.req.delete(`${this.apiSection}/${sectionId}/user/${uid}`);
    } catch (err) {
      throw err;
    }
  }

  async removeUserFromSubject(subjectId: string, uid: string) {
    try {
      return await this.req.delete(`${this.apiSubject}/${subjectId}/user/${uid}`);
    } catch (err) {
      throw err;
    }
  }

  async acceptRequest(uid: string, role: string) {
    try {
      return await this.req.patch(`${this.apiGroupRequest}`, { uid, role });
    } catch (err) {
      throw err;
    }
  }

  async cancelRequest(uid: string) {
    try {
      return await this.req.delete(`${this.apiGroupRequest}/${uid}`);
    } catch (err) {
      throw err;
    }
  }

  getAllUsers(): Observable<UserInterface[]> {
    return this.allUsers$;
  }

  getUsersByRequests(): Observable<UserInterface[]> {
    const users = this.getUsersDataFromGroup('requests');
    this.userRequests$ = getDataFromCollection(users);
    return this.userRequests$;
  }

  getUsersByGroup() {
    const usersQuery = this.getUsersDataFromGroup('groupId');
    this.allUsersSubscription = getDataFromCollection(usersQuery).subscribe(users => this.allUsers.next(users));
  }

  getUsersBySection(section: SectionInterface): Observable<UserInterface[]> {
    const allUserIds = this.usersFromInterface(section);
    return this.getUsersData(allUserIds);
  }

  getUsersBySubject(subject: SubjectInterface): Observable<UserInterface[]> {
    const allUserIds =  this.usersFromInterface(subject);
    return this.getUsersData(allUserIds);
  }

  getUsersData(allUserIds: string[]): Observable<UserInterface[]> {
    const queries = allUserIds.map(uid => {
      const userData = this.db.collection<UserInterface>(this.dbUsers).doc(uid);
      return getDataFromDocument(userData) as Observable<UserInterface>;
    });
    this.users$ = combineLatest(queries);
    return this.users$;
  }

  getUsersDataFromGroup(where: string): AngularFirestoreCollection<UserInterface> {
    const { groupId } = this.user;
    const users = this.db.collection<UserInterface>(this.dbUsers, ref => ref.where(where, 'array-contains', groupId));
    return users;
  }

  private usersFromInterface(int: SectionInterface | SubjectInterface) {
    return [...new Set([...int.admin, ...int.provider, ...int.learner])];
  }

  private getCurrentUser() {
    this.auth.getCurrentUserStream().subscribe((user: User) => this.user = user);
  }

}
