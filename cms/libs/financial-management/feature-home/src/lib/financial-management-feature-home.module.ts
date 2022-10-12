import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'vendor',
    loadChildren:() => import('@cms/financial-management/feature-vendor')
    .then((m=>m.FinancialManagementFeatureVendorModule)),
  },
  {
    path: '',
    redirectTo: 'vendor',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class FinancialManagementFeatureHomeModule {}
