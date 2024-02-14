import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  WidgetFacade } from '@cms/dashboard/domain';  
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'dashboard-widget-premium-expenses-by-insurance-type',
  templateUrl: './widget-premium-expenses-by-insurance-type.component.html',
  styleUrls: ['./widget-premium-expenses-by-insurance-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetPremiumExpensesByInsuranceTypeComponent implements OnInit { 

  premiumExpensesByInsurance: any; 
  private destroy$ = new Subject<void>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  selectFrequency='YTD'
  data  = ['YTD','Last Month','Current Month','Previous Quarter','Last Year']
  @Input() isEditDashboard!: any; 
  @Input() dashboardId! : any ;
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}

  frequecyValueChange(){
    this.loadPremiumExpensesByInsuranceChart()
  }
  removeWidgetCard(){
    this.removeWidget.emit();
  }

  ngOnInit(): void { 
    this.dashboardId='E2301551-610C-43BF-B7C9-9B623ED425C3'
    this.loadPremiumExpensesByInsuranceChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadPremiumExpensesByInsuranceChart() {
    const payload ={
      paymentStatusDate : this.selectFrequency
    }
    this.widgetFacade.loadPremiumExpensesByInsuranceChart(this.dashboardId, payload);
    this.widgetFacade.premiumExpensesByInsuranceChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.premiumExpensesByInsurance = response;
          }
        }
      });
  }
}



