import { Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { WidgetChartModel, WidgetFacade } from '@cms/dashboard/domain'; 
import {  PlaceholderDirective } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'dashboard-widget-program-income',
  templateUrl: './widget-program-income.component.html',
  styleUrls: ['./widget-program-income.component.scss']
})
export class WidgetProgramIncomeComponent implements OnInit, OnDestroy {
    
  programIncome: any; 
  private destroy$ = new Subject<void>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
 
  dataYear  = ['Last Year','2023']
  constructor(private widgetFacade: WidgetFacade) {}

  ngOnInit(): void { 
    this.loadProgramIncomeChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadProgramIncomeChart() {
    this.widgetFacade.loadProgramIncomeChart();
    this.widgetFacade.programIncomeChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.programIncome = response;
          }
        }
      });
  }
}

