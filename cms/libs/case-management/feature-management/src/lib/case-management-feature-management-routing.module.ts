/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { ManagementPageComponent } from './containers/management-page/management-page.component';
const routes: Routes = [
  {
    path: '',
    component: ManagementPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureManagementRoutingModule {}
