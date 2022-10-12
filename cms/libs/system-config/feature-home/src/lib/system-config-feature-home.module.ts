import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren:() => import('@cms/system-config/feature-user-management')
    .then((m=>m.SystemConfigFeatureUserManagementModule)),
  },
];

@NgModule({
  imports: [CommonModule,RouterModule.forChild(routes),],
})
export class SystemConfigFeatureHomeModule {}
