import { DashboardConfig } from './dashboard-config';
import { DashboardContent } from './dashboard-content';

export interface Dashboard {
  dashboardId: number;
  dashboardName: string;
  dashboardConfig: DashboardConfig;
  dashboardContent: DashboardContent[];
}
