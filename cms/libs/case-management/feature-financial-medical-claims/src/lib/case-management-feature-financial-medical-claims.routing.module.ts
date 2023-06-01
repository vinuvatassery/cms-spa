import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialMedicalClaimsPageComponent } from './containers/medical-claims-page/medical-claims-page.component';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: '',
    component: FinancialMedicalClaimsPageComponent,
    data: {
      title: '',
    },
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class CaseManagementFeatureFinancialMedicalClaimsRoutingModule { }
