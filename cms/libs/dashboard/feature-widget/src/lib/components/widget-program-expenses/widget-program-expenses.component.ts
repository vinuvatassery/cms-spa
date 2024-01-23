import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WidgetFacade, WidgetChartModel } from '@cms/dashboard/domain';
import { DashboardChartComponent } from '@cms/dashboard/feature-dashboard';
import {  PlaceholderDirective } from '@cms/shared/ui-common';
// import { KendoInput } from '@progress/kendo-angular-common';


@Component({
  selector: 'cms-widget-program-expenses',
  templateUrl: './widget-program-expenses.component.html',
  styleUrls: ['./widget-program-expenses.component.scss']
})

export class WidgetProgramExpensesComponent implements OnInit  {
 @ViewChild(PlaceholderDirective, {static:true}) chartPlaceholder!:PlaceholderDirective;
 @Input() widgetChartConfig!:WidgetChartModel;
  constructor(private widgetFacade:WidgetFacade){
  }
  ngOnInit(): void {
    const chartview= this.chartPlaceholder.viewContainerRef;
    chartview.clear();
    const componentRef= chartview.createComponent(DashboardChartComponent);
    componentRef.instance.chartConfig= this.widgetChartConfig;
      
  }
}
