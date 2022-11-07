/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { DentalInsurancePageComponent } from './containers/dental-insurance-page/dental-insurance-page.component';

const routes: Routes = [
  {
    path: '',
    component: DentalInsurancePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureDentalInsuranceRoutingModule {}
