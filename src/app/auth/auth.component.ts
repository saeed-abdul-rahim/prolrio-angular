import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@core/auth.service';
import { User } from '@models/User';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  location = 'auth';
  loading = false;

  user: User;
  userSubscription: Subscription;
  paramSubscription: Subscription;
  routerConfig = { relativeTo: this.route };

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.paramSubscription = this.route.queryParams.subscribe(params => {
      const { mode, oobCode } = params;
      if (!mode || !oobCode) {
        this.getUser();
      }
    });
  }

  ngOnDestroy(): void {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  async getUser() {
    try {
      this.loading = true;
      await this.auth.isAuthenticated();
      this.userSubscription = this.auth.getCurrentUserStream().subscribe(async user => {
        this.user = user;
        if (user) {
          try {
            const { email } = user;
            const signInEmail = await this.auth.fetchEmail(email);
            if (signInEmail.includes('password')) {
              const loggedIn = await this.auth.isLoggedIn();
              if (loggedIn) {
                this.router.navigate(['console']);
              } else {
                this.router.navigate([this.location], this.routerConfig);
              }
            }
            else if (signInEmail.includes('emailLink')) {
              this.router.navigateByUrl(`${this.location}/set-password?mode=signIn`);
            } else {
              this.router.navigate(['console']);
            }
          } catch (err) {
            this.openSnackBar(err);
            this.router.navigate(['sign-in'], this.routerConfig);
          }
        } else {
          this.router.navigate(['sign-in'], this.routerConfig);
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.router.navigate(['sign-in'], this.routerConfig);
      });
    } catch (err) {
      this.loading = false;
      this.router.navigate(['sign-in'], this.routerConfig);
    }
  }

  signOut() {
    this.auth.signOut();
  }

}
