import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CpAccountSettingsComponent } from './components/cp-account-settings/cp-account-settings.component';
import { CpHomeComponent } from './components/cp-home/cp-home.component';
import { CpMyProfileComponent } from './components/cp-my-profile/cp-my-profile.component';
import { ProvidersInformationComponent } from './components/providers-information/providers-information.component';
import { FeatureCpLandingRoutingModule } from './feature-cp-landing.module.routing.module';
import { CpLandingScreenComponent } from './components/cp-landing-screen/cp-landing-screen.component';

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, FeatureCpLandingRoutingModule],
  declarations: [
    ProvidersInformationComponent,
    CpHomeComponent,
    CpAccountSettingsComponent,
    CpMyProfileComponent,
    CpLandingScreenComponent,
  ],
  exports: [
    ProvidersInformationComponent,
    CpHomeComponent,
    CpAccountSettingsComponent,
    CpMyProfileComponent,
    CpLandingScreenComponent,
  ],
})
export class FeatureCpLandingModule {}
