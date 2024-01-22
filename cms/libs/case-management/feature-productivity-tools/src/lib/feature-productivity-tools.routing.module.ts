import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductivityToolsPageComponent } from './container/productivity-tools-page/productivity-tools-page.component';

const routes: Routes = [
  {
    path: '',
    component: ProductivityToolsPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'approval',
    loadChildren: () =>
      import('@cms/case-management/feature-approval').then(
        (m) => m.CaseManagementFeatureApprovalModule
      ),
    data: {
      title: 'Pending Approvals',
    },
  },
  
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureProductivityToolsRoutingModule {}
