import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReplenishmentPageComponent } from './containers/replenishment-page/replenishment-page.component';

const routes: Routes = [
  {
    path: '',
    component: ReplenishmentPageComponent,
    data: {
      title: '',
    },
  },];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})

export class CaseManagementFeatureFinancialReplenishmentRoutingModule { }
