/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { ApprovalPageComponent } from './containers/approval-page/approval-page.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureApprovalRoutingModule {}
