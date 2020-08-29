import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
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

  constructor(private consoleNav: ConsoleNavService, private router: Router) {
  }

  ngOnInit(): void {
    const navItems = [
      { text: 'Profile', icon: faUser, function: () => this.navProfile() },
      { text: 'Select Institution', icon: faUsersCog, function: () => this.navSelectGroup() },
      { text: 'Join Institution', icon: faUsers, function: () => this.navJoinGroup() },
      { text: 'Create Institution', icon: faPlus, function: () => this.navCreateGroup() },
      { text: 'Select Tier', icon: faCreditCard, function: () => this.navSelectTier() }
    ];
    this.consoleNav.setNavItems(navItems);
  }

  ngOnDestroy(): void {
  }

  navProfile() {
    this.router.navigateByUrl(`${this.location}/profile`);
  }

  navSelectGroup() {
    this.router.navigateByUrl(this.location);
  }

  navJoinGroup() {
    this.router.navigateByUrl(`${this.location}/join`);
  }

  navCreateGroup() {
    this.router.navigateByUrl(`${this.location}/create`);
  }

  navSelectTier() {
    this.router.navigateByUrl(`${this.location}/tier`);
  }

}
