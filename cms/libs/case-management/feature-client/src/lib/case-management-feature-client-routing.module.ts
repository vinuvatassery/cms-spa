/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { ClientPageComponent } from './containers/client-page/client-page.component';
import { ProfileClientPageComponent } from './containers/profile-client-page/profile-client-page.component';

const routes: Routes = [
  {
    path: '',
    component: ClientPageComponent,
  },
  {
    path: 'profile',
    component: ProfileClientPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureClientRoutingModule {}
