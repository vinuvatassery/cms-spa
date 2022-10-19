/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { ExpensePageComponent } from './containers/expense-page/expense-page.component';

const routes: Routes = [
  {
    path: '',
    component: ExpensePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialManagementFeatureExpenseRoutingModule {}
