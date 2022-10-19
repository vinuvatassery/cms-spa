/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { EmploymentPageComponent } from './containers/employment-page/employment-page.component';

const routes: Routes = [
  {
    path: '',
    component: EmploymentPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureEmploymentRoutingModule {}
