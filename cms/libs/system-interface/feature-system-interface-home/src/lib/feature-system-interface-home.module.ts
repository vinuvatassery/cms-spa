import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'activity-log',
    loadChildren: () =>
      import('@cms/system-interface/feature-dashboard').then(
        (m) => m.SystemInterfaceFeatureDashboardModule
      ),    
      data: {
        title: '',
      },
  },
  {
    path: 'support',
    loadChildren: () =>
      import('@cms/system-interface/feature-interface-support').then(
        (m) => m.SystemInterfaceFeatureInterfaceSupportModule
      ),
  },

];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class FeatureSystemInterfaceHomeModule {}
