/** Angular **/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/** External libraries **/
import { LogLevel, StsConfigHttpLoader } from 'angular-auth-oidc-client';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationProvider {
  /** Private properties **/
  private config: any;

  /** Constructor **/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadConfig() {
    const config$ = this.http.get<any>('./assets/config.json').pipe(
      map((config: any) => {
        this.config = config;

        return {
          authority: config.oidc.authority,
          authWellknownEndpointUrl: config.oidc.authWellknownEndpointUrl,
          redirectUrl: window.location.origin,
          postLogoutRedirectUri: window.location.origin,
          clientId: config.oidc.clientId,
          scope: config.oidc.scope,
          responseType: config.oidc.responseType,
          silentRenew: config.oidc.silentRenew,
          maxIdTokenIatOffsetAllowedInSeconds:
            config.oidc.maxIdTokenIatOffsetAllowedInSeconds,
          issValidationOff: config.oidc.issValidationOff,
          autoUserInfo: config.oidc.autoUserInfo,
          ignoreNonceAfterRefresh: true,
          useRefreshToken: config.oidc.useRefreshToken,
          logLevel: this.logLevel(config.oidc.logLevel),
          customParamsAuthRequest: {
            prompt: 'select_account', // login, consent, select_account, admin_consent
          },
          secureRoutes: config.oidc.secureRoutes,
        };
      })
    );

    return new StsConfigHttpLoader(config$);
  }

  get appSettings() {
    return this.config;
  }

  logLevel(level: string) {
    if (level === 'Debug') return LogLevel.Debug;
    else if (level === 'Warn') return LogLevel.Warn;
    else return LogLevel.Error;
  }
}
