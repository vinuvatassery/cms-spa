import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output, 
} from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';
import { Subject, takeUntil } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LegendLabelsContentArgs, SeriesClickEvent, SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
import { CaseScreenTab } from '@cms/case-management/domain';
import { Router } from '@angular/router';
import { UserDataService } from '@cms/system-config/domain';
@Component({
  selector: 'dashboard-widget-active-clients-by-group',
  templateUrl: './widget-active-clients-by-group.component.html',
  styleUrls: ['./widget-active-clients-by-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetActiveClientsByGroupComponent implements OnInit, OnDestroy {
  activeClientsByGroup: any;
  private destroy$ = new Subject<void>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() isEditDashboard!: any;
  @Input() dashboardId! : any 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade, private readonly userDataService: UserDataService,private readonly cdr: ChangeDetectorRef, private readonly router: Router) {}
  data = [{clientFullName:'All Clients',userId:null}, {clientFullName:'My Clients',userId:''}];
  myClients : boolean = false;
  totalGroupCount :number = 0;
  selectedActiveClientByGroup:any = 'All Clients';
  userId: any;


 
  ngOnInit(): void {
    this.getLoginUserId();
    this.loadActiveClients();
    this.loadActiveClientsByGroupChart(null);
  }

 
  public labelContent(e: SeriesLabelsContentArgs): string {
    return `${e.value > 0 ? e.category : ''}`;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  removeWidgetCard(){
    this.removeWidget.emit();
  }
  public legendContent(e: LegendLabelsContentArgs): string {
    return e.text +"  "+ e.value ;
  }
  clientsNavigate(event:any)
  {
    this.loadActiveClientsByGroupChart(event);
  }
  loadActiveClientsByGroupChart(userId :any) {
      this.widgetFacade.loadActiveClientsByGroupChart(this.dashboardId,userId);
      this.widgetFacade.activeClientsByGroupChart$
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.totalGroupCount=0
              this.activeClientsByGroup = response;
              this.activeClientsByGroup?.chartData?.series?.forEach((element:any) => {
                element.data.forEach((data:any)=>{
                  this.totalGroupCount = this.totalGroupCount + data.value;
                })
              });
              this.cdr.detectChanges();
            }
          },
        });
    }
    public onClick(event: SeriesClickEvent): void {
      let selectedTab = this.selectedActiveClientByGroup == "My Clients" ? CaseScreenTab.MY_CASES :CaseScreenTab.ALL ;
      const query = {
        queryParams: {
          tab: selectedTab,
          group: event?.dataItem?.category      
        },
      };
      this.router.navigate([`/case-management/cases/`],query);
      this.cdr.detectChanges();
    }
    loadActiveClients(){
      this.widgetFacade.loadActivebyGroupClients();
      this.widgetFacade.activeClientsOnGroup$.subscribe({
        next :(res:Array<any>)=>{
          if(res){
          res.forEach(user =>{
            this.data.push(user)
          })
          this.data[1].userId = this.userId;
          }
        }
      })
    }
    getLoginUserId() {
      this.userDataService.getProfile$.subscribe((users: any[]) => {
        if (users.length > 0) {
          this.userId = users[0]?.loginUserId ;
        }
      })
    }
}
