/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureEmploymentRoutingModule } from './case-management-feature-employment-routing.module';
/** Components **/
import { EmployerListComponent } from './components/employer-list/employer-list.component';
import { EmployerDetailComponent } from './components/employer-detail/employer-detail.component';
import { RemoveEmployerConfirmationComponent } from './components/remove-employer-confirmation/remove-employer-confirmation.component';
import { EmploymentPageComponent } from './containers/employment-page/employment-page.component';
import { ProfileEmploymentPageComponent } from './containers/profile-employment-page/profile-employment-page.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureEmploymentRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
  ],
  declarations: [
    EmployerListComponent,
    EmployerDetailComponent,
    RemoveEmployerConfirmationComponent,
    EmploymentPageComponent,
    ProfileEmploymentPageComponent,
  ],
  exports: [
    EmployerListComponent,
    EmployerDetailComponent,
    RemoveEmployerConfirmationComponent,
    ProfileEmploymentPageComponent
  ],
})
export class CaseManagementFeatureEmploymentModule {}
