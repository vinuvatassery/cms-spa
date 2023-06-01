import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementFeatureFinancialDentalPremiumsRoutingModule } from './case-management-feature-financial-dental-premiums.routing.module';
import { DentalPremiumsPageComponent } from './containers/dental-premiums/dental-premiums-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialDentalPremiumsRoutingModule
  ],
  declarations: [DentalPremiumsPageComponent]
})
export class CaseManagementFeatureFinancialDentalPremiumsModule { }
