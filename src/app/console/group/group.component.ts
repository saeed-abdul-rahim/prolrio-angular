import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faUsersCog } from '@fortawesome/free-solid-svg-icons/faUsersCog';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons/faCreditCard';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {

  location = 'console/group';
  routeConfig = { skipLocationChange: true };

  constructor(private consoleNav: ConsoleNavService, private router: Router) {
  }

  ngOnInit(): void {
    const navItems = [
      { text: 'Select Institution', icon: faUsersCog, function: () => this.navSelectGroup() },
      { text: 'Join Institution', icon: faUsers, function: () => this.navJoinGroup() },
      { text: 'Create Institution', icon: faPlus, function: () => this.navCreateGroup() },
      { text: 'Select Tier', icon: faCreditCard, function: () => this.navSelectTier() }
    ];
    this.consoleNav.setNavItems(navItems);
  }

  ngOnDestroy(): void {
  }

  navSelectGroup() {
    this.router.navigateByUrl(this.location, this.routeConfig);
  }

  navJoinGroup() {
    this.router.navigateByUrl(`${this.location}/join`, this.routeConfig);
  }

  navCreateGroup() {
    this.router.navigateByUrl(`${this.location}/create`, this.routeConfig);
  }

  navSelectTier() {
    this.router.navigateByUrl(`${this.location}/tier`, this.routeConfig);
  }

}
