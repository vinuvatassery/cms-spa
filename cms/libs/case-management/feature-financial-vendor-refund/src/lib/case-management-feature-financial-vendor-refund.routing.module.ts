import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorRefundPageComponent } from './containers/vendor-refund-page/vendor-refund-page.component';

const routes = [
  {
    path: '',
    component: VendorRefundPageComponent,
    data: {
      title: '',
    },
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],

  exports: [RouterModule],
})
export class CaseManagementFeatureFinancialVendorRefundRoutingModule { }
