import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundingSourcePageComponent } from './containers/funding-source-page/funding-source-page.component';
import { CaseManagementFeatureFinancialFundingSourcesRoutingModule } from './case-management-feature-financial-funding-sources.routing.module';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementDomainModule } from '@cms/case-management/domain'; 
import { FinancialFundingSourcesDetailsComponent } from './components/financial-funding-sources-details/financial-funding-sources-details.component';
import { FinancialFundingSourcesListComponent } from './components/financial-funding-sources-list/financial-funding-sources-list.component';
import { FinancialFundingSourcesRemoveComponent } from './components/financial-funding-sources-remove/financial-funding-sources-remove.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureFinancialFundingSourcesRoutingModule,
  ],
  declarations: [
    FundingSourcePageComponent, 
    FinancialFundingSourcesDetailsComponent,
    FinancialFundingSourcesListComponent,
    FinancialFundingSourcesRemoveComponent,
  ],
  exports: [FundingSourcePageComponent,],
})
export class CaseManagementFeatureFinancialFundingSourcesModule {}
