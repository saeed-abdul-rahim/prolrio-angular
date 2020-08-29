import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { AuthService } from '@core/auth.service';
import { Subscription } from 'rxjs';
import localStorageHelper from '@utils/localStorageHelper';
import { environment } from '@environment';
import { filter } from 'rxjs/operators';
import { User } from '@models/User';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit, OnDestroy {

  innerWidth: number;
  loading = false;
  currentUrl: string;
  routeConfig = { relativeTo: this.route };

  user: User;
  userSubscription: Subscription;
  routerSubscription: Subscription;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => this.currentUrl = event.url);
  }

  ngOnInit(): void {
    this.setRoute();
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    if (this.userSubscription && !this.userSubscription.closed) { this.userSubscription.unsubscribe(); }
    if (this.routerSubscription && !this.routerSubscription.closed) { this.routerSubscription.unsubscribe(); }
  }

  setRoute() {
    this.loading = true;
    this.auth.getUser().then(user$ => {
      if (!user$) {
        this.router.navigate(['auth']);
        return;
      }
      this.userSubscription = user$.subscribe(user => {
        if (!user) {
          this.router.navigate(['auth']);
          return;
        }
        if (!this.user) {
          this.user = user;
        } else {
          return;
        }
        const { token, allClaims } = user;
        const { localStorageKey } = environment;
        const { current } = localStorageHelper.getItem(localStorageKey);
        if (!token) {
          this.router.navigate(['/auth']);
        } else if (current && allClaims) {
          try {
            const claim = allClaims.find(c => c.groupId === window.atob(current));
            if (claim) {
              this.auth.setGroup(claim);
            }
            this.router.navigate(['group'], this.routeConfig);
          } catch (err) {
            this.router.navigate(['group'], this.routeConfig);
          }
        } else {
          this.router.navigate(['group'], this.routeConfig);
        }
        this.loading = false;
      });
    });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
    const urlSplit = this.currentUrl.split('/').filter(e => e);
    if (urlSplit && (urlSplit.length <= 2)) {
      this.router.navigate([''], { replaceUrl: true });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.innerWidth = window.innerWidth;
  }

}
