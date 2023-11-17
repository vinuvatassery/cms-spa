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
import { UtilOIDCAuthGuard } from '@cms/shared/util-oidc';
import { config } from 'libs/assets/config';
import { Observable } from 'rxjs';
import { AuthType } from '../enums/authType';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  private activatedRoute!: ActivatedRouteSnapshot;
  private state!: RouterStateSnapshot;
  private route!: Route;
  private segments!: UrlSegment[];
  private authType: string = config.authType; //'OIDC AzureAD';

  constructor(private injector: Injector) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    this.route = route;
    this.segments = segments;
    return this.loadGuard(this.authType);
  }

  canActivate(
    activatedRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.activatedRoute = activatedRoute;
    this.state = state;

    return this.activateGuard(this.authType);
  }

  private activateGuard(authType: string): Observable<boolean | UrlTree> {
    let guard!: UtilOIDCAuthGuard;

    switch (authType) {
      case AuthType.OIDCAzureAD:
        guard = new UtilOIDCAuthGuard(this.injector);
        break;
      case AuthType.Okta:
        guard = new UtilOIDCAuthGuard(this.injector);
        break;
      case AuthType.Firebase:
        guard = new UtilOIDCAuthGuard(this.injector);
        break;

      default:
        break;
    }
    return guard.canActivate(this.activatedRoute, this.state);
  }

  private loadGuard(authType: string): Observable<boolean | UrlTree> {
    let guard!: UtilOIDCAuthGuard;

    switch (authType) {
      case AuthType.OIDCAzureAD:
        guard = new UtilOIDCAuthGuard(this.injector);
        break;
      case AuthType.Okta:
        guard = new UtilOIDCAuthGuard(this.injector);
        break;
      case AuthType.Firebase:
        guard = new UtilOIDCAuthGuard(this.injector);
        break;

      default:
        break;
    }
    return guard.canLoad(this.route, this.segments);
  }
}
