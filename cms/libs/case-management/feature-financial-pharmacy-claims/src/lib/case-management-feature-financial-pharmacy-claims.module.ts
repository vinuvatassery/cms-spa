import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementFeatureFinancialPharmacyClaimsRoutingModule } from './case-management-feature-financial-pharmacy-claims.routing.module';
import { PharmacyClaimsPageComponent } from './containers/pharmacy-claims/pharmacy-claims-page.component';

@NgModule({
  imports: [CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialPharmacyClaimsRoutingModule
  ],
  declarations:[PharmacyClaimsPageComponent]
})
export class CaseManagementFeatureFinancialPharmacyClaimsModule {}
