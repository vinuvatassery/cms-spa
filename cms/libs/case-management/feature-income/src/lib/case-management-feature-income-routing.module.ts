/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { IncomePageComponent } from './containers/income-page/income-page.component';

const routes: Routes = [
  {
    path: '',
    component: IncomePageComponent,
  },
  {
    path: 'profile',
    component: IncomePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureIncomeRoutingModule {}
