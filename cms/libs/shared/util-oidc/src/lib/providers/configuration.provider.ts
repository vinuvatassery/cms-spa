import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogLevel, StsConfigHttpLoader } from 'angular-auth-oidc-client';
import { map, tap } from 'rxjs/operators';
import { config } from 'libs/assets/config';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationProvider {
  constructor(private http: HttpClient) {}

  loadConfigTS() {
    const config$ = of({
      authority: config.oidc.authority,
      authWellknownEndpointUrl: config.oidc.authWellknownEndpointUrl,
      redirectUrl: window.location.origin,
      clientId: config.oidc.clientId,
      scope: config.oidc.scope,
      responseType: config.oidc.responseType,
      silentRenew: config.oidc.silentRenew,
      silentRenewUrl: `${window.location.origin}/silent-renew.html`,
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
    });

    return new StsConfigHttpLoader(config$);
  }

  loadConfig() {
    const config$ = this.http.get<any>('./assets/config.json').pipe(
      map((config: any) => {
        // console.log(config);
        return {
          authority: config.oidc.authority,
          authWellknownEndpointUrl: config.oidc.authWellknownEndpointUrl,
          redirectUrl: window.location.origin,
          clientId: config.oidc.clientId,
          scope: config.oidc.scope,
          responseType: config.oidc.responseType,
          silentRenew: config.oidc.silentRenew,
          silentRenewUrl: `${window.location.origin}/silent-renew.html`,
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

  logLevel(level: string) {
    if (level === 'Debug') return LogLevel.Debug;
    else if (level === 'Warn') return LogLevel.Warn;
    else return LogLevel.Error;
  }
}
