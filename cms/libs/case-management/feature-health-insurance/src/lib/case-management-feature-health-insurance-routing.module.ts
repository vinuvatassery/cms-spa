/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { HealthInsurancePageComponent } from './containers/health-insurance-page/health-insurance-page.component';

const routes: Routes = [
  {
    path: '',
    component: HealthInsurancePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureHealthInsuranceRoutingModule {}
