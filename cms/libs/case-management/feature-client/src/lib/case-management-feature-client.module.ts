/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SystemConfigFeatureUserManagementModule } from '@cms/system-config/feature-user-management';
import { CaseManagementFeatureClientRoutingModule } from './case-management-feature-client-routing.module';
/** Components  **/
import { ClientPageComponent } from './containers/client-page/client-page.component';
import { ClientEditViewComponent } from './components/client-edit-view/client-edit-view.component';
import { ClientReadOnlyViewComponent } from './components/client-read-only-view/client-read-only-view.component';
import { SpecialHandlingComponent } from './components/special-handling/special-handling.component';
import { DuplicateClientFoundComponent } from './components/duplicate-client-found/duplicate-client-found.component';
import { CaseDetailsComponent } from './components/case-details/case-details.component';
import { SpecialHandlingDetailComponent } from './components/special-handling-detail/special-handling-detail.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ClientEditViewPronounComponent } from './components/client-edit-view-pronoun/client-edit-view-pronoun.component';
import { ClientEditViewGenderComponent } from './components/client-edit-view-gender/client-edit-view-gender.component';
import { ClientEditViewTransgenderComponent } from './components/client-edit-view-transgender/client-edit-view-transgender.component';
import { ClientEditViewSexAtBirthComponent } from './components/client-edit-view-sex-at-birth/client-edit-view-sex-at-birth.component';
import { ClientEditViewSexualIdentityComponent } from './components/client-edit-view-sexual-identity/client-edit-view-sexual-identity.component';
import { ClientEditViewRaceAndEthnicityComponent } from './components/client-edit-view-race-and-ethnicity/client-edit-view-race-and-ethnicity.component';
import { ProfileClientPageComponent } from './containers/profile-client-page/profile-client-page.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementFeatureClientRoutingModule,
    CaseManagementDomainModule,
    SharedUiCommonModule,
    SharedUiTpaModule,
    SystemConfigFeatureUserManagementModule,
  ],
  declarations: [
    ClientPageComponent,
    ClientEditViewComponent,
    ClientReadOnlyViewComponent,
    SpecialHandlingComponent,
    DuplicateClientFoundComponent,
    CaseDetailsComponent,
    SpecialHandlingDetailComponent,
    ClientEditViewPronounComponent,
    ClientEditViewGenderComponent,
    ClientEditViewTransgenderComponent,
    ClientEditViewSexAtBirthComponent,
    ClientEditViewSexualIdentityComponent,
    ClientEditViewRaceAndEthnicityComponent,
    ProfileClientPageComponent
  ],
  exports: [
    ClientPageComponent,
    ClientEditViewComponent,
    ClientReadOnlyViewComponent,
    SpecialHandlingComponent,
    DuplicateClientFoundComponent,
    SpecialHandlingDetailComponent,
    ProfileClientPageComponent
  ],
})
export class CaseManagementFeatureClientModule {}
