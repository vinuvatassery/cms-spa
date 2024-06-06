import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { GenderDetailComponent } from './components/gender-detail/gender-detail.component';
import { GenderListComponent } from './components/gender-list/gender-list.component';
import { LanguageDetailComponent } from './components/language-detail/language-detail.component';
import { LanguageListComponent } from './components/language-list/language-list.component';
import { PronounsDetailComponent } from './components/pronouns-detail/pronouns-detail.component';
import { PronounsListComponent } from './components/pronouns-list/pronouns-list.component';
import { RacialOrEthnicIdentityDetailComponent } from './components/racial-or-ethnic-identity-detail/racial-or-ethnic-identity-detail.component';
import { RacialOrEthnicIdentityListComponent } from './components/racial-or-ethnic-identity-list/racial-or-ethnic-identity-list.component';
import { SexualOrientationDetailComponent } from './components/sexual-orientation-detail/sexual-orientation-detail.component';
import { SexualOrientationListComponent } from './components/sexual-orientation-list/sexual-orientation-list.component';
import { ClientProfileManagementPageComponent } from './containers/client-profile-management-page/client-profile-management-page.component';
import { DirectMessagesListComponent } from './components/direct-messages-list/direct-messages-list.component';
import { DirectMessagesFrequenciesFormComponent } from './components/direct-messages-frequencies-form/direct-messages-frequencies-form.component';
import { DirectMessagePageComponent } from './containers/direct-message-page/direct-message-page.component';
import { LanguagePageComponent } from './containers/language-page/language-page.component';
import { RacialOrEthnicIdentityPageComponent } from './containers/racial-or-ethnic-identity-page/racial-or-ethnic-identity-page.component';
import { GenderPageComponent } from './containers/gender-page/gender-page.component';
import { PronounsPageComponent } from './containers/pronouns-page/pronouns-page.component';
import { SexualOrientationPageComponent } from './containers/sexual-orientation-page/sexual-orientation-page.component';
import { SystemConfigFeatureClientProfileManagementRoutingModule } from './system-config-feature-client-profile-management.routing.module';
import { ReorderDetailComponent } from './components/reorder-detail/reorder-detail.component';
@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule, SystemConfigFeatureClientProfileManagementRoutingModule],
  declarations: [
    GenderDetailComponent,
    GenderListComponent,
    LanguageDetailComponent,
    LanguageListComponent,
    PronounsDetailComponent,
    PronounsListComponent,
    RacialOrEthnicIdentityDetailComponent,
    RacialOrEthnicIdentityListComponent,
    SexualOrientationDetailComponent,
    SexualOrientationListComponent,
    ClientProfileManagementPageComponent,
    DirectMessagesListComponent,
    DirectMessagesFrequenciesFormComponent,
    DirectMessagePageComponent,
    LanguagePageComponent,
    RacialOrEthnicIdentityPageComponent,
    GenderPageComponent,
    PronounsPageComponent,
    SexualOrientationPageComponent,
    ReorderDetailComponent,    
  ],
  exports: [
    GenderDetailComponent,
    GenderListComponent,
    LanguageDetailComponent,
    LanguageListComponent,
    PronounsDetailComponent,
    PronounsListComponent,
    RacialOrEthnicIdentityDetailComponent,
    RacialOrEthnicIdentityListComponent,
    SexualOrientationDetailComponent,
    SexualOrientationListComponent,
    ClientProfileManagementPageComponent,
    DirectMessagesListComponent,
    DirectMessagesFrequenciesFormComponent,
    DirectMessagePageComponent,
    LanguagePageComponent,
    RacialOrEthnicIdentityPageComponent,
    GenderPageComponent,
    PronounsPageComponent,
    SexualOrientationPageComponent,
    ReorderDetailComponent,
  ],
})
export class SystemConfigFeatureClientProfileManagementModule {}
