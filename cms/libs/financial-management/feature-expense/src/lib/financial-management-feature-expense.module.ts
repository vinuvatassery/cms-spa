/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { FinancialManagementDomainModule } from '@cms/financial-management/domain';
import { FinancialManagementFeatureExpenseRoutingModule } from './financial-management-feature-expense-routing.module';
/** Components **/
import { ExpensePageComponent } from './containers/expense-page/expense-page.component';

@NgModule({
  imports: [
    CommonModule,
    FinancialManagementDomainModule,
    FinancialManagementFeatureExpenseRoutingModule,
  ],
  declarations: [ExpensePageComponent],
  exports: [ExpensePageComponent],
})
export class FinancialManagementFeatureExpenseModule {}
