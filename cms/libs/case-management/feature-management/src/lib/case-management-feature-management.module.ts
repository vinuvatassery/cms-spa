/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureManagementRoutingModule } from './case-management-feature-management-routing.module';
/** Components **/
import { CaseManagerListComponent } from './components/case-manager-list/case-manager-list.component';
import { CaseManagerDetailComponent } from './components/case-manager-detail/case-manager-detail.component';
import { HealthCareProviderListComponent } from './components/health-care-provider-list/health-care-provider-list.component';
import { HealthCareProviderDetailComponent } from './components/health-care-provider-detail/health-care-provider-detail.component';
import { ReAssignCaseManagerComponent } from './components/re-assign-case-manager/re-assign-case-manager.component';
import { UnAssignCaseManagerComponent } from './components/un-assign-case-manager/un-assign-case-manager.component';
import { CaseManagerReferralRequestComponent } from './components/case-manager-referral-request/case-manager-referral-request.component';
import { AssignCaseManagerComponent } from './components/assign-case-manager/assign-case-manager.component';
import { ManagementPageComponent } from './containers/management-page/management-page.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { HivCaseManagerCardComponent } from './components/hiv-case-manager-card/hiv-case-manager-card.component';
import { RemoveCaseManagerConfirmationComponent } from './components/remove-case-manager-confirmation/remove-case-manager-confirmation.component';
import { CaseManagerSearchComponent } from './components/case-manager-search/case-manager-search.component';
import { ProfileManagementPageComponent } from './containers/profile-management-page/profile-management-page.component';
import { ViralLoadCD4CountComponent } from './components/viral-load-cd4-count/viral-load-cd4-count.component';
import { CaseManagerEffectiveDatesComponent } from './components/case-manager-effective-dates/case-manager-effective-dates.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureManagementRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule
  ],
  declarations: [
    CaseManagerListComponent,
    CaseManagerDetailComponent,
    HealthCareProviderListComponent,
    HealthCareProviderDetailComponent,
    ReAssignCaseManagerComponent,  
    ViralLoadCD4CountComponent,
    UnAssignCaseManagerComponent,
    CaseManagerReferralRequestComponent,
    AssignCaseManagerComponent,
    ManagementPageComponent,
    HivCaseManagerCardComponent,
    RemoveCaseManagerConfirmationComponent,
    CaseManagerSearchComponent,
    ProfileManagementPageComponent,
    CaseManagerEffectiveDatesComponent
  ],
  exports: [
    CaseManagerListComponent,
    CaseManagerDetailComponent,
    HealthCareProviderListComponent,
    HealthCareProviderDetailComponent,
    ReAssignCaseManagerComponent,
    ViralLoadCD4CountComponent,
    UnAssignCaseManagerComponent,
    CaseManagerReferralRequestComponent,
    AssignCaseManagerComponent,
    HivCaseManagerCardComponent,
    RemoveCaseManagerConfirmationComponent,
    CaseManagerSearchComponent,
    ProfileManagementPageComponent,
    CaseManagerEffectiveDatesComponent
  ],
})
export class CaseManagementFeatureManagementModule {}
