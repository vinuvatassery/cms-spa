import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PharmacyClaimsPageComponent } from './containers/pharmacy-claims/pharmacy-claims-page.component';

const routes = [
  {
    path: '',
    component: PharmacyClaimsPageComponent,
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
export class CaseManagementFeatureFinancialPharmacyClaimsRoutingModule { }
