/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components  **/
import { AuthorizationPageComponent } from './containers/authorization-page/authorization-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthorizationPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureAuthorizationRoutingModule {}
