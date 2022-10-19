/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { HealthcareProviderPageComponent } from './containers/healthcare-provider-page/healthcare-provider-page.component';

const routes: Routes = [
  {
    path: '',
    component: HealthcareProviderPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureHealthcareProviderRoutingModule {}
