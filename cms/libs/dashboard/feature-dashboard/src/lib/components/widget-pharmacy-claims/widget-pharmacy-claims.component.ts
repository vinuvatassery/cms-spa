 
 
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  selectedDataCount ='Claim Count'
  selectedTimeFrame = 'This Month'
  dataMonth = ['This Month','Last Month','YTD','Last Year']
  dataCount = ['Claim Count','Claim Amount']
  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade, private changeDetectorRef : ChangeDetectorRef) {}
  claimCount =0;
  claimAmount =0;
  removeWidgetCard(){
    this.removeWidget.emit();
  }

  ngOnInit(): void { 
    this.loadPharmacyClaimsChart();
  }

  dataCountChange(event:string){
    this.selectedDataCount = event
    this.loadPharmacyClaimsChart()
  }
  dataMonthChange(event:string){
    this.selectedTimeFrame = event
    this.loadPharmacyClaimsChart()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public labelContent(e: SeriesLabelsContentArgs): string {
    return `${e.category}: \n ${e.value}%`;
  }
  loadPharmacyClaimsChart() {
    const payload ={
      CountOrAmount : this.selectedDataCount,
      TimeFrame : this.selectedTimeFrame
    }
    this.widgetFacade.loadPharmacyClaimsChart('E2301551-610C-43BF-B7C9-9B623ED425C3',payload);
    this.widgetFacade.pharmacyClaimsChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.pharmacyClaims = response?.widgetProperties;
            this.claimCount = response?.result?.claimCount
            this.claimAmount = response?.result?.claimAmount
            this.changeDetectorRef.detectChanges()
          }
        }
      });
  }
}



