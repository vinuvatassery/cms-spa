/* eslint-disable arrow-body-style */

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  AuthInterceptor,
  AuthModule,
  StsConfigLoader,
  StsConfigStaticLoader,
} from 'angular-auth-oidc-client';
import { ConfigurationProvider } from './providers/configuration.provider';

import { StaticConfigurationProvider } from './providers/staticConfiguration.provider';

export const authFactory = (configService: StaticConfigurationProvider) => {
  console.log('Static configuration');
  const config = configService.getConfig();
  return new StsConfigStaticLoader(config);
};

export const configTSFactory = (configProvider: ConfigurationProvider) => {
  console.log('TS configuration');
  return configProvider.loadConfigTS();
};

export const configFactory = (configProvider: ConfigurationProvider) => {
  console.log('HTTP configuration');
  return configProvider.loadConfig();
};

@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        // useFactory: authFactory,
        // deps: [StaticConfigurationProvider],
        useFactory: configTSFactory,
        deps: [ConfigurationProvider],
        // useFactory: configFactory,
        // deps: [ConfigurationProvider],
      },
    }),
  ],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: configFactory,
    //   deps: [ConfigurationProvider],
    //   multi: true,
    // },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
