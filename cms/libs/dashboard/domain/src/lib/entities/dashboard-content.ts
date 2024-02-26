
import { WidgetChartModel } from './widget-chart';

export interface DashboardContent {
  id:number,
  cols: number;
  rows: number;
  y: number;
  x: number; 
  component?: any;
  isVisible:boolean;
  widgetChartConfig?:WidgetChartModel
};
