import { Component, Input } from '@angular/core';
import { WidgetChartModel } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent{
  @Input() chartConfig!:WidgetChartModel;

}
