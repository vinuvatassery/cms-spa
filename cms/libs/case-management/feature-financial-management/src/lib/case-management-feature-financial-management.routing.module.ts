import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialPageComponent } from './containers/financial-page/financial-page.component';

const routes: Routes = [
  {
    path: '',
    component: FinancialPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'vendors',
    loadChildren: () =>
      import('@cms/case-management/feature-financial-vendor').then(
        (m) => m.CaseManagementFeatureFinancialVendorModule
      ),
    data: {
      title: '',
    },
  },
  {
    path: 'replenishment',
    loadChildren: () =>
      import('@cms/case-management/feature-financial-replenishment').then(
        (m) => m.CaseManagementFeatureFinancialReplenishmentModule
      ),
    data: {
      title: null,
    },
  },
  {
    path: 'vendor-refund',
    loadChildren: () =>
      import('@cms/case-management/feature-financial-vendor-refund').then(
        (m) => m.CaseManagementFeatureFinancialVendorRefundModule
      ),
    data: {
      title: 'Vendor Refund(s)',
    },
  },
  {
    path: 'claims/:type',
    loadChildren: () =>
      import('@cms/case-management/feature-financial-claims').then(
        (m) => m.CaseManagementFeatureFinancialClaimsModule
      ),
    data: {
      title: null, 
    },
  },

  {
    path: 'premiums/:type',
    loadChildren: () =>
      import('@cms/case-management/feature-financial-premiums').then(
        (m) => m.CaseManagementFeatureFinancialPremiumsModule
      ),
    data: {
      title: null, 
    },
  },
 
  {
    path: 'pharmacy-claims',
    loadChildren: () =>
      import('@cms/case-management/feature-financial-pharmacy-claims').then(
        (m) => m.CaseManagementFeatureFinancialPharmacyClaimsModule
      ),
    data: {
      title: null,
    },
  },
  {
    path: 'funding-sources',
    loadChildren: () =>
      import('@cms/case-management/feature-financial-funding-sources').then(
        (m) => m.CaseManagementFeatureFinancialFundingSourcesModule
      ),
    data: {
      title: null,
    },
  },
  {
    path: 'pcas',
    loadChildren: () =>
      import('@cms/case-management/feature-financial-pcas').then(
        (m) => m.CaseManagementFeatureFinancialPcasModule
      ),
    data: {
      title: "PCA's",
    },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureFinancialManagementRoutingModule {}
