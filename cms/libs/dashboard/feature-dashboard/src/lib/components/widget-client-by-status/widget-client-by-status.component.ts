
import { Component,ChangeDetectionStrategy, OnInit, OnDestroy, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WidgetFacade, } from '@cms/dashboard/domain';  
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SeriesClickEvent,SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'dashboard-widget-client-by-status',
  templateUrl: './widget-client-by-status.component.html',
  styleUrls: ['./widget-client-by-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetClientByStatusComponent implements OnInit, OnDestroy{
  activeClientsByStatus: any; 
  private destroy$ = new Subject<void>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  data = ['Active','Inactive']

  @Input() isEditDashboard!: any; 
  @Input() dashboardId! : any
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade ,    private readonly router: Router ,private readonly activatedRoute : ActivatedRoute,
    private readonly cd: ChangeDetectorRef ) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }
  ngOnInit(): void { 
    
    this.loadActiveClientsByStatusChart();
  }
  public labelContent(e: SeriesLabelsContentArgs): string {
    return `${e.category}: \n ${e.value}%`;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadActiveClientsByStatusChart() {
    this.widgetFacade.loadActiveClientsByStatusChart(this.dashboardId);
    this.widgetFacade.activeClientsByStatusChart$
      //.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.activeClientsByStatus = response;
            
            this.cd.detectChanges();
            
          }
        }
      });
  }

  public onClick(event: SeriesClickEvent): void {
    
   // event.dataItem.exploded = !event.dataItem.exploded;
    //this.pieData = this.pieData.slice();
    const query = {
      queryParams: {
        category: event?.dataItem?.category       
      },
    };
    this.router.navigate([`/case-management/cases/`],query);
  }
}
