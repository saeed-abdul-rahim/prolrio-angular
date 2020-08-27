import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIsAdmin();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkIsAdmin();
  }

  async checkIsAdmin() {
    const authenticated = await this.auth.isLoggedIn();
    if (!authenticated) { return false; }
    let user = await this.auth.getCurrentUser();
    if (!user) {
      await this.auth.getUser();
      user = await this.auth.getCurrentUser();
    }
    if (user.role !== 'admin') {
      this.router.navigateByUrl('/console');
      return false;
    }
    return true;
  }
}
