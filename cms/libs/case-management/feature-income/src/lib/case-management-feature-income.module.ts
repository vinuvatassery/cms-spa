/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureIncomeRoutingModule } from './case-management-feature-income-routing.module';
/** Components **/
import { IncomeListComponent } from './components/income-list/income-list.component';
import { IncomeDetailComponent } from './components/income-detail/income-detail.component';
import { RemoveIncomeConfirmationComponent } from './components/remove-income-confirmation/remove-income-confirmation.component';
import { IncomePageComponent } from './containers/income-page/income-page.component';
import { ProfileIncomePageComponent } from './containers/profile-income-page/profile-income-page.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureIncomeRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
  ],
  declarations: [
    IncomeListComponent,
    IncomeDetailComponent,
    RemoveIncomeConfirmationComponent,
    IncomePageComponent,
    ProfileIncomePageComponent,
  ],
  exports: [
    IncomeListComponent,
    IncomeDetailComponent,
    RemoveIncomeConfirmationComponent,
    ProfileIncomePageComponent
  ],
})
export class CaseManagementFeatureIncomeModule {}
