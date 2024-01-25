import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemInterfaceDashboardPageComponent } from './containers/system-interface-dashboard-page/system-interface-dashboard-page.component';
import { WebServiceLogsComponent } from './components/web-service-logs/web-service-logs.component';
 

const routes: Routes = [
  {
    path: '',
    component: SystemInterfaceDashboardPageComponent,
  },
  {
    path: 'web-service-logs',
    component: WebServiceLogsComponent,
  },
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
  ], 
  exports: [RouterModule],
})

export class SystemInterfaceFeatureDashboardRoutingModule {}
