import { Injectable } from '@angular/core';
import { ConsoleNav, Url } from './ConsoleNav';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConsoleNavService {

  private consoleNavItems: BehaviorSubject < Array<ConsoleNav> > = new BehaviorSubject < Array<ConsoleNav> > (null);
  private sectionId: BehaviorSubject <string> = new BehaviorSubject <string> (null);
  private subjectId: BehaviorSubject <string> = new BehaviorSubject <string> (null);
  private allUrl: BehaviorSubject < Array<Url> > = new BehaviorSubject <Array<Url>> ([]);

  constructor(private router: Router) { }

  setNavItems(navItems: Array<ConsoleNav>) {
    this.consoleNavItems.next(navItems);
  }

  getNavItems(): Observable<Array<ConsoleNav>> {
    return this.consoleNavItems;
  }

  setSectionId(sectionId: string) {
    this.sectionId.next(sectionId);
  }

  getSectionId(): Observable<string> {
    return this.sectionId;
  }

  setSubjectId(subjectId: string) {
    this.sectionId.next(subjectId);
  }

  getSubjectId(): Observable<string> {
    return this.subjectId;
  }

  setUrl(urls: Array<Url>) {
    this.allUrl.next(urls);
  }

  getUrl(): Observable<Array<Url>> {
    return this.allUrl;
  }

  getBaseUrl(): string {
    const url = this.router.url.substr(1);
    const urlSplit = url.split('/');
    return urlSplit.slice(0, 2).join('/');
  }

  pushUrl(newUrl: Url) {
    const url = this.allUrl.getValue();
    const urlIndex = url.findIndex(u => u.url === newUrl.url);
    let newUrls: Array<Url>;
    if (urlIndex > -1) {
      newUrls = url.slice(0, urlIndex + 1);
    } else {
      url.push(newUrl);
      newUrls = url;
    }
    this.setUrl(newUrls);
  }

  popUrl() {
    const url = this.allUrl.getValue();
    url.pop();
    this.setUrl(url);
  }

  resetUrl() {
    this.setUrl([]);
  }

}
