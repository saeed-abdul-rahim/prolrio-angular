import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons/faFileUpload';
import { faUsersCog } from '@fortawesome/free-solid-svg-icons/faUsersCog';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faChartPie } from '@fortawesome/free-solid-svg-icons/faChartPie';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons/faMoneyBillWave';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AddEntityComponent } from '../components/add-entity/add-entity.component';

import { UserComponent } from './components/user/user.component';
import { AddDivisionComponent } from './components/add-division/add-division.component';
import { ConsoleNav } from '@services/console-nav/ConsoleNav';
import { CommonService } from '@services/common/common.service';
import { MetadataInterface } from '@models/Metadata';
import { AuthService } from '@core/auth.service';
import { AdminService } from '@services/admin/admin.service';
import { AnalyticsComponent } from '../components/analytics/analytics.component';
import { EarningsComponent } from './components/earnings/earnings.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  metadata: MetadataInterface;
  navItems: ConsoleNav[];
  navigation: string[];
  previousUrl: string;
  loader = false;

  groupId: string;
  sectionId: string;
  subjectId: string;
  entityId: string;


  userSubscription: Subscription;
  routerSubscription: Subscription;
  metadataSubscription: Subscription;

  navHome = { text: 'Home', icon: faHome, function: () => this.navigateHome() };
  navManageUsers = { text: 'Manage Users', icon: faUsersCog, function: () => this.showManageUsers() };
  navAddSubject = { text: 'Create', icon: faBook, function: () => this.divisionCreateDialog('subject') };
  navAddEntity = { text: 'Add Content', icon: faFileUpload, function: () => this.entityCreateDialog(this.subjectId) };
  navSettings = { text: 'Settings', icon: faCog, function: () => this.settings() };
  navAnalytics = { text: 'Analytics', icon: faChartPie, function: () => this.showAnalytics() };
  navEarnings = { text: 'Earnings', icon: faMoneyBillWave, function: () => this.earningsDialog() };

  constructor(private router: Router, private consoleNav: ConsoleNavService, private matDialog: MatDialog,
              private common: CommonService, private auth: AuthService, private admin: AdminService) {
    this.userSubscription = this.auth.getCurrentUserStream().subscribe(user => {
      if (user) {
        if (user.groupId !== this.groupId) {
          this.admin.getUsersByGroup();
        }
      }
    });
    this.setDefaultNavItems();
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.navigation = event.url.split('/');
      this.switchNavItems(this.navigation);
    });
    this.metadataSubscription = this.common.getMetadata().subscribe(data => {
      this.metadata = data;
      if (this.metadata && this.metadata.subscriptionStatus !== 'active') {
        this.setDefaultNavItems();
        this.consoleNav.setNavItems(this.navItems);
      } else {
        if (this.navigation) { this.switchNavItems(this.navigation); }
        else { this.switchNavItems(['admin']); }
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.userSubscription && !this.userSubscription.closed) { this.userSubscription.unsubscribe(); }
    if (this.routerSubscription && !this.routerSubscription.closed) { this.routerSubscription.unsubscribe(); }
    if (this.metadataSubscription && !this.metadataSubscription.closed) { this.metadataSubscription.unsubscribe(); }
    this.admin.onDestroy();
    this.common.onDestroy();
  }

  switchNavItems(urlSplit: string[]) {
    this.setDefaultNavItems();
    const id = urlSplit[urlSplit.length - 1]; // If Home -> value: admin
    this.sectionId = '';
    this.subjectId = '';
    this.entityId = '';
    if (urlSplit.includes('entity')) {
      this.entityId = id;
      this.navItemsWhenInEntity();
    } else if (urlSplit.includes('subject')) {
      this.subjectId = id;
      this.navItemsWhenInSubject();
    } else {
      this.sectionId = id;
      this.navItemsWhenInSection();
    }
  }

  renew() {
    this.router.navigateByUrl('/console/group/tier');
  }

  settings() {
    this.consoleNav.resetUrl();
    this.router.navigateByUrl('console/group');
  }

  navigateHome() {
    const url = 'console/admin';
    this.consoleNav.setUrl([{ label: 'Home', url }]);
    this.router.navigateByUrl(url);
  }

  showManageUsers() {
    const config = this.createDivisionDialog();
    this.matDialog.open(UserComponent, config);
  }

  showAnalytics() {
    const config = this.createDivisionDialog();
    this.matDialog.open(AnalyticsComponent, config);
  }

  divisionCreateDialog(type: 'course' | 'subject') {
    const dialogConfig = this.createDialog();
    const id = this.sectionId === 'admin' ? '' : this.sectionId;
    dialogConfig.data = { id, type };
    this.matDialog.open(AddDivisionComponent, dialogConfig);
  }

  entityCreateDialog(subjectId: string) {
    const dialogConfig = this.createDialog();
    dialogConfig.data = { subjectId };
    this.matDialog.open(AddEntityComponent, dialogConfig);
  }

  earningsDialog() {
    this.matDialog.open(EarningsComponent);
  }

  setDefaultNavItems() {
    this.navItems = [ this.navHome, this.navEarnings, this.navSettings ];
  }

  navItemsWhenInEntity() {
    this.navItems.splice(1, 0, this.navAnalytics);
    this.consoleNav.setNavItems(this.navItems);
  }

  navItemsWhenInSubject() {
    this.navItems.splice(1, 0, this.navAddEntity, this.navManageUsers);
    this.consoleNav.setNavItems(this.navItems);
  }

  navItemsWhenInSection() {
    this.navItems.splice(1, 0, this.navAddSubject, this.navManageUsers);
    this.consoleNav.setNavItems(this.navItems);
  }

  createDialog() {
    const dialogConfig = new MatDialogConfig();
    const config = {
      ...dialogConfig,
      disableClose: true,
      closeOnNavigation: true
    };
    return config;
  }

  createDivisionDialog() {
    const { sectionId, subjectId, entityId } = this;
    const dialogConfig = this.createDialog();
    const config = {
      ...dialogConfig,
      data: { sectionId, subjectId, entityId },
      width: '100%',
      panelClass: 'full-screen-modal',
    };
    return config;
  }

}
