
import { Component,ChangeDetectionStrategy, Input, OnInit, ViewChild } from '@angular/core';
import { WidgetFacade, WidgetChartModel } from '@cms/dashboard/domain';
import {ChartComponent, PlaceholderDirective } from '@cms/shared/ui-common';
@Component({
  selector: 'cms-widget-client-by-status',
  templateUrl: './widget-client-by-status.component.html',
  styleUrls: ['./widget-client-by-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetClientByStatusComponent implements OnInit{
  @ViewChild(PlaceholderDirective, {static:true}) chartPlaceholder!:PlaceholderDirective;
  @Input() widgetChartConfig!:WidgetChartModel;
   constructor(private widgetFacade:WidgetFacade){
   }
   ngOnInit(): void {
     const chartview= this.chartPlaceholder.viewContainerRef;
     chartview.clear();
     const componentRef= chartview.createComponent(ChartComponent);
     componentRef.instance.chartConfig= this.widgetChartConfig;
       
   }
}
