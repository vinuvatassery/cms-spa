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
import { Cd4CountComponent } from './components/cd4-count/cd4-count.component';
import { ViralLoadComponent } from './components/viral-load/viral-load.component';
import { UnAssignCaseManagerComponent } from './components/un-assign-case-manager/un-assign-case-manager.component';
import { CaseManagerReferralRequestComponent } from './components/case-manager-referral-request/case-manager-referral-request.component';
import { AssignCaseManagerComponent } from './components/assign-case-manager/assign-case-manager.component';
import { ManagementPageComponent } from './containers/management-page/management-page.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureManagementRoutingModule,
    SharedUiTpaModule,
  ],
  declarations: [
    CaseManagerListComponent,
    CaseManagerDetailComponent,
    HealthCareProviderListComponent,
    HealthCareProviderDetailComponent,
    ReAssignCaseManagerComponent,
    Cd4CountComponent,
    ViralLoadComponent,
    UnAssignCaseManagerComponent,
    CaseManagerReferralRequestComponent,
    AssignCaseManagerComponent,
    ManagementPageComponent,
  ],
  exports: [
    CaseManagerListComponent,
    CaseManagerDetailComponent,
    HealthCareProviderListComponent,
    HealthCareProviderDetailComponent,
    ReAssignCaseManagerComponent,
    Cd4CountComponent,
    ViralLoadComponent,
    UnAssignCaseManagerComponent,
    CaseManagerReferralRequestComponent,
    AssignCaseManagerComponent,
  ],
})
export class CaseManagementFeatureManagementModule {}
