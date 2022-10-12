/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { VerificationPageComponent } from './containers/verification-page/verification-page.component';

const routes: Routes = [
  {
    path: 'hiv-verification',
    component: VerificationPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureVerificationRoutingModule {}
