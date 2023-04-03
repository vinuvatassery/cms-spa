/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileCerTrackingPageComponent } from './containers/profile-cer-tracking-page/profile-cer-tracking-page.component';

const routes: Routes = [ 
  {
    path: 'profile',
    component: ProfileCerTrackingPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureCerTrackingRoutingModule {}
