/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementFeatureCerTrackingModule } from '@cms/case-management/feature-cer-tracking';
import { CaseManagementFeatureCommunicationModule } from '@cms/case-management/feature-communication';
import { SystemConfigFeatureUserManagementModule } from '@cms/system-config/feature-user-management';
import { ProductivityToolsFeatureEventLogModule } from '@cms/productivity-tools/feature-event-log';
import { ProductivityToolsFeatureTodoModule } from '@cms/productivity-tools/feature-todo';
import { ProductivityToolsFeatureDirectMessageModule } from '@cms/productivity-tools/feature-direct-message';
import { CaseManagementFeatureClientEligibilityModule } from '@cms/case-management/feature-client-eligibility';
import { CaseManagementFeatureClientModule } from '@cms/case-management/feature-client';
import { CaseManagementFeatureContactModule } from '@cms/case-management/feature-contact';
import { CaseManagementFeatureFamilyAndDependentModule } from '@cms/case-management/feature-family-and-dependent';
import { CaseManagementFeatureIncomeModule } from '@cms/case-management/feature-income';
import { CaseManagementFeatureEmploymentModule } from '@cms/case-management/feature-employment';
import { CaseManagementFeatureVerificationModule } from '@cms/case-management/feature-verification';
import { CaseManagementFeatureHealthInsuranceModule } from '@cms/case-management/feature-health-insurance';
import { CaseManagementFeatureCaseRoutingModule } from './case-management-feature-case-routing.module';
/** Components  **/
import { LastVisitedCasesComponent } from './components/last-visited-cases/last-visited-cases.component';
import { CasePageComponent } from './containers/case-page/case-page.component';
import { CaseListComponent } from './components/case-list/case-list.component';
import { CaseNavigationComponent } from './components/case-navigation/case-navigation.component';
import { NewCaseComponent } from './components/new-case/new-case.component';
import { CaseDetailPageComponent } from './containers/case-detail-page/case-detail-page.component';
import { Case360PageComponent } from './containers/case360-page/case360-page.component';
import { Case360HeaderComponent } from './components/case360-header/case360-header.component';
import { ReAssignCaseComponent } from './components/re-assign-case/re-assign-case.component';
import { CommonActionsComponent } from './components/common-actions/common-actions.component';
import { SendLetterProfileComponent } from './components/send-letter-profile/send-letter-profile.component';

@NgModule({
  imports: [
    CaseManagementFeatureCaseRoutingModule,
    CommonModule,
    CaseManagementDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureCerTrackingModule,    
    ProductivityToolsFeatureTodoModule,
    CaseManagementFeatureClientModule,
    CaseManagementFeatureCommunicationModule,
    SystemConfigFeatureUserManagementModule,
    ProductivityToolsFeatureEventLogModule,
    ProductivityToolsFeatureDirectMessageModule,
    CaseManagementFeatureClientEligibilityModule,    
    CaseManagementFeatureContactModule,
    CaseManagementFeatureFamilyAndDependentModule,
    CaseManagementFeatureIncomeModule,
    CaseManagementFeatureEmploymentModule,
    CaseManagementFeatureVerificationModule,
    CaseManagementFeatureHealthInsuranceModule
  ],
  declarations: [
    LastVisitedCasesComponent,
    CasePageComponent,
    CaseListComponent,
    CaseNavigationComponent,
    NewCaseComponent,
    CaseDetailPageComponent,
    Case360PageComponent,
    Case360HeaderComponent,
    ReAssignCaseComponent,
    CommonActionsComponent,
    SendLetterProfileComponent
    
  ],
  exports: [
    CasePageComponent,
    CaseListComponent,
    CaseNavigationComponent,
    LastVisitedCasesComponent,
    NewCaseComponent,
    CaseDetailPageComponent,
    Case360PageComponent,
    Case360HeaderComponent,
    ReAssignCaseComponent,
    CommonActionsComponent,
    SendLetterProfileComponent
    
  ],
})
export class CaseManagementFeatureCaseModule {}
