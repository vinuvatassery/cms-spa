/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { VendorPageComponent } from './containers/vendor-page/vendor-page.component';

const routes: Routes = [
  {
    path: '',
    component: VendorPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialManagementFeatureVendorRoutingModule {}
