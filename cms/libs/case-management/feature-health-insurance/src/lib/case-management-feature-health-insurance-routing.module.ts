/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { HealthInsurancePageComponent } from './containers/health-insurance-page/health-insurance-page.component';
import { ProfileHealthInsurancePageComponent } from './containers/profile-healthe-insurance/profile-health-insurance-page.component';

const routes: Routes = [
  {
    path: '',
    component: HealthInsurancePageComponent,
  },
  {
    path: 'profile',
    component: ProfileHealthInsurancePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureHealthInsuranceRoutingModule {}
