import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ReplenishmentPageComponent } from './containers/replenishment-page/replenishment-page.component';
import { CaseManagementFeatureFinancialReplenishmentRoutingModule } from './case-management-feature-financial-replenishment.routing.module';

@NgModule({
  imports: [CommonModule,
    CaseManagementFeatureFinancialReplenishmentRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
  ],
  declarations: [
    ReplenishmentPageComponent,
  ],
})
export class CaseManagementFeatureFinancialReplenishmentModule {}
