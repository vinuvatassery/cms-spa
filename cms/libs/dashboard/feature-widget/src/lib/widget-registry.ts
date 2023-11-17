import {
  WidgetDirectMessagesComponent,
  WidgetRecentlyViewedComponent,
} from '@cms/dashboard/feature-widget';
import { WidgetProgramExpensesComponent } from './widget-program-expenses/widget-program-expenses.component';
import { WidgetProgramIncomeComponent } from './widget-program-income/widget-program-income.component';

export const WidgetRegistry: { [key: string]: any } = {
  DirectMessages: WidgetDirectMessagesComponent,
  RecentlyViewed: WidgetRecentlyViewedComponent,
  ProgramExpenses: WidgetProgramExpensesComponent,
  ProgramIncome: WidgetProgramIncomeComponent
};

export const WIDGET_COMPONENT = [
  WidgetDirectMessagesComponent,
  WidgetRecentlyViewedComponent,
];
