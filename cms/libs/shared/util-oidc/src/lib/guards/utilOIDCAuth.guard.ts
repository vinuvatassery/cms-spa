import { Injectable, Injector } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { AutoLoginAllRoutesGuard } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UtilOIDCAuthGuard implements CanActivate, CanLoad {
  private OIDCGuard!: AutoLoginAllRoutesGuard;

  constructor(private injector: Injector) {
    this.OIDCGuard = injector.get(AutoLoginAllRoutesGuard);
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    console.log('Inside Util OIDC canActivate auth guard!');
    return this.OIDCGuard.canActivate(route, state).pipe(
      map((result) => {
        return result;
      })
    );
  }

  canLoad(route: Route, segments: UrlSegment[]): any {
    console.log('Inside Util OIDC canLoad auth guard!');

    return this.OIDCGuard.canLoad(route, segments).pipe(
      map((result) => {
        return result;
      })
    );
  }
}
