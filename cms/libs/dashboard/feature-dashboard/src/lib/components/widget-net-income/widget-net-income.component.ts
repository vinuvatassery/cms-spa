 
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import {  WidgetFacade } from '@cms/dashboard/domain';  
import { UIFormStyle } from '@cms/shared/ui-tpa';
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
  public formUiStyle: UIFormStyle = new UIFormStyle();
  data = ['2023','2022']
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
 


