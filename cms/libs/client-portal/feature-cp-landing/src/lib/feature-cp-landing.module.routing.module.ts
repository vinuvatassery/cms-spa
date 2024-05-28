/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CpAccountSettingsComponent } from './components/cp-account-settings/cp-account-settings.component';
import { CpHomeComponent } from './components/cp-home/cp-home.component';
import { CpMyProfileComponent } from './components/cp-my-profile/cp-my-profile.component';
import { ProvidersInformationComponent } from './components/providers-information/providers-information.component';
import { CpLandingScreenComponent } from './components/cp-landing-screen/cp-landing-screen.component';

const routes: Routes = [
  {
    path: '',
    component: CpHomeComponent,
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
    path: 'landing',
    component: CpLandingScreenComponent,
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
export class FeatureCpLandingRoutingModule {}
