import { Injectable, Injector } from '@angular/core';
import { OIDCAuthenticationService } from '@cms/shared/util-oidc';
import { config } from 'libs/assets/config';
import { AuthType } from '../enums/authType';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private authType: string = config.authType;

  constructor(private injector: Injector) {}

  public loadAuthService() {
    let authenticationService!: OIDCAuthenticationService;

    switch (this.authType) {
      case AuthType.OIDCAzureAD:
        authenticationService = new OIDCAuthenticationService(this.injector);
        break;
      case AuthType.Okta:
        authenticationService = new OIDCAuthenticationService(this.injector);
        break;
      case AuthType.Firebase:
        authenticationService = new OIDCAuthenticationService(this.injector);
        break;

      default:
        break;
    }
    return authenticationService;
  }
}
