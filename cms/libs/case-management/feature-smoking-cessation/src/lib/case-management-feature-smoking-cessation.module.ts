/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureSmokingCessationRoutingModule } from './case-management-feature-smoking-cessation-routing.module';
/** Components **/
import { SmokingCessationPageComponent } from './containers/smoking-cessation-page/smoking-cessation-page.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ProfileSmokingCessationPageComponent } from './containers/profile-smoking-cessation-page/profile-smoking-cessation-page.component';
import { SmokingCessationListComponent } from './components/smoking-cessation-list/smoking-cessation-list.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureSmokingCessationRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule 
  ],
  declarations: [SmokingCessationPageComponent, 
    ProfileSmokingCessationPageComponent,
    SmokingCessationListComponent],
  exports: [SmokingCessationPageComponent,
    ProfileSmokingCessationPageComponent,
    SmokingCessationListComponent],
})
export class CaseManagementFeatureSmokingCessationModule {}
