import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamilyAndDependentPageComponent } from '@cms/case-management/feature-family-and-dependent';

const routes: Routes = [
  {
    path: '',
    component: FamilyAndDependentPageComponent,
  },
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
  ],  
  exports: [RouterModule],
})

export class CaseManagementFeatureFamilyAndDependentRoutingModule {}
