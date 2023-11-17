import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';

const routes: Routes = [
  {
    path: '',
    component: RemoteEntryComponent,
    children: [
      {
        outlet: 'financial-management-header',
        path: '',
        loadChildren: () =>
          import('@cms/case-management/feature-search').then(
            (m) => m.CaseManagementFeatureSearchModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('@cms/financial-management/feature-vendor').then(
            (m) => m.FinancialManagementFeatureVendorModule
          ),
      },
    ],
  },
];
@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [],
})
export class RemoteEntryModule {}
