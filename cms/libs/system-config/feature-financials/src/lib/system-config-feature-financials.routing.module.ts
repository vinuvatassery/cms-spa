import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
 
import { ExpenseTypePageComponent } from './containers/expense-type-page/expense-type-page.component';
import { FundsPageComponent } from './containers/funds-page/funds-page.component';
import { IncomeTypesPageComponent } from './containers/income-types-page/income-types-page.component';
import { IndexPageComponent } from './containers/index-page/index-page.component';
import { PcaCodesPageComponent } from './containers/pca-codes-page/pca-codes-page.component';

const routes: Routes = [
  {
    path: ' ',
    component: FundsPageComponent,
 
  }, 
  {
    path: 'expense-types',
    component: ExpenseTypePageComponent,
  },
  {
    path: 'funds',
    component: FundsPageComponent,
  },
  {
    path: 'income-types',
    component: IncomeTypesPageComponent,
  },
  {
    path: 'pca-codes',
    component: PcaCodesPageComponent,
  },
  {
    path: 'index',
    component: IndexPageComponent,
  },
 
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureFinancialsRoutingModule {}
