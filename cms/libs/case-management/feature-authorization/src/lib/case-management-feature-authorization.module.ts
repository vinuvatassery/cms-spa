/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SystemConfigFeatureUserManagementModule } from '@cms/system-config/feature-user-management';
import { CaseManagementFeatureCommunicationModule } from '@cms/case-management/feature-communication';
import { CaseManagementFeatureAuthorizationRoutingModule } from './case-management-feature-authorization-routing.module';
/** Components  **/
import { AuthorizationNoticeComponent } from './components/authorization-notice/authorization-notice.component';
import { AuthorizationPageComponent } from './containers/authorization-page/authorization-page.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureAuthorizationRoutingModule,
    SharedUiCommonModule,
    SharedUiTpaModule,
    SystemConfigFeatureUserManagementModule,
    CaseManagementFeatureCommunicationModule,
  ],
  declarations: [
    AuthorizationNoticeComponent,
    AuthorizationPageComponent,
    AuthorizationComponent,
  ],
  exports: [
    AuthorizationNoticeComponent,
    AuthorizationPageComponent,
    AuthorizationComponent,
  ],
})
export class CaseManagementFeatureAuthorizationModule {}
