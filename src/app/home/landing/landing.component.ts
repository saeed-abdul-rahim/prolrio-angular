import { Component, OnInit, OnDestroy } from '@angular/core';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons/faDoorOpen';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons/faCloudUploadAlt';
import { faMobile } from '@fortawesome/free-solid-svg-icons/faMobile';
import { AuthService } from '@core/auth.service';
import { User } from '@models/User';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ThemeService } from '@services/theme/theme.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {

  faDoor = faDoorOpen;
  faUpload = faCloudUploadAlt;
  faMobile = faMobile;

  navbarTransparent = true;

  jpg = 'assets/jpg';
  gif = 'assets/gif';
  themeName: string;
  coursesImage: string;
  usersImage: string;
  realtimeImage: string;

  user: User;
  userSubscription: Subscription;
  themeSubscription: Subscription;

  constructor(private router: Router, private auth: AuthService, private theme: ThemeService) {
    this.userSubscription = this.auth.getCurrentUserStream().subscribe(user => this.user = user);
    this.themeSubscription = this.theme.getCurrentThemeStream().subscribe(name => {
      this.themeName = name;
      if (name === 'dark') {
        this.coursesImage = `${this.jpg}/dark-course.jpg`;
        this.usersImage = `${this.jpg}/dark-users.jpg`;
        this.realtimeImage = `${this.gif}/dark-realtime.gif`;
      } else {
        this.coursesImage = `${this.jpg}/light-course.jpg`;
        this.usersImage = `${this.jpg}/light-users.jpg`;
        this.realtimeImage = `${this.gif}/light-realtime.gif`;
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.userSubscription && !this.userSubscription.closed) { this.userSubscription.unsubscribe(); }
    if (this.themeSubscription && !this.themeSubscription.closed) { this.themeSubscription.unsubscribe(); }
  }

  navigate() {
    if (this.user) {
      this.router.navigate(['console']);
    } else {
      this.router.navigate(['auth']);
    }
  }

}
