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
    data: {
      title: 'Dashboard',
    },
  },
  {
    path: 'web-service-files',
    component: WebServiceLogsPageComponent,
    data: {
      title: 'Web Service File Log',
    },
  }, 
  {
    path: 'batch-files',
    component: BatchInterfaceLogsPageComponent,
    data: {
      title: 'Batch File',
    },
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
