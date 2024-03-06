import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemInterfaceDashboardPageComponent } from './containers/system-interface-dashboard-page/system-interface-dashboard-page.component';
import { SystemInterfaceFeatureDashboardRoutingModule } from './system-interface-feature-dashboard-routing.module';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SystemInterfaceActivityLogListsComponent } from './components/system-interface-activity-log-lists/system-interface-activity-log-lists.component';
import { WebServiceLogsComponent } from './components/web-service-logs/web-service-logs.component';
import { WebServiceLogsPageComponent } from './containers/web-service-logs-page/web-service-logs-page.component';
import { BatchInterfaceLogsPageComponent } from './containers/batch-interface-logs-page/batch-interface-logs-page.component';
import { BatchInterfaceLogsComponent } from './components/batch-Interface-logs/batch-Interface-logs.component';
import { ExceptionDetailComponent } from './components/exception-detail/exception-detail.component';
import { ClientRecordSentComponent } from './components/client-record-sent/client-record-sent.component';
import { CardRequestsComponent } from './components/card-requests/card-requests.component';
import { PrescriptionfillloadingComponent } from './components/prescriptionfillloading/prescriptionfillloading.component';
import { OrderDataComponent } from './components/order-data/order-data.component';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
const WidgetComponents = [
  CardRequestsComponent,
  ClientRecordSentComponent,
  OrderDataComponent,
  PrescriptionfillloadingComponent
];
@NgModule({
  imports: [
    CommonModule,
    SystemInterfaceFeatureDashboardRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    SharedUiTpaModule,
    GridsterModule,
    DynamicModule,
  ],
  declarations: [
    SystemInterfaceDashboardPageComponent,
    SystemInterfaceActivityLogListsComponent,
    WebServiceLogsComponent,
    WebServiceLogsPageComponent,
    BatchInterfaceLogsPageComponent,
    BatchInterfaceLogsComponent,
    ExceptionDetailComponent,
    ClientRecordSentComponent,
    CardRequestsComponent,
    PrescriptionfillloadingComponent,
    OrderDataComponent,
    WidgetComponents    

  ],
  exports: [
    SystemInterfaceDashboardPageComponent,
    SystemInterfaceActivityLogListsComponent,
    WebServiceLogsComponent,
    WebServiceLogsPageComponent,
    BatchInterfaceLogsPageComponent,
    BatchInterfaceLogsComponent,
    ExceptionDetailComponent,
    ClientRecordSentComponent,
    CardRequestsComponent,
    PrescriptionfillloadingComponent,
    OrderDataComponent,
    WidgetComponents    

  ],
})
export class SystemInterfaceFeatureDashboardModule {}
