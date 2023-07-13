import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundingSourcePageComponent } from './containers/funding-source-page/funding-source-page.component';
import { CaseManagementFeatureFinancialFundingSourcesRoutingModule } from './case-management-feature-financial-funding-sources.routing.module';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementDomainModule } from '@cms/case-management/domain';

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule, CaseManagementDomainModule, CaseManagementFeatureFinancialFundingSourcesRoutingModule],
  declarations: [FundingSourcePageComponent],
  exports: [FundingSourcePageComponent],
})
export class CaseManagementFeatureFinancialFundingSourcesModule {}
