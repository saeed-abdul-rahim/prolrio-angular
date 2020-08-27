import { Component, OnInit, OnDestroy } from '@angular/core';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { Router } from '@angular/router';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import { ConsoleNav } from '@services/console-nav/ConsoleNav';
import { Subscription } from 'rxjs/internal/Subscription';
import { MetadataInterface } from '@models/Metadata';
import { CommonService } from '@services/common/common.service';

@Component({
  selector: 'app-learner',
  templateUrl: './learner.component.html',
  styleUrls: ['./learner.component.scss']
})
export class LearnerComponent implements OnInit, OnDestroy {

  location = 'console/learner';

  metadata: MetadataInterface;
  navItems: ConsoleNav[];

  navHome = { text: 'Home', icon: faHome, function: () => this.navigateHome() };
  navSection = { text: 'All Content', icon: faBook, function: () => this.navigateSection() };
  navSettings = { text: 'Settings', icon: faCog, function: () => this.settings() };

  metadataSubscription: Subscription;

  constructor(private router: Router, private consoleNav: ConsoleNavService, private common: CommonService) {
    this.setDefaultNavItems();
    this.metadataSubscription = this.common.getMetadata().subscribe(data => {
      this.metadata = data;
      this.setDefaultNavItems();
      if (this.metadata && this.metadata.subscriptionStatus === 'active') {
        this.navItems.splice(1, 0, this.navSection);
      }
      this.consoleNav.setNavItems(this.navItems);
    });
    if (this.router.url === `/${this.location}`) { this.consoleNav.resetUrl(); }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.metadataSubscription && !this.metadataSubscription.closed) { this.metadataSubscription.unsubscribe(); }
    this.common.onDestroy();
  }

  settings() {
    this.consoleNav.resetUrl();
    this.router.navigateByUrl('console/group', { skipLocationChange: true });
  }

  setDefaultNavItems() {
    this.navItems = [ this.navHome, this.navSettings ];
  }

  navigateHome() {
    const url = this.location;
    this.consoleNav.resetUrl();
    this.router.navigateByUrl(url, { skipLocationChange: true });
  }

  navigateSection() {
    const url = `${this.location}/section/`;
    this.consoleNav.setUrl([{ label: 'Home', url }]);
    this.router.navigateByUrl(url, { skipLocationChange: true });
  }

}
