 
import { WidgetProgramExpensesComponent } from '../../../feature-dashboard/src/lib/components/widget-program-expenses/widget-program-expenses.component';
import { WidgetProgramIncomeComponent } from '../../../feature-dashboard/src/lib/components/widget-program-income/widget-program-income.component';
import { WidgetClientByStatusComponent } from '../../../feature-dashboard/src/lib/components/widget-client-by-status/widget-client-by-status.component';
import { WidgetNetIncomeComponent } from '../../../feature-dashboard/src/lib/components/widget-net-income/widget-net-income.component';
import { WidgetPremiumExpensesByInsuranceTypeComponent } from '../../../feature-dashboard/src/lib/components/widget-premium-expenses-by-insurance-type/widget-premium-expenses-by-insurance-type.component';
import { WidgetRentOveragesComponent } from '../../../feature-dashboard/src/lib/components/widget-rent-overages/widget-rent-overages.component';
import { WidgetSlotsAllocationComponent } from '../../../feature-dashboard/src/lib/components/widget-slots-allocation/widget-slots-allocation.component';
import { WidgetDirectMessagesComponent } from '../../../feature-dashboard/src/lib/components/widget-direct-messages/widget-direct-messages.component';
import { WidgetActiveClientsByGroupComponent } from '../../../feature-dashboard/src/lib/components/widget-active-clients-by-group/widget-active-clients-by-group.component';
import { WidgetApplicationsCersComponent } from '../../../feature-dashboard/src/lib/components/widget-applications-cers/widget-applications-cers.component';
import { WidgetLiheapComponent } from '../../../feature-dashboard/src/lib/components/widget-liheap/widget-liheap.component';
import { WidgetPharmacyClaimsComponent } from '../../../feature-dashboard/src/lib/components/widget-pharmacy-claims/widget-pharmacy-claims.component';
import { WidgetQuickLinksComponent } from '../../../feature-dashboard/src/lib/components/widget-quick-links/widget-quick-links.component';
import { WidgetRecentlyViewedComponent } from '../../../feature-dashboard/src/lib/components/widget-recently-viewed/widget-recently-viewed.component';
import { WidgetServiceTrackingComponent } from '../../../feature-dashboard/src/lib/components/widget-service-tracking/widget-service-tracking.component';
import { WidgetTodayAtAGlanceComponent } from '../../../feature-dashboard/src/lib/components/widget-today-at-a-glance/widget-today-at-a-glance.component';
import { WidgetInsuranceTypeFplComponent } from '../../../feature-dashboard/src/lib/components/widget-insurance-type-fpl/widget-insurance-type-fpl.component';

export const WidgetRegistry: { [key: string]: any } = {
  DirectMessages: WidgetDirectMessagesComponent,
  RecentlyViewed: WidgetRecentlyViewedComponent,
  ProgramExpenses: WidgetProgramExpensesComponent,
  ProgramIncome: WidgetProgramIncomeComponent,
  ClientByStatus:  WidgetClientByStatusComponent,
  TodayAtAGlance: WidgetTodayAtAGlanceComponent,
  ApplicationsCers: WidgetApplicationsCersComponent,
  QuickLinks: WidgetQuickLinksComponent,
  ActiveClientsByGroup: WidgetActiveClientsByGroupComponent,
  PharmacyClaims: WidgetPharmacyClaimsComponent,
  ServiceTracking: WidgetServiceTrackingComponent,
  Liheap: WidgetLiheapComponent,
  NetIncome: WidgetNetIncomeComponent, 
  PremiumExpensesByInsuranceType: WidgetPremiumExpensesByInsuranceTypeComponent,
  RentOverages: WidgetRentOveragesComponent, 
  SlotsAllocation: WidgetSlotsAllocationComponent,
  InsuranceTypeFpl: WidgetInsuranceTypeFplComponent
};

export const WIDGET_COMPONENT = [
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
  WidgetInsuranceTypeFplComponent
];
