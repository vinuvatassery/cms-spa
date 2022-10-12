/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CaseManagementFeatureClientEligibilityRoutingModule } from './case-management-feature-client-eligibility-routing.module';
/** Components  **/
import { AcceptApplicationComponent } from './components/accept-application/accept-application.component';
import { RejectApplicationComponent } from './components/reject-application/reject-application.component';
import { DeleteGroupComponent } from './components/delete-group/delete-group.component';
import { EligibilityPeriodDetailComponent } from './components/eligibility-period-detail/eligibility-period-detail.component';
import { EligibilityPeriodListComponent } from './components/eligibility-period-list/eligibility-period-list.component';
import { FplListComponent } from './components/fpl-list/fpl-list.component';
import { FplDetailComponent } from './components/fpl-detail/fpl-detail.component';
import { GroupDetailComponent } from './components/group-detail/group-detail.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { ResumeEligibilityPeriodComponent } from './components/resume-eligibility-period/resume-eligibility-period.component';
import { PbmDetailComponent } from './components/pbm-detail/pbm-detail.component';
import { DisenrollClientComponent } from './components/disenroll-client/disenroll-client.component';
import { ClientEligibilityPageComponent } from './containers/client-eligibility-page/client-eligibility-page.component';
import { ClientEligibilityComponent } from './components/client-eligibility/client-eligibility.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    CaseManagementDomainModule,
    CaseManagementFeatureClientEligibilityRoutingModule,
  ],
  declarations: [
    AcceptApplicationComponent,
    RejectApplicationComponent,
    DeleteGroupComponent,
    EligibilityPeriodDetailComponent,
    EligibilityPeriodListComponent,
    FplListComponent,
    FplDetailComponent,
    GroupDetailComponent,
    GroupListComponent,
    ResumeEligibilityPeriodComponent,
    PbmDetailComponent,
    DisenrollClientComponent,
    ClientEligibilityPageComponent,
    ClientEligibilityComponent,
  ],
  exports: [
    AcceptApplicationComponent,
    RejectApplicationComponent,
    DeleteGroupComponent,
    EligibilityPeriodDetailComponent,
    EligibilityPeriodListComponent,
    FplListComponent,
    FplDetailComponent,
    GroupDetailComponent,
    GroupListComponent,
    ResumeEligibilityPeriodComponent,
    PbmDetailComponent,
    DisenrollClientComponent,
    ClientEligibilityPageComponent,
    ClientEligibilityComponent,
  ],
})
export class CaseManagementFeatureClientEligibilityModule {}
