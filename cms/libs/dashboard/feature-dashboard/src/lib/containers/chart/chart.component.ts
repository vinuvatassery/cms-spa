import { Component, Input } from '@angular/core';
import { WidgetChartModel } from '@cms/dashboard/domain';

@Component({
  selector: 'dashboard-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent{
  @Input() chartConfig!:WidgetChartModel;

}
