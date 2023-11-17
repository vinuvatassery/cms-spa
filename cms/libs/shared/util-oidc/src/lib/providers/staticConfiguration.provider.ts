import { Injectable } from '@angular/core';
import { LogLevel, OpenIdConfiguration } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root',
})
export class StaticConfigurationProvider {
  getConfig(): OpenIdConfiguration {
    return {
      authority:
        'https://login.microsoftonline.com/d5cf2436-2b1a-4c0e-b62b-a4c844d46878/v2.0',
      authWellknownEndpointUrl:
        'https://login.microsoftonline.com/d5cf2436-2b1a-4c0e-b62b-a4c844d46878/v2.0',
      clientId: '7a16a1a6-56de-4dc0-91c1-65b34a60ea8d',
      scope:
        'openid profile offline_access email api://8d414121-0381-4b6a-b8db-6ef60cb42bba/access_as_user',
      responseType: 'code',
      silentRenew: true,
      silentRenewUrl: `${window.location.origin}/silent-renew.html`,
      maxIdTokenIatOffsetAllowedInSeconds: 600,
      issValidationOff: true,
      autoUserInfo: false,
      useRefreshToken: true,
      logLevel: LogLevel.Debug,
      redirectUrl: window.location.origin,
      customParamsAuthRequest: {
        prompt: 'select_account', // login, consent
      },
    };
  }
}
