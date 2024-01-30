import { Component, OnInit, OnDestroy } from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';  
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Subject, takeUntil } from 'rxjs'; 


@Component({
  selector: 'dashboard-widget-program-expenses',
  templateUrl: './widget-program-expenses.component.html',
  styleUrls: ['./widget-program-expenses.component.scss']
})

export class WidgetProgramExpensesComponent implements OnInit, OnDestroy  {
  
  programExpenses: any; 
  private destroy$ = new Subject<void>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  dataExp  = ['Some','August']
  dataMonth  = ['Last Month','August']
  dataYear  = ['Last Year','2023']
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
