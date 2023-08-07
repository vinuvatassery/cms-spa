import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialPcasPageComponent } from './containers/financial-pcas-page/financial-pcas-page.component';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: '',
    component: FinancialPcasPageComponent,
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
export class CaseManagementFeatureFinancialPcasRoutingModule { }
