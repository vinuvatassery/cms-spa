 
 
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { WidgetChartModel, WidgetFacade } from '@cms/dashboard/domain'; 
import {  PlaceholderDirective } from '@cms/shared/ui-common';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'cms-widget-pharmacy-claims',
  templateUrl: './widget-pharmacy-claims.component.html',
  styleUrls: ['./widget-pharmacy-claims.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetPharmacyClaimsComponent implements OnInit { 

  pharmacyClaims: any; 
  private destroy$ = new Subject<void>();
  constructor(private widgetFacade: WidgetFacade) {}

  ngOnInit(): void { 
    this.loadPharmacyClaimsChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadPharmacyClaimsChart() {
    this.widgetFacade.loadPharmacyClaimsChart();
    this.widgetFacade.pharmacyClaimsChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.pharmacyClaims = response;
          }
        }
      });
  }
}



