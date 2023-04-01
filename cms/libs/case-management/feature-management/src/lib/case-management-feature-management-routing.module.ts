/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { ManagementPageComponent } from './containers/management-page/management-page.component';
import { ProfileManagementPageComponent } from './containers/profile-management-page/profile-management-page.component';
const routes: Routes = [
  {
    path: '',
    component: ManagementPageComponent,
  },
  {
    path: 'profile',
    component: ProfileManagementPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureManagementRoutingModule {}
