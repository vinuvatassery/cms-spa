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
  data  = ['Last Month','August']
  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }

  ngOnInit(): void { 
    this.loadPremiumExpensesByInsuranceChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadPremiumExpensesByInsuranceChart() {
    this.widgetFacade.loadPremiumExpensesByInsuranceChart();
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



