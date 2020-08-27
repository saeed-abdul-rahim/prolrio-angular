import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ConsoleNavService } from '@services/console-nav/console-nav.service';
import { Url } from '@services/console-nav/ConsoleNav';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  loaded = false;
  urls: Url[] = [];

  constructor(private consoleNav: ConsoleNavService, private router: Router) {
    this.consoleNav.getUrl().subscribe(allUrls => this.urls = allUrls);
  }

  ngOnInit(): void {
  }

  navigateUrl(label: string, url: string): void {
    this.consoleNav.pushUrl({ label, url });
    this.router.navigateByUrl(url);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
    event.preventDefault();
    this.consoleNav.popUrl();
    if (this.urls.length > 0) {
      const lastUrl = this.urls.slice(-1)[0];
      // NOT WORKING
      this.router.navigate([`/${lastUrl.url}`], { replaceUrl: true });
    } else {
      this.router.navigate([''], { replaceUrl: true });
    }
  }

}
