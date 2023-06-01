import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { DentalClaimsPageComponent } from './containers/dental-claims/dental-claims-page.component';
import { CaseManagementFeatureFinancialDentalClaimsRoutingModule } from './case-management-feature-financial-dental-claims.module.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialDentalClaimsRoutingModule
  ],
  declarations: [DentalClaimsPageComponent]
})
export class CaseManagementFeatureFinancialDentalClaimsModule { }
