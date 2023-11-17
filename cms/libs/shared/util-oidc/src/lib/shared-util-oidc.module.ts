import { AuthModule } from 'angular-auth-oidc-client';

import { AuthConfigModule } from './auth-config.module';
import { NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
  imports: [AuthConfigModule],

  exports: [AuthModule],
})
export class SharedUtilOidcModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: SharedUtilOidcModule
  ) {
    if (parentModule) {
      throw new Error('Util OIDC is already loaded.');
    }
  }
}
