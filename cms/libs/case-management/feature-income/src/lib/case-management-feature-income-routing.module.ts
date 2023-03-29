/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { IncomePageComponent } from './containers/income-page/income-page.component';
import { ProfileIncomePageComponent } from './containers/profile-income-page/profile-income-page.component';

const routes: Routes = [
  {
    path: '',
    component: IncomePageComponent,
  },
  {
    path: 'profile',
    component: ProfileIncomePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureIncomeRoutingModule {}
