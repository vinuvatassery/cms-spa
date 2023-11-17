import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFeatureWidgetModule } from '@cms/dashboard/feature-widget';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';

@NgModule({
  imports: [CommonModule, GridsterModule, DynamicModule],
  declarations: [DashboardWrapperComponent],
  exports: [DashboardWrapperComponent],
})
export class DashboardUiModule {}
