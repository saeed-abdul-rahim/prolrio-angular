import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import { filter } from 'rxjs/operators';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons/faFileUpload';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { AddEntityComponent } from '../components/add-entity/add-entity.component';
import { ConsoleNav } from '@services/console-nav/ConsoleNav';
import { Subscription } from 'rxjs';
import { CommonService } from '@services/common/common.service';
import { MetadataInterface } from '@models/Metadata';
import { faChartPie } from '@fortawesome/free-solid-svg-icons/faChartPie';
import { AnalyticsComponent } from '../components/analytics/analytics.component';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit, OnDestroy {

  metadata: MetadataInterface;
  navItems: ConsoleNav[];
  navigation: string[];
  subjectId: string;
  entityId: string;

  routerSubscription: Subscription;
  metadataSubscription: Subscription;

  navHome = { text: 'Home', icon: faHome, function: () => this.navigateHome() };
  navAddEntity = { text: 'Add Content', icon: faFileUpload, function: () => this.entityCreateDialog(this.subjectId) };
  navSettings = { text: 'Settings', icon: faCog, function: () => this.settings() };
  navAnalytics = { text: 'Analytics', icon: faChartPie, function: () => this.showAnalytics() };

  constructor(private router: Router, private consoleNav: ConsoleNavService, private matDialog: MatDialog, private common: CommonService) {
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
        else { this.switchNavItems(['provider']); }
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.routerSubscription && !this.routerSubscription.closed) { this.routerSubscription.unsubscribe(); }
    if (this.metadataSubscription && !this.metadataSubscription.closed) { this.metadataSubscription.unsubscribe(); }
    this.common.onDestroy();
  }

  settings() {
    this.consoleNav.resetUrl();
    this.router.navigateByUrl('console/group', { skipLocationChange: true });
  }

  switchNavItems(urlSplit: string[]) {
    this.setDefaultNavItems();
    const id = urlSplit[urlSplit.length - 1]; // If Home -> value: provider
    this.subjectId = '';
    this.entityId = '';
    if (urlSplit.includes('entity')) {
      this.entityId = id;
      this.navItemsWhenInEntity();
    } else if (urlSplit.includes('subject')) {
      this.subjectId = id;
      this.navItemsWhenInSubject();
    } else {
      this.setDefaultNavItems();
    }
  }

  navigateHome() {
    const url = 'console/provider';
    this.consoleNav.setUrl([{ label: 'Home', url }]);
    this.router.navigateByUrl(url, { skipLocationChange: true });
  }

  setDefaultNavItems() {
    this.navItems = [ this.navHome, this.navSettings ];
    this.consoleNav.setNavItems(this.navItems);
  }

  navItemsWhenInEntity() {
    this.navItems.splice(1, 0, this.navAnalytics);
    this.consoleNav.setNavItems(this.navItems);
  }

  navItemsWhenInSubject() {
    this.navItems.splice(1, 0, this.navAddEntity);
    this.consoleNav.setNavItems(this.navItems);
  }

  showAnalytics() {
    const config = this.createDivisionDialog();
    this.matDialog.open(AnalyticsComponent, config);
  }

  entityCreateDialog(subjectId: string) {
    const dialogConfig = this.createDialog();
    dialogConfig.data = { subjectId };
    this.matDialog.open(AddEntityComponent, dialogConfig);
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
    const { subjectId, entityId } = this;
    const dialogConfig = this.createDialog();
    const config = {
      ...dialogConfig,
      data: { subjectId, entityId },
      width: '100%',
      panelClass: 'full-screen-modal',
    };
    return config;
  }

}
