/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SystemConfigFeatureUserManagementModule } from '@cms/system-config/feature-user-management';
import { CaseManagementFeatureVerificationRoutingModule } from './case-management-feature-verification-routing.module';
/** Components **/
import { HivVerificationComponent } from './components/hiv-verification/hiv-verification.component';
import { HivVerificationRequestComponent } from './components/hiv-verification-request/hiv-verification-request.component';
import { VerificationPageComponent } from './containers/verification-page/verification-page.component';
import { HivVerificationReviewComponent } from './components/hiv-verification-review/hiv-verification-review.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { HivVerificationAttachmentRemovalConfirmationComponent } from './components/hiv-verification-attachment-removal-confirmation/hiv-verification-attachment-removal-confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureVerificationRoutingModule,
    SharedUiTpaModule,
    SystemConfigFeatureUserManagementModule,
    SharedUiCommonModule,
  ],
  declarations: [
    HivVerificationComponent,
    HivVerificationRequestComponent,
    VerificationPageComponent,
    HivVerificationReviewComponent,
    HivVerificationAttachmentRemovalConfirmationComponent,
  ],
  exports: [
    HivVerificationComponent,
    HivVerificationRequestComponent,
    HivVerificationReviewComponent,
    HivVerificationAttachmentRemovalConfirmationComponent,
  ],
})
export class CaseManagementFeatureVerificationModule {}
