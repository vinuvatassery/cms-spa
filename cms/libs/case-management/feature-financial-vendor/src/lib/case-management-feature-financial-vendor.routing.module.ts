/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialVendorPageComponent } from './containers/financial-vendor-page/financial-vendor-page.component';
import { FinancialVendorProfileComponent } from './containers/financial-vendor-profile/financial-vendor-profile.component';
import { FinancialProviderProfileComponent } from './containers/financial-provider-profile/financial-provider-profile.component';
/** Components **/

const routes: Routes = [
  {
    path: '',
    component: FinancialVendorPageComponent,
  },
  {
    path: 'profile',
    component: FinancialVendorProfileComponent,
  },
  {
    path: 'provider-profile',
    component: FinancialProviderProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureFinancialVendorRoutingModule {}
