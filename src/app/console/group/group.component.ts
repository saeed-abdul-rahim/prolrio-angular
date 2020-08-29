import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faUniversity } from '@fortawesome/free-solid-svg-icons/faUniversity';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons/faCreditCard';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {

  location = 'console/group';

  navItems = [
    { text: 'Profile', icon: faUser, function: () => this.navProfile() },
    { text: 'Institution', icon: faUniversity, function: () => this.navSelectGroup() },
    { text: 'Create Institution', icon: faPlus, function: () => this.navCreateGroup() }
  ];

  navBill = { text: 'Billing', icon: faCreditCard, function: () => this.navSelectTier() };

  userSubscription: Subscription;

  constructor(private consoleNav: ConsoleNavService, private router: Router, private auth: AuthService) {
    this.userSubscription = this.auth.getCurrentUserStream().subscribe(user => {
      if (user) {
        if (user.allClaims) {
          const { allClaims } = user;
          const groupCreator = allClaims.filter(claims => claims.sudo === true);
          const currNavItems = this.navItems.map(nav => nav.text);
          if (groupCreator.length > 0 && !currNavItems.includes('Billing')) {
            this.navItems.push(this.navBill);
            this.consoleNav.setNavItems(this.navItems);
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.consoleNav.setNavItems(this.navItems);
  }

  ngOnDestroy(): void {
    if (this.userSubscription && !this.userSubscription.closed) {
      this.userSubscription.unsubscribe();
    }
  }

  navProfile() {
    this.router.navigateByUrl(`${this.location}/profile`);
  }

  navSelectGroup() {
    this.router.navigateByUrl(this.location);
  }

  navCreateGroup() {
    this.router.navigateByUrl(`${this.location}/create`);
  }

  navSelectTier() {
    this.router.navigateByUrl(`${this.location}/tier`);
  }

}
