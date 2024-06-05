import { Dashboard } from './dashboard';

export interface DashboardMaster {
  id: string;
  activeDashboardId: number;
  dashboards: Dashboard[];
}
