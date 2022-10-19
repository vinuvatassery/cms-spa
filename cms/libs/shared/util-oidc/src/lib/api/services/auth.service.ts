/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import {
  AuthStateResult,
  EventTypes,
  OidcClientNotification,
  OidcSecurityService,
  PublicEventsService,
} from 'angular-auth-oidc-client';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Private properties **/
  private user: any;
  private authenticated!: boolean;

  /** Constructor **/
  constructor(
    public readonly oidcSecurityService: OidcSecurityService,
    public readonly eventService: PublicEventsService
  ) {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated, allConfigsAuthenticated }) => {
        this.authenticated = isAuthenticated;

        console.warn('authenticated: ', isAuthenticated);
      }
    );

    this.oidcSecurityService.userData$.subscribe(({ userData }) => {
      this.user = userData;
      console.warn('user: ', JSON.stringify(userData));
    });

    this.eventService
      .registerForEvents()
      .subscribe((result: OidcClientNotification<AuthStateResult>) => {
        console.warn('Event Received, ', JSON.stringify(result));
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
        console.warn('Token Expired, ', JSON.stringify(result));
        // if (result?.type === 4 && result?.value?.isAuthenticated === false)
        //   this.logoffAndRevokeTokens();
      });
  }

  /** Public methods **/
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
    const user: any = new Object();
    user.name = this.user?.name;
    user.userId = this.user?.preferred_username ?? this.user?.oid;
    user.preferred_username = this.user?.preferred_username;
    user.oid = this.user?.oid;

    return user;
  }

  checkAuth() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated }) => {
      console.warn('CheckAuth(): ' + JSON.stringify(isAuthenticated));
    });
  }
}
