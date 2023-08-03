import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementFeatureFinancialMedicalClaimsRoutingModule } from './case-management-feature-financial-medical-claims.routing.module';
import { FinancialMedicalClaimsPageComponent } from './containers/medical-claims-page/medical-claims-page.component';


@NgModule({
  imports: [CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialMedicalClaimsRoutingModule
  ],
  declarations: [
    FinancialMedicalClaimsPageComponent,
  ],
})
export class CaseManagementFeatureFinancialMedicalClaimsModule {}
