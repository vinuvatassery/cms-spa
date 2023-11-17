import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FinancialManagementDomainModule } from '@cms/financial-management/domain';
import { VendorComponent } from './vendor.component';

const routes: Routes = [
  {
    path: '',
    component: VendorComponent,
    data: { title: 'Todo' },
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FinancialManagementDomainModule,
  ],
  declarations: [VendorComponent],
  exports: [VendorComponent],
})
export class FinancialManagementFeatureVendorModule {}
