import { Component, OnInit, ViewChild } from '@angular/core';
import { WidgetChartModel } from '@cms/dashboard/domain';
import { ChartComponent, PlaceholderDirective } from '@cms/shared/ui-common';

@Component({
  selector: 'cms-widget-program-income',
  templateUrl: './widget-program-income.component.html',
  styleUrls: ['./widget-program-income.component.scss']
})
export class WidgetProgramIncomeComponent implements OnInit {
  @ViewChild(PlaceholderDirective, {static:true}) chartPlaceholder!:PlaceholderDirective;
  incomeData:WidgetChartModel={
    chartType:'bar',
    title:{
      text:"Program Income"
    },
    legend:{
      position:'top',
      orientation:'horizontal'
    },
    categoryAxis:{
      categories:['Q1 2020', 'Q2 2020', 'Q3 2020', 'Q4 2020']
    },
    series:[{
      name:'Rebates',
      data:[12, 19, 3, 5],
      color:'skyblue',
      type:'bar'
    },
    {
      name:'Replenishment',
      data: [2, 3, 3, 5],
      color:'orange',
      type:'bar'
    }
  ]

  };

  constructor() { }

  ngOnInit(): void {
    const hostview= this.chartPlaceholder.viewContainerRef;
    hostview.clear();
    const componentRef= hostview.createComponent(ChartComponent);
    componentRef.instance.chartConfig= this.incomeData;

  }
}

