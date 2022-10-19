/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { FinancialManagementDomainModule } from '@cms/financial-management/domain';
import { FinancialManagementFeatureIncomeRoutingModule } from './financial-management-feature-income-routing.module';
/** Components **/
import { IncomePageComponent } from './containers/income-page/income-page.component';

@NgModule({
  imports: [
    CommonModule,
    FinancialManagementDomainModule,
    FinancialManagementFeatureIncomeRoutingModule,
  ],
  declarations: [IncomePageComponent],
  exports: [IncomePageComponent],
})
export class FinancialManagementFeatureIncomeModule {}
