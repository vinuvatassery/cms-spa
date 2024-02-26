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
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { WidgetActiveClientsByGroupComponent } from './components/widget-active-clients-by-group/widget-active-clients-by-group.component';
import { WidgetApplicationsCersComponent } from './components/widget-applications-cers/widget-applications-cers.component';
import { WidgetClientByStatusComponent } from './components/widget-client-by-status/widget-client-by-status.component';
import { WidgetDirectMessagesComponent } from './components/widget-direct-messages/widget-direct-messages.component';
import { WidgetInsuranceTypeFplComponent } from './components/widget-insurance-type-fpl/widget-insurance-type-fpl.component';
import { WidgetLiheapComponent } from './components/widget-liheap/widget-liheap.component';
import { WidgetNetIncomeComponent } from './components/widget-net-income/widget-net-income.component';
import { WidgetPharmacyClaimsComponent } from './components/widget-pharmacy-claims/widget-pharmacy-claims.component';
import { WidgetPremiumExpensesByInsuranceTypeComponent } from './components/widget-premium-expenses-by-insurance-type/widget-premium-expenses-by-insurance-type.component';
import { WidgetProgramExpensesComponent } from './components/widget-program-expenses/widget-program-expenses.component';
import { WidgetProgramIncomeComponent } from './components/widget-program-income/widget-program-income.component';
import { WidgetQuickLinksComponent } from './components/widget-quick-links/widget-quick-links.component';
import { WidgetRecentlyViewedComponent } from './components/widget-recently-viewed/widget-recently-viewed.component';
import { WidgetRentOveragesComponent } from './components/widget-rent-overages/widget-rent-overages.component';
import { WidgetServiceTrackingComponent } from './components/widget-service-tracking/widget-service-tracking.component';
import { WidgetSlotsAllocationComponent } from './components/widget-slots-allocation/widget-slots-allocation.component';
import { WidgetTodayAtAGlanceComponent } from './components/widget-today-at-a-glance/widget-today-at-a-glance.component';

const WidgetComponents = [
  WidgetDirectMessagesComponent,
  WidgetRecentlyViewedComponent,
  WidgetProgramExpensesComponent,
  WidgetProgramIncomeComponent,
  WidgetClientByStatusComponent,
  WidgetTodayAtAGlanceComponent,
  WidgetApplicationsCersComponent,
  WidgetQuickLinksComponent,
  WidgetActiveClientsByGroupComponent,
  WidgetPharmacyClaimsComponent,
  WidgetServiceTrackingComponent,
  WidgetLiheapComponent,
  WidgetNetIncomeComponent,
  WidgetPremiumExpensesByInsuranceTypeComponent,
  WidgetRentOveragesComponent,
  WidgetSlotsAllocationComponent,
  WidgetInsuranceTypeFplComponent,
];

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
  declarations: [
    DashboardPageComponent,
    WidgetComponents    
  ],
  exports: [
    DashboardPageComponent,
    WidgetComponents    
  ],
})
export class DashboardFeatureDashboardModule {}
