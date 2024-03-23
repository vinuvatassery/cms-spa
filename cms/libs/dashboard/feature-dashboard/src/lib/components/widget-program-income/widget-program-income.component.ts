import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import {   WidgetFacade } from '@cms/dashboard/domain';  
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
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
  @Input() isEditDashboard!: any; 
  @Input() dashboardId! : any 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }

  ngOnInit(): void { 
    this.loadProgramIncomeChart();
  }
  public labelContent(e: SeriesLabelsContentArgs): string {
    return `${e.category}: \n ${e.value}%`;
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

