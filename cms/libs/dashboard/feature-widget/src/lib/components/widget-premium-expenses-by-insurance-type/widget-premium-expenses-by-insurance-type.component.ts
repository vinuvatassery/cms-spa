import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { WidgetChartModel, WidgetFacade } from '@cms/dashboard/domain';
import { DashboardChartComponent } from '@cms/dashboard/feature-dashboard';
import {  PlaceholderDirective } from '@cms/shared/ui-common';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'cms-widget-premium-expenses-by-insurance-type',
  templateUrl: './widget-premium-expenses-by-insurance-type.component.html',
  styleUrls: ['./widget-premium-expenses-by-insurance-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetPremiumExpensesByInsuranceTypeComponent implements OnInit { 

  premiumExpensesByInsurance: any; 
  private destroy$ = new Subject<void>();
  constructor(private widgetFacade: WidgetFacade) {}

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



