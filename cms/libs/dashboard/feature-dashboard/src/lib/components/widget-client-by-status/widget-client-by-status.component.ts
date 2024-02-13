
import { Component,ChangeDetectionStrategy, OnInit, OnDestroy, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseScreenTab } from '@cms/case-management/domain';
import { WidgetFacade, } from '@cms/dashboard/domain';  
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LegendLabelsContentArgs, SeriesClickEvent,SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
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
  data = ['All Clients', 'My Clients'];
  myClients : boolean = false;
  totalStatusCount :number = 0;
  @Input() isEditDashboard!: any; 
  @Input() dashboardId! : any
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade ,    private readonly router: Router ,private readonly activatedRoute : ActivatedRoute,
    private readonly cdr: ChangeDetectorRef ) {}


  removeWidgetCard(){
    this.removeWidget.emit();
  }
  ngOnInit(): void { 
    
    this.loadActiveClientsByStatusChart();
  }
  public labelContent(e: SeriesLabelsContentArgs): string {
    return `${e.value > 0 ? e.category : ''}`;
  }
  public legendContent(e: LegendLabelsContentArgs): string {
    return e.text +"  "+ e.value ;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  clientsNavigate(event:any)
   {  
   
    this.myClients = event == "My Clients" ? true : false;
    this.loadActiveClientsByStatusChart();
  }
  loadActiveClientsByStatusChart() {
    this.widgetFacade.loadActiveClientsByStatusChart(this.dashboardId,this.myClients);
    this.widgetFacade.activeClientsByStatusChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
         
          if (response) {
           
            this.activeClientsByStatus = response;
            this.totalStatusCount = 0;
            this.activeClientsByStatus.chartData.series.forEach((element:any) => {
              element.data.forEach((data:any)=>{
                this.totalStatusCount = this.totalStatusCount + data.value;
              })
            });
            this.cdr.detectChanges();
           
          }
        }
      });
  }

  public onClick(event: SeriesClickEvent): void {
    const query = {
      queryParams: {
        tab: CaseScreenTab.ALL,
        casestatus: event?.dataItem?.category      
      },
    };
    this.router.navigate([`/case-management/cases/`],query);
    this.cdr.detectChanges();
  }
}
