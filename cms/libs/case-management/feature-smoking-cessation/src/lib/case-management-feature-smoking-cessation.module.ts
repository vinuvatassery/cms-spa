/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureSmokingCessationRoutingModule } from './case-management-feature-smoking-cessation-routing.module';
/** Components **/
import { SmokingCessationPageComponent } from './containers/smoking-cessation-page/smoking-cessation-page.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureSmokingCessationRoutingModule,
    SharedUiTpaModule,
  ],
  declarations: [SmokingCessationPageComponent],
  exports: [SmokingCessationPageComponent],
})
export class CaseManagementFeatureSmokingCessationModule {}
