import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementFeatureFinancialInsurancePremiumsRoutingModule } from './case-management-feature-financial-insurance-premiums.routing.module';
import { MedicalPremiumsPageComponent } from './containers/medical-premiums/medical-premiums-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialInsurancePremiumsRoutingModule
  ],
  declarations: [MedicalPremiumsPageComponent]
})
export class CaseManagementFeatureFinancialInsurancePremiumsModule { }
