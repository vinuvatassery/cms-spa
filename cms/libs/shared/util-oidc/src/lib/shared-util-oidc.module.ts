/** Angular **/
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
/** External libraries **/
import {
  AuthInterceptor,
  AuthModule,
  StsConfigLoader,
  AutoLoginAllRoutesGuard,
  OidcSecurityService,
} from 'angular-auth-oidc-client';
/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';
/** Services **/
import { AuthService } from './api/services/auth.service';

export { AuthService, AutoLoginAllRoutesGuard, OidcSecurityService };

export const configFactory = (configProvider: ConfigurationProvider) => {
  return configProvider.loadConfig();
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: configFactory,
        deps: [ConfigurationProvider],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  exports: [AuthModule],
})
export class SharedUtilOidcModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: SharedUtilOidcModule
  ) {
    if (parentModule) {
      throw new Error(
        'SharedUtilOidcModule is already loaded. Import only in AppModule'
      );
    }
  }
}
