import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WidgetFacade, WidgetChartModel } from '@cms/dashboard/domain';  
import { Subject, takeUntil } from 'rxjs';
// import { KendoInput } from '@progress/kendo-angular-common';


@Component({
  selector: 'cms-widget-program-expenses',
  templateUrl: './widget-program-expenses.component.html',
  styleUrls: ['./widget-program-expenses.component.scss']
})

export class WidgetProgramExpensesComponent implements OnInit  {
  
  programExpenses: any; 
  private destroy$ = new Subject<void>();
  constructor(private widgetFacade: WidgetFacade) {}

  ngOnInit(): void { 
    this.loadProgramExpensesChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadProgramExpensesChart() {
    this.widgetFacade.loadProgramExpensesChart();
    this.widgetFacade.programExpensesChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.programExpenses = response;
          }
        }
      });
  }
}
