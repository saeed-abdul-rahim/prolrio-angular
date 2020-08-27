import { Component } from '@angular/core';
import { ThemeService } from '@services/theme/theme.service';
import localStorageHelper from '@utils/localStorageHelper';
import { environment } from '@environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'prolr';

  constructor(private theme: ThemeService) {
    const { localStorageKey } = environment;
    const localData = localStorageHelper.getItem(localStorageKey);
    if (localData && localData.theme) {
      this.theme.setThemeFromLocal(localData.theme);
    } else {
      this.theme.setLightTheme();
    }
  }

}
