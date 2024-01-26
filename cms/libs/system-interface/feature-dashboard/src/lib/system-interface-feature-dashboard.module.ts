import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemInterfaceDashboardPageComponent } from './containers/system-interface-dashboard-page/system-interface-dashboard-page.component';
import { SystemInterfaceFeatureDashboardRoutingModule } from './system-interface-feature-dashboard-routing.module';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SystemInterfaceActivityLogListsComponent } from './components/system-interface-activity-log-lists/system-interface-activity-log-lists.component';
import { WebServiceLogsComponent } from './components/web-service-logs/web-service-logs.component';
import { WebServiceLogsPageComponent } from './containers/web-service-logs-page/web-service-logs-page.component';

@NgModule({
  imports: [
    CommonModule,
    SystemInterfaceFeatureDashboardRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
  ],
  declarations: [
    SystemInterfaceDashboardPageComponent,
    SystemInterfaceActivityLogListsComponent,
    WebServiceLogsComponent,
    WebServiceLogsPageComponent,
  ],
  exports: [
    SystemInterfaceDashboardPageComponent,
    SystemInterfaceActivityLogListsComponent,
    WebServiceLogsComponent,
    WebServiceLogsPageComponent,
  ],
})
export class SystemInterfaceFeatureDashboardModule {}
