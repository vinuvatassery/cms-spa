import { Injectable, Injector } from '@angular/core';
import {
  AuthStateResult,
  EventTypes,
  OidcClientNotification,
  OidcSecurityService,
  PublicEventsService,
} from 'angular-auth-oidc-client';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OIDCAuthenticationService {
  private user: any;
  private authenticated!: boolean;
  private oidcSecurityService: OidcSecurityService;
  private eventService: PublicEventsService;

  constructor(private injector: Injector) {
    this.oidcSecurityService = injector.get(OidcSecurityService);
    this.eventService = injector.get(PublicEventsService);

    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated, allConfigsAuthenticated }) => {
        this.authenticated = isAuthenticated;

        // console.warn('authenticated: ', isAuthenticated);
      }
    );

    this.oidcSecurityService.userData$.subscribe(({ userData }) => {
      this.user = userData;
      // console.warn('user: ', JSON.stringify(userData));
    });

    this.eventService
      .registerForEvents()
      .subscribe((result: OidcClientNotification<AuthStateResult>) => {
        // console.warn('Event Received, ', JSON.stringify(result));
      });

    this.eventService
      .registerForEvents()
      .pipe(
        filter(
          (notification) =>
            notification.type === EventTypes.NewAuthenticationResult
        )
      )
      .subscribe((result) => {
        // console.warn('Token Expired, ', JSON.stringify(result));
      });
  }

  get isAuthenticated() {
    return this.authenticated;
  }

  logIn(): void {
    this.oidcSecurityService.authorize();
  }

  logOut(): void {
    this.oidcSecurityService.logoff();
  }

  logoffAndRevokeTokens(): void {
    this.oidcSecurityService.logoffAndRevokeTokens();
  }

  getUser(): any {
    let u: any = new Object();
    u.name = this.user.name;
    u.userId = this.user.preferred_username;
    return u;
  }

  checkAuth() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated }) => {
      // console.warn('CheckAuth(): ' + JSON.stringify(isAuthenticated));
    });
  }
}
