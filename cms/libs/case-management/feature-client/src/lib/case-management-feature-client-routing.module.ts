/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { ClientPageComponent } from './containers/client-page/client-page.component';


const routes: Routes = [
  {
    path: '',
    component: ClientPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureClientRoutingModule {}
