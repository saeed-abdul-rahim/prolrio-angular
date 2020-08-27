import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@core/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderGuard implements CanActivate, CanLoad {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIsProvider();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkIsProvider();
  }

  async checkIsProvider() {
    const authenticated = await this.auth.isLoggedIn();
    if (!authenticated) { return false; }
    let user = await this.auth.getCurrentUser();
    if (!user) {
      await this.auth.getUser();
      user = await this.auth.getCurrentUser();
    }
    if (user.role !== 'provider') {
      this.router.navigateByUrl('/console');
      return false;
    }
    return true;
  }
}
