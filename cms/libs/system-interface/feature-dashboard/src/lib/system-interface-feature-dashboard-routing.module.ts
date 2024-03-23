import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemInterfaceDashboardPageComponent } from './containers/system-interface-dashboard-page/system-interface-dashboard-page.component';
import { WebServiceLogsPageComponent } from './containers/web-service-logs-page/web-service-logs-page.component';
import { BatchInterfaceLogsPageComponent } from './containers/batch-interface-logs-page/batch-interface-logs-page.component';
 

const routes: Routes = [
  {
    path: 'dashboard',
    component: SystemInterfaceDashboardPageComponent,
  },
  {
    path: 'web-service-logs',
    component: WebServiceLogsPageComponent,
  }, 
  {
    path: 'batch-interface-logs',
    component: BatchInterfaceLogsPageComponent,
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
  ], 
  exports: [RouterModule],
})

export class SystemInterfaceFeatureDashboardRoutingModule {}
