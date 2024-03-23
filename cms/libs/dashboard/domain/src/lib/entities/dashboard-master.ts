import { Dashboard } from './dashboard';

export interface DashboardMaster {
  id: string;
  activeDashboardId: Number;
  dashboards: Dashboard[];
}
