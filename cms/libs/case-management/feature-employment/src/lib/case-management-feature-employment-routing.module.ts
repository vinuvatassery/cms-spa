/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { EmploymentPageComponent } from './containers/employment-page/employment-page.component';
import { ProfileEmploymentPageComponent } from './containers/profile-employment-page/profile-employment-page.component';

const routes: Routes = [
  {
    path: '',
    component: EmploymentPageComponent,
  },
  {
    path: 'profile',
    component: ProfileEmploymentPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureEmploymentRoutingModule {}
