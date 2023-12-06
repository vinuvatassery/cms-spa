import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemInterfaceDashboardPageComponent } from './containers/system-interface-dashboard-page/system-interface-dashboard-page.component';
import { SystemInterfaceFeatureDashboardRoutingModule } from './system-interface-feature-dashboard-routing.module';

@NgModule({
  imports: [CommonModule, SystemInterfaceFeatureDashboardRoutingModule],
  declarations: [SystemInterfaceDashboardPageComponent, ],
  exports: [SystemInterfaceDashboardPageComponent],
})
export class SystemInterfaceFeatureDashboardModule {}
