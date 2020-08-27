import { Component, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { ThemeService } from '@services/theme/theme.service';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import localStorageHelper from '@utils/localStorageHelper';
import { AuthService } from '@core/auth.service';
import { Router } from '@angular/router';
import { environment } from '@environment';

@Component({
  selector: 'app-console-nav',
  templateUrl: './console-nav.component.html',
  styleUrls: ['./console-nav.component.scss']
})
export class ConsoleNavComponent implements OnInit {

  logoText: string;
  themeIcon: IconDefinition;
  themeText: string;
  consoleNavItems: any;
  faSignOutAlt = faSignOutAlt;

  constructor(private consoleNav: ConsoleNavService, private theme: ThemeService, private auth: AuthService, private router: Router) {
    const { localStorageKey, name } = environment;
    const localData = localStorageHelper.getItem(localStorageKey);
    this.logoText = name;
    if (localData && localData.theme) {
      this.theme.setThemeFromLocal(localData.theme);
      if (localData.theme === 'dark') { this.setLightContent(); }
      else { this.setDarkContent(); }
    } else {
      this.theme.setLightTheme();
      this.setDarkContent();
    }
  }

  ngOnInit(): void {
    this.consoleNav.getNavItems().subscribe(navItems => this.consoleNavItems = navItems);
  }

  toggleTheme() {
    if (this.theme.isDarkTheme()) {
      this.theme.setLightTheme();
      this.setDarkContent();
    } else {
      this.theme.setDarkTheme();
      this.setLightContent();
    }
  }

  setDarkContent() {
    this.themeIcon = faMoon;
    this.themeText = 'Dark Mode';
  }

  setLightContent() {
    this.themeIcon = faSun;
    this.themeText = 'Light Mode';
  }

  signOut() {
    this.auth.signOut();
    this.router.navigateByUrl('auth');
  }

}
