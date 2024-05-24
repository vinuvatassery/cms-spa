import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { featureUserLoginSignupRoutingModule } from './feature-user-login-signup.routing.module';
import { SigninComponent } from './component/signin/signin.component';
import { AccountSetupComponent } from './component/account-setup/account-setup.component';
import { AccountPersonalInfoComponent } from './component/account-personal-info/account-personal-info.component';
import { AccountHomeAddressInfoComponent } from './component/account-home-address-info/account-home-address-info.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { VerifyYourIdentyComponent } from './component/verify-your-identy/verify-your-identy.component';
import { SetNewPasswordComponent } from './component/set-new-password/set-new-password.component';
import { RecoverEmailComponent } from './component/recover-email/recover-email.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    featureUserLoginSignupRoutingModule,
  ],
  declarations: [
    SigninComponent,
    AccountSetupComponent,
    AccountPersonalInfoComponent,
    AccountHomeAddressInfoComponent,
    ForgotPasswordComponent,
    VerifyYourIdentyComponent,
    SetNewPasswordComponent,
    RecoverEmailComponent,
  ],
  exports: [
    SigninComponent,
    featureUserLoginSignupRoutingModule,
    AccountSetupComponent,
    AccountPersonalInfoComponent,
    AccountHomeAddressInfoComponent,
    ForgotPasswordComponent,
    VerifyYourIdentyComponent,
    SetNewPasswordComponent,
    RecoverEmailComponent,
  ],
})
export class FeatureUserLoginSignupModule {}
