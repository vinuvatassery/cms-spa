import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientProfileManagementPageComponent } from './containers/client-profile-management-page/client-profile-management-page.component';
import { PronounsListComponent } from './components/pronouns-list/pronouns-list.component';
import { PronounsDetailComponent } from './components/pronouns-detail/pronouns-detail.component';
import { Routes } from '@angular/router';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SystemConfigFeatureUserManagementModule } from '@cms/system-config/feature-user-management';
import { GenderListComponent } from './components/gender-list/gender-list.component';
import { GenderDetailComponent } from './components/gender-detail/gender-detail.component';
import { SexualOrientationListComponent } from './components/sexual-orientation-list/sexual-orientation-list.component';
import { SexualOrientationDetailComponent } from './components/sexual-orientation-detail/sexual-orientation-detail.component';
import { RacialOrEthnicIdentityListComponent } from './components/racial-or-ethnic-identity-list/racial-or-ethnic-identity-list.component';
import { RacialOrEthnicIdentityDetailComponent } from './components/racial-or-ethnic-identity-detail/racial-or-ethnic-identity-detail.component';
import { LanguageListComponent } from './components/language-list/language-list.component';
import { LanguageDetailComponent } from './components/language-detail/language-detail.component';
import { SystemConfigFeatureClientProfileManagementRoutingModule } from './system-config-feature-client-profile-management-routing.module';
// const routes: Routes = [
//   {
//     path: '',
//     component: ClientProfileManagementPageComponent,
//   },
// ];

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule, SystemConfigFeatureClientProfileManagementRoutingModule],
  declarations: [
    ClientProfileManagementPageComponent,
    PronounsListComponent,
    PronounsDetailComponent,
    GenderListComponent,
    GenderDetailComponent,
    SexualOrientationListComponent,
    SexualOrientationDetailComponent,
    RacialOrEthnicIdentityListComponent,
    RacialOrEthnicIdentityDetailComponent,
    LanguageListComponent,
    LanguageDetailComponent,
  ],
  exports: [
    ClientProfileManagementPageComponent,
    PronounsListComponent,
    PronounsDetailComponent,
    GenderListComponent,
    GenderDetailComponent,
    SexualOrientationListComponent,
    SexualOrientationDetailComponent,
    RacialOrEthnicIdentityListComponent,
    RacialOrEthnicIdentityDetailComponent,
    LanguageListComponent,
    LanguageDetailComponent,
  ],
})
export class SystemConfigFeatureClientProfileManagementModule { }
