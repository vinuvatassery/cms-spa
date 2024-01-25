import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemInterfaceDashboardPageComponent } from './containers/system-interface-dashboard-page/system-interface-dashboard-page.component';
import { SystemInterfaceFeatureDashboardRoutingModule } from './system-interface-feature-dashboard-routing.module';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SystemInterfaceActivityLogListsComponent } from './components/system-interface-activity-log-lists/system-interface-activity-log-lists.component';
import { WebServiceLogComponent } from './components/web-service-log/web-service-log.component';

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
    WebServiceLogComponent,
  ],
  exports: [
    SystemInterfaceDashboardPageComponent,
    SystemInterfaceActivityLogListsComponent,
  ],
})
export class SystemInterfaceFeatureDashboardModule {}
