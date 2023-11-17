import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetDirectMessagesComponent } from './widget-direct-messages/widget-direct-messages.component';
import { WidgetRecentlyViewedComponent } from './widget-recently-viewed/widget-recently-viewed.component';
import { SharedUiKendoModule } from '@cms/shared/ui-kendo';
import { WidgetProgramExpensesComponent } from './widget-program-expenses/widget-program-expenses.component';
import { FormsModule } from '@angular/forms';
import { WidgetProgramIncomeComponent } from './widget-program-income/widget-program-income.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
// import { WIDGET_COMPONENT } from '@cms/dashboard/domain';

// import { COMPONENTS } from './conponent-config';

const COMPONENTS = [
  WidgetDirectMessagesComponent,
  WidgetRecentlyViewedComponent,
  WidgetProgramExpensesComponent,
  WidgetProgramIncomeComponent
];

@NgModule({
  imports: [CommonModule, SharedUiKendoModule, FormsModule, SharedUiCommonModule],
  declarations: [COMPONENTS],
})
export class DashboardFeatureWidgetModule {
}
