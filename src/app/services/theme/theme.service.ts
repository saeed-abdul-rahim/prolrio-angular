import { Injectable } from '@angular/core';
import { Theme, light, dark } from './theme';
import localStorageHelper from '@utils/localStorageHelper';
import { environment } from '@environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  localKey: string;
  private active: Theme = light;
  private availableThemes: Theme[] = [light, dark];
  private currentTheme: BehaviorSubject<string> = new BehaviorSubject<string> (null);
  currentTheme$ = this.currentTheme.asObservable();

  constructor() {
    const { localStorageKey } = environment;
    this.localKey = localStorageKey;
  }

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  getCurrentThemeStream() {
    return this.currentTheme$;
  }

  isDarkTheme(): boolean {
    return this.active.name === dark.name;
  }

  setThemeFromLocal(localTheme: string) {
    const allThemes = [ ...this.getAvailableThemes().map(theme => theme.name) ];
    if (allThemes.includes(localTheme)) {
      if (localTheme === 'dark') {
        this.setDarkTheme();
      } else {
        this.setLightTheme();
      }
    } else {
      this.setLightTheme();
    }
  }

  setDarkTheme(): void {
    this.setActiveTheme(dark);
  }

  setLightTheme(): void {
    this.setActiveTheme(light);
  }

  setActiveTheme(theme: Theme): void {
    this.active = theme;
    const appLocal = localStorageHelper.getItem(this.localKey);
    if (appLocal) {
      localStorageHelper.setItem(this.localKey, { ...appLocal, theme: this.active.name });
    } else {
      localStorageHelper.setItem(this.localKey, this.active.name);
    }
    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
    this.currentTheme.next(this.active.name);
  }
}
