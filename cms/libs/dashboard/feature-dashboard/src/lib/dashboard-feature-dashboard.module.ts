/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules**/
import { DashboardDomainModule } from '@cms/dashboard/domain';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { DashboardFeatureDashboardRoutingModule } from './dashboard-feature-dashboard-routing.module';
/** Components **/
import { DashboardPageComponent } from './containers/dashboard-page/dashboard-page.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardFeatureDashboardRoutingModule,
    DashboardDomainModule,
    SharedUiCommonModule,
    SharedUiTpaModule,
  ],
  declarations: [DashboardPageComponent],
  exports: [DashboardPageComponent],
})
export class DashboardFeatureDashboardModule {}
