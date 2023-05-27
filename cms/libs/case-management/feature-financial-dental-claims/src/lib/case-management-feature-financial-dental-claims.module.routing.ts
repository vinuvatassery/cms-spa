import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DentalClaimsPageComponent } from './containers/dental-claims/dental-claims-page.component';

const routes: Routes = [
  {
    path: '',
    component: DentalClaimsPageComponent,
    data: {
      title: '',
    },
  }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CaseManagementFeatureFinancialDentalClaimsRoutingModule { }
