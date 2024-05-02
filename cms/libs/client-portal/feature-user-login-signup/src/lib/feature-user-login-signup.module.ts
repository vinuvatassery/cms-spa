import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { featureUserLoginSignupRoutingModule } from './feature-user-login-signup.routing.module';
import { SigninComponent } from './component/signin/signin.component';
import { AccountSetupComponent } from './component/account-setup/account-setup.component';
import { AccountPersonalInfoComponent } from './component/account-personal-info/account-personal-info.component';
import { AccountHomeAddressInfoComponent } from './component/account-home-address-info/account-home-address-info.component';

@NgModule({
  imports: [CommonModule, featureUserLoginSignupRoutingModule],
  declarations: [
    SigninComponent,
    AccountSetupComponent,
    AccountPersonalInfoComponent,
    AccountHomeAddressInfoComponent,
  ],
  exports: [
    SigninComponent,
    featureUserLoginSignupRoutingModule,
    AccountSetupComponent,
    AccountPersonalInfoComponent,
    AccountHomeAddressInfoComponent,
  ],
})
export class FeatureUserLoginSignupModule {}
