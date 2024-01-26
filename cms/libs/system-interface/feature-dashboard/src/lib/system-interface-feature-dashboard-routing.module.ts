import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemInterfaceDashboardPageComponent } from './containers/system-interface-dashboard-page/system-interface-dashboard-page.component';
import { WebServiceLogsPageComponent } from './containers/web-service-logs-page/web-service-logs-page.component';
 

const routes: Routes = [
  {
    path: '',
    component: SystemInterfaceDashboardPageComponent,
  },
  {
    path: 'web-service-logs',
    component: WebServiceLogsPageComponent,
  },
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
  ], 
  exports: [RouterModule],
})

export class SystemInterfaceFeatureDashboardRoutingModule {}
