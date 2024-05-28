/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './component/signin/signin.component';
import { AccountSetupComponent } from './component/account-setup/account-setup.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { VerifyYourIdentyComponent } from './component/verify-your-identy/verify-your-identy.component';
import { SetNewPasswordComponent } from './component/set-new-password/set-new-password.component';
import { RecoverEmailComponent } from './component/recover-email/recover-email.component';
import { CpAccountSettingsComponent } from './component/cp-account-settings/cp-account-settings.component';
import { CpHomeComponent } from './component/cp-home/cp-home.component';
import { CpMyProfileComponent } from './component/cp-my-profile/cp-my-profile.component';
import { ProvidersInformationComponent } from './component/providers-information/providers-information.component';

const routes: Routes = [
  {
    path: '',
    component: SigninComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'signin',
    component: SigninComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'setup',
    component: AccountSetupComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'verifyIdentity',
    component: VerifyYourIdentyComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'setNewPassword',
    component: SetNewPasswordComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'recoverEmail',
    component: RecoverEmailComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'providerInfo',
    component: ProvidersInformationComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'home',
    component: CpHomeComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'accountSettings',
    component: CpAccountSettingsComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'myProfile',
    component: CpMyProfileComponent,
    data: {
      title: '',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class featureUserLoginSignupRoutingModule {}
