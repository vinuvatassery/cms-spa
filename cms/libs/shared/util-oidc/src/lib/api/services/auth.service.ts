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
import { UserProfileService } from '@cms/shared/util-core';
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
    public readonly eventService: PublicEventsService,
    public readonly userProfileService: UserProfileService
  ) {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated, allConfigsAuthenticated }) => {
        this.authenticated = isAuthenticated;
        if(this.authenticated){
          this.userProfileService.getUserProfile();
        }
      }
    );

    this.oidcSecurityService.userData$.subscribe(({ userData }) => {
      this.user = userData;
    });

    this.eventService
      .registerForEvents()
      .subscribe((result: OidcClientNotification<AuthStateResult>) => {
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
    this.oidcSecurityService.logoff().subscribe((result) => {      
    });

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
    });
  }
}
