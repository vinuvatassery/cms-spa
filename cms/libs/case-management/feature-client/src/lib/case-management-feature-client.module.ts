import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { ClientComponent } from './client.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CaseManagementDomainModule,
  ],
  declarations: [ClientComponent],
  exports: [ClientComponent],
})
export class CaseManagementFeatureClientModule {}
