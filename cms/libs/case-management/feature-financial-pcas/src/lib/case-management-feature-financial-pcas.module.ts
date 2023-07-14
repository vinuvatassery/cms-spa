import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CaseManagementFeatureFinancialPcasRoutingModule } from './case-management-feature-financial-pcas.routing.module';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { FinancialPcasPageComponent } from './containers/financial-pcas-page/financial-pcas-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    RouterModule,
    CaseManagementFeatureFinancialPcasRoutingModule,
  ],
  declarations: [FinancialPcasPageComponent],
})
export class CaseManagementFeatureFinancialPcasModule {}
