/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { SendLetterPageComponent } from '@cms/case-management/feature-communication';
import { ClientEligibilityPageComponent } from './containers/client-eligibility-page/client-eligibility-page.component';
const routes: Routes = [
  {
    path: 'eligibility',
    component: ClientEligibilityPageComponent,
  },
  {
    path: 'send-letter',
    component: SendLetterPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureClientEligibilityRoutingModule {}
