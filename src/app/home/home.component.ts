import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '@core/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import snackBarSettings from '@settings/snackBar';
import { ThemeService } from '@services/theme/theme.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { environment } from '@environment';
import localStorageHelper from '@utils/localStorageHelper';
import { User } from '@models/User';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  user: User;
  userSubscription: Subscription;

  faSun = faSun;
  faMoon = faMoon;
  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;

  logoText: string;
  themeIcon: IconDefinition;
  themeLogo: string;
  themeType: 'light' | 'dark';
  burger = false;
  navbarTransparent = true;

  constructor(private theme: ThemeService, private snackBar: MatSnackBar, private auth: AuthService, private router: Router) {
    const { localStorageKey, name } = environment;
    const localData = localStorageHelper.getItem(localStorageKey);
    this.logoText = name;
    if (localData && localData.theme) {
      this.theme.setThemeFromLocal(localData.theme);
      if (localData.theme === 'dark') { this.setDarkContent(); }
      else { this.setLightContent(); }
    } else {
      this.theme.setLightTheme();
      this.setLightContent();
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.router.navigate(['auth']);
    }
    this.auth.isAuthenticated();
  }

  ngOnInit(): void {
    this.userSubscription = this.auth.getCurrentUserStream().subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription && !this.userSubscription.closed) { this.userSubscription.unsubscribe(); }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  toggleTheme() {
    if (this.theme.isDarkTheme()) {
      this.theme.setLightTheme();
      this.setLightContent();
    } else {
      this.theme.setDarkTheme();
      this.setDarkContent();
    }
  }

  setDarkContent() {
    this.themeLogo = 'assets/icons/icon-152x152.png';
    this.themeIcon = faSun;
    this.themeType = 'dark';
  }

  setLightContent() {
    this.themeLogo = 'assets/icons/light-152x152.png';
    this.themeIcon = faMoon;
    this.themeType = 'light';
  }

  toggleBurger() {
    this.burger = !this.burger;
  }

  goToLink(url: string){
    window.open(url, '_blank');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: Event) {
    const element = document.querySelector('.navbar');
    if (window.pageYOffset > element.clientHeight) {
      this.navbarTransparent = false;
    } else {
      this.navbarTransparent = true;
    }
  }

}
