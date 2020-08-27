import { Component, OnInit, OnDestroy, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Subscription } from 'rxjs';
import { faCheck, faSearch } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '@core/auth.service';
import { User, UserInterface, DisplayRole } from '@models/User';
import { CommonService } from '@services/common/common.service';
import { SectionInterface } from '@models/Section';
import { AdminService } from '@services/admin/admin.service';
import snackBarSettings from '@settings/snackBar';
import { UpdateRoleComponent } from '../update-role/update-role.component';
import { RemoveUserComponent } from '../remove-user/remove-user.component';
import { SubjectInterface } from '@models/Subject';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  faCheck = faCheck;
  faSearch = faSearch;

  sectionSubscription: Subscription;
  subjectSubscription: Subscription;
  sectionUsersSubscription: Subscription;
  subjectUsersSubscription: Subscription;
  userSubscription: Subscription;
  allUsersSubscription: Subscription;

  user: User;
  allUsers: UserInterface[];
  users: UserInterface[];
  groupId: string;
  sectionId: string;
  section: SectionInterface;
  subjectId: string;
  subject: SubjectInterface;

  displayedColumns: string[] = ['User Details'];
  tableData: MatTableDataSource<any>;

  level: 'admin' | 'division';
  loading = false;
  selectedIndex: number;

  sectionData: SectionInterface;
  addToDivision = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private auth: AuthService, private commonService: CommonService, private admin: AdminService, private snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<UserComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private matDialog: MatDialog,
              private cdr: ChangeDetectorRef, private analytics: AngularFireAnalytics) {
    const { sectionId, subjectId } = data;
    this.sectionId = sectionId;
    this.subjectId = subjectId;
    this.userSubscription = this.auth.getCurrentUserStream().subscribe(user => this.user = user);
    this.groupId = this.user.groupId;
  }

  ngOnInit(): void {
    this.getUsersByGroup();
    if (this.subjectId || this.sectionId !== 'admin') {
      this.level = 'division';
      this.selectedIndex = 1;
    }
    else { this.level = 'admin'; }
    if (this.subjectId) {
      this.commonService.getCurrentSubject().subscribe(subject => {
        if (!subject) {
          this.commonService.setCurrentSubject(this.subjectId);
        } else {
          this.subject = subject;
          this.unsubscribeSubjectUsers();
          this.getUsersBySubject();
        }
      });
    } else if (this.sectionId !== 'admin') {
      this.sectionSubscription = this.commonService.getSection(this.sectionId).subscribe(section => {
        this.section = section;
        this.unsubscribeSectionUsers();
        this.getUsersBySection();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription && !this.userSubscription.closed) { this.userSubscription.unsubscribe(); }
    if (this.allUsersSubscription && !this.allUsersSubscription.closed) { this.allUsersSubscription.unsubscribe(); }
    if (this.sectionSubscription && !this.sectionSubscription.closed) { this.sectionSubscription.unsubscribe(); }
    if (this.subjectSubscription && !this.subjectSubscription.closed) { this.subjectSubscription.unsubscribe(); }
    this.unsubscribeSectionUsers();
    this.unsubscribeSubjectUsers();
  }

  unsubscribeSectionUsers() {
    if (this.sectionUsersSubscription && !this.sectionUsersSubscription.closed) { this.sectionUsersSubscription.unsubscribe(); }
  }

  unsubscribeSubjectUsers() {
    if (this.subjectUsersSubscription && !this.subjectUsersSubscription.closed) { this.subjectUsersSubscription.unsubscribe(); }
  }

  close() {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  getUsersByGroup() {
    this.allUsersSubscription = this.admin.getAllUsers().subscribe(users => {
      this.allUsers = users;
      this.fillTable(this.allUsers);
    },
    err => this.openSnackBar(err));
  }

  getUsersBySection() {
    this.sectionUsersSubscription = this.admin.getUsersBySection(this.section).subscribe(users => {
      this.users = users;
      this.fillTable(this.users);
    },
    err => this.openSnackBar(err));
  }

  getUsersBySubject() {
    try {
      this.subjectUsersSubscription = this.admin.getUsersBySubject(this.subject).subscribe(users => {
        this.users = users;
        this.fillTable(this.users);
      });
    } catch (err) {
      this.openSnackBar('Unable to get data');
    }
  }

  fillTable(users: UserInterface[]) {
    try {
      const allUsers = users.map(user => {
        let role: DisplayRole;
        if (user.admin.includes(this.groupId)) { role = 'Admin'; }
        else if (user.provider.includes(this.groupId)) { role = 'Teacher'; }
        else if (user.learner.includes(this.groupId)) { role = 'Student'; }
        return { ...user, role };
      });
      this.tableData = new MatTableDataSource(allUsers);
      this.cdr.detectChanges();
      this.tableData.paginator = this.paginator;
    } catch (err) {
      this.openSnackBar('Unable to get users');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
    if (this.tableData.paginator) {
      this.tableData.paginator.firstPage();
    }
  }

  removeUserModal(id: string, user: string, name: string) {
    const dialogConfig = this.createDialog();
    dialogConfig.data = {
      id,
      user,
      name,
      groupId: this.groupId,
      sectionId: this.sectionId,
      subjectId: this.subjectId };
    this.matDialog.open(RemoveUserComponent, dialogConfig).afterClosed().subscribe(success => {
      if (success) {
        this.fillTable(this.users);
      }
    });
  }

  updateRoleModal(id: string) {
    const dialogConfig = this.createDialog();
    dialogConfig.data = { id };
    this.matDialog.open(UpdateRoleComponent, dialogConfig);
  }

  addToDivisionToggle() {
    this.addToDivision = !this.addToDivision;
    if (this.addToDivision) { this.fillTable(this.allUsers); }
    else { this.fillTable(this.users); }
  }

  async addUserToSection(uid: string) {
    if (this.sectionId === 'admin') { return; }
    this.setAllUsersLoading(uid, true);
    try {
      const response = await this.admin.addUserToSection(this.sectionId, uid);
      this.analytics.logEvent('user', { add: true, section: true });
      this.openSnackBar(response);
      this.addToDivisionToggle();
    } catch (err) {
      if (err) { this.openSnackBar(err); }
      else { this.openSnackBar('Unable to add user in section'); }
    }
    this.setAllUsersLoading(uid, false);
  }

  async addUserToSubject(uid: string) {
    if (!this.subjectId) { return; }
    this.setAllUsersLoading(uid, true);
    try {
      const response = await this.admin.addUserToSubject(this.subjectId, uid);
      this.analytics.logEvent('user', { add: true, subject: true });
      this.openSnackBar(response);
      this.addToDivisionToggle();
    } catch (err) {
      if (err) { this.openSnackBar(err); }
      else { this.openSnackBar('Unable to add user in subject'); }
    }
    this.setAllUsersLoading(uid, false);
  }

  addUserToDivision(uid: string) {
    this.fillTable(this.allUsers);
    if (this.subjectId) {
      this.addUserToSubject(uid);
    } else {
      this.addUserToSection(uid);
    }
  }

  setAllUsersLoading(uid: string, loading: boolean) {
    this.tableData.data.find(user => user.uid === uid && ( user.loading = loading, true ));
  }

  createDialog() {
    const dialogConfig = new MatDialogConfig();
    const config = {
      ...dialogConfig,
      closeOnNavigation: true
    };
    return config;
  }

}
