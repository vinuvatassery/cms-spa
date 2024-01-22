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
// import { DashboardFeatureWidgetModule } from '@cms/dashboard/feature-widget'; 
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { ChartComponent } from './containers/chart/chart.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardFeatureDashboardRoutingModule,
    DashboardDomainModule,
    SharedUiCommonModule,
    SharedUiTpaModule,  
    GridsterModule,
    DynamicModule,
  ],
  declarations: [DashboardPageComponent, ChartComponent],
  exports: [DashboardPageComponent, ChartComponent],
})
export class DashboardFeatureDashboardModule {}
