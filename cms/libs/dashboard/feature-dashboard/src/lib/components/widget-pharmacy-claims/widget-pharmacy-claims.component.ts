 
 
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  WidgetFacade } from '@cms/dashboard/domain';  
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Subject, takeUntil } from 'rxjs'; 
import { SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
@Component({
  selector: 'dashboard-widget-pharmacy-claims',
  templateUrl: './widget-pharmacy-claims.component.html',
  styleUrls: ['./widget-pharmacy-claims.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetPharmacyClaimsComponent implements OnInit { 

  pharmacyClaims: any; 
  private destroy$ = new Subject<void>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  dataMonth = ['Last Month','August']
  dataCount = ['100','200']
  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }

  ngOnInit(): void { 
    this.loadPharmacyClaimsChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public labelContent(e: SeriesLabelsContentArgs): string {
    return `${e.category}: \n ${e.value}%`;
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



