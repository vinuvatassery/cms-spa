import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@cms/system-interface/feature-dashboard').then(
        (m) => m.SystemInterfaceFeatureDashboardModule
      ),
      data: {
        title: 'System Interface Dashboard',
      },
  },
  {
    path: 'support',
    loadChildren: () =>
      import('@cms/system-interface/feature-interface-support').then(
        (m) => m.SystemInterfaceFeatureInterfaceSupportModule
      ),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class FeatureSystemInterfaceHomeModule {}
