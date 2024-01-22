import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetDirectMessagesComponent } from './components/widget-direct-messages/widget-direct-messages.component';
import { WidgetRecentlyViewedComponent } from './components/widget-recently-viewed/widget-recently-viewed.component';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { WidgetProgramExpensesComponent } from './components/widget-program-expenses/widget-program-expenses.component';
import { FormsModule } from '@angular/forms';
import { WidgetProgramIncomeComponent } from './components/widget-program-income/widget-program-income.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { WidgetClientByStatusComponent } from './components/widget-client-by-status/widget-client-by-status.component';
import { WidgetTodayAtAGlanceComponent } from './components/widget-today-at-a-glance/widget-today-at-a-glance.component';
import { WidgetApplicationsCersComponent } from './components/widget-applications-cers/widget-applications-cers.component';
import { WidgetQuickLinksComponent } from './components/widget-quick-links/widget-quick-links.component';
import { WidgetActiveClientsByGroupComponent } from './components/widget-active-clients-by-group/widget-active-clients-by-group.component';
import { WidgetPharmacyClaimsComponent } from './components/widget-pharmacy-claims/widget-pharmacy-claims.component';
import { WidgetServiceTrackingComponent } from './components/widget-service-tracking/widget-service-tracking.component';
import { WidgetLiheapComponent } from './components/widget-liheap/widget-liheap.component';
// import { WIDGET_COMPONENT } from '@cms/dashboard/domain';

// import { COMPONENTS } from './conponent-config';

const COMPONENTS = [
  WidgetDirectMessagesComponent,
  WidgetRecentlyViewedComponent,
  WidgetProgramExpensesComponent,
  WidgetProgramIncomeComponent,
];

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, FormsModule, SharedUiCommonModule],
  declarations: [
    COMPONENTS,
    WidgetClientByStatusComponent,
    WidgetTodayAtAGlanceComponent,
    WidgetApplicationsCersComponent,
    WidgetQuickLinksComponent,
    WidgetActiveClientsByGroupComponent,
    WidgetPharmacyClaimsComponent,
    WidgetServiceTrackingComponent,
    WidgetLiheapComponent,
  ],
  exports: [
    WidgetClientByStatusComponent,
    WidgetTodayAtAGlanceComponent,
    WidgetApplicationsCersComponent,
    WidgetQuickLinksComponent,
    WidgetActiveClientsByGroupComponent,
    WidgetPharmacyClaimsComponent,
    WidgetServiceTrackingComponent,
    WidgetLiheapComponent,
  ],
})
export class DashboardFeatureWidgetModule {}
