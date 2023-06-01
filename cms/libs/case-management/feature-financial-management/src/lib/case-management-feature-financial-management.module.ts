import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';

import { FinancialPageComponent } from './containers/financial-page/financial-page.component';
import { FinancialNavigationComponent } from './components/financial-navigation/financial-navigation.component';

import { CaseManagementFeatureFinancialManagementRoutingModule } from './case-management-feature-financial-management.routing.module';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialManagementRoutingModule,
  ],
  declarations: [FinancialPageComponent, FinancialNavigationComponent],
  exports: [FinancialPageComponent, FinancialNavigationComponent],
})
export class CaseManagementFeatureFinancialManagementModule {}
