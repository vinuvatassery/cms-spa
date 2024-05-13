import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Subject, takeUntil } from 'rxjs';
import {
  LegendLabels,
  LegendLabelsContentArgs,
  LegendMarkers,
  SeriesLabelsAlignment,
  SeriesLabelsContentArgs,
} from '@progress/kendo-angular-charts';
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
  selectedDataCount = 'Claim Count';
  selectedTimeFrame = 'This Month';
  dataMonth = [
    'This Month',
    'Last Month',
    'Previous Quarter',
    'YTD',
    'Last Year',
  ];
  public labelAlign: SeriesLabelsAlignment = 'circle';
  dataCount = ['Claim Count', 'Dollar Amount'];
  @Input() isEditDashboard!: any;
  @Input() dashboardId!: any;
  @Output() removeWidget = new EventEmitter<string>();
  labels: LegendLabels = {
    content: this.legendLabelCount,
    font: "14px Neue Helvetica Roman",
    margin: 5
  };
  markers: LegendMarkers = {
    type: 'circle',
    width: 10,
    height: 10
  }
  constructor(
    private widgetFacade: WidgetFacade,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  claimCount = 0;
  claimAmount = 0;
  removeWidgetCard() {
    this.removeWidget.emit();
  }

  ngOnInit(): void {
    this.loadPharmacyClaimsChart();
  }

  dataCountChange(event: string) {
    this.selectedDataCount = event;

    this.labels = {
      content:
        this.selectedDataCount == 'Claim Count'
          ? this.legendLabelCount
          : this.legendLabelClaimAmount,
    };
    this.loadPharmacyClaimsChart();
  }
  dataMonthChange(event: string) {
    this.selectedTimeFrame = event;
    this.loadPharmacyClaimsChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public labelContent(e: SeriesLabelsContentArgs): string {
    return `${e.category}: \n ${e.value}`;
  }

  public labelContentAmount(e: SeriesLabelsContentArgs): string {
    return `${e.category}: \n $ ${e.value}`;
  }

  public legendLabelCount(e: LegendLabelsContentArgs): string {
    return `${e.text}: ${e.value}`;
  }

  public legendLabelClaimAmount(e: LegendLabelsContentArgs): string {
    return `${e.text} : $ ${e.value}`;
  }

  loadPharmacyClaimsChart() {
    this.pharmacyClaims = null
    const payload = {
      CountOrAmount: this.selectedDataCount,
      TimeFrame: this.selectedTimeFrame,
    };
    this.widgetFacade.loadPharmacyClaimsChart( this.dashboardId,      payload    );
    this.widgetFacade.pharmacyClaimsChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.pharmacyClaims = response?.widgetProperties;            
            this.claimCount = response?.result?.claimCount;
            this.claimAmount = response?.result?.claimAmount;
            this.changeDetectorRef.detectChanges();
          }
        },
      });
  }
}
