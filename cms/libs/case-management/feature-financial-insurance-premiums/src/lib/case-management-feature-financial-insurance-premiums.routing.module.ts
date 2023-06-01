import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalPremiumsPageComponent } from './containers/medical-premiums/medical-premiums-page.component';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: '',
    component: MedicalPremiumsPageComponent,
    data: {
      title: '',
    },
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CaseManagementFeatureFinancialInsurancePremiumsRoutingModule { }
