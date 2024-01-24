 
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WidgetChartModel, WidgetFacade } from '@cms/dashboard/domain'; 
import {  PlaceholderDirective } from '@cms/shared/ui-common';
import { Subject, takeUntil } from 'rxjs';
 
@Component({
  selector: 'dashboard-widget-net-income',
  templateUrl: './widget-net-income.component.html',
  styleUrls: ['./widget-net-income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetNetIncomeComponent implements OnInit, OnDestroy { 

  netIncome: any; 
  private destroy$ = new Subject<void>();
  constructor(private widgetFacade: WidgetFacade) {}

  ngOnInit(): void { 
    this.loadNetIncomeChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadNetIncomeChart() {
    this.widgetFacade.loadNetIncomeChart();
    this.widgetFacade.netIncomeChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.netIncome = response;
          }
        }
      });
  }
  }
 


