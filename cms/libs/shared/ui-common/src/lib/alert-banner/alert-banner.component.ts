/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
@Component({
  selector: 'common-alert-banner',
  templateUrl: './alert-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertBannerComponent implements OnInit {
  /** Input properties **/
  // @Input() data$!: Observable<SnackBar>;
  @Input() entityId:any;
  @Input() entityType:any;
  @Input() alertTypeCode:any;
  @Input()  alertList$ :any;
  @Output() isLoadAlertListEvent = new EventEmitter<any>();

  public hideAfter = this.configurationProvider.appSettings.snackbarHideAfter;
  public duration =this.configurationProvider.appSettings.snackbarAnimationDuration;
  showMoreAlert = false;
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';
  alertText:string='';
  DueDate="";
  moreItems="";
  public reminderActions = [
    {
      buttonType:"btn-h-primary",
      text: "Done",
      icon: "done",
      click: (): void => {

      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {

      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {

      },
    },
  ];
  /** Constructor **/
  constructor(private configurationProvider : ConfigurationProvider,
              private readonly cdr: ChangeDetectorRef,
              private readonly intl: IntlService,) {
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadTodoGridData();
  }  
  private loadTodoGridData(){
      let alertType=this.alertTypeCode;
      var xfilter=
        [{"filters":[{"field":"entityId","operator":"eq","value":this.entityId},
        {"field":"entityTypeCode","operator":"eq","value":this.entityType},
        {"field":"alertTypeCode","operator":"eq","value":this.alertTypeCode}
      ],"logic":"and"}]; 
      const gridDataRefinerValue = {
        skipCount: 0,
        maxResultCount: 10,
        sorting: 'alertDueDate',
        sortType: 'asc',
        filter:JSON.stringify(xfilter),
      }; 
        this.isLoadAlertListEvent.emit({gridDataRefinerValue, alertType})

        this.alertList$.subscribe((data: any) => { 
          if(data?.totalCount >=0 || data?.totalCount === -1){
            this.alertText=data.items[0].alertName;
            this.DueDate=this.DueOn(data.items[0].alertDueDate);
            this.moreItems = (data?.totalCount-1) + "+ More Items";
            this.cdr.detectChanges();
          }
        });
  } 
  private DueOn(alertDueDate:any):any{
    let dateNow = new Date();
    let dueDate = new Date(alertDueDate); 
         if (dueDate.toLocaleDateString() == dateNow.toLocaleDateString()) {
             return "(Due today)";
          } else if(dueDate.toLocaleDateString() < this.addDays(dateNow,1).toLocaleDateString()) {
             return "(Due tomorrow)";
           }
           return this.intl.formatDate(
            new Date(alertDueDate), this.configurationProvider?.appSettings?.displayFormat);

  }
  private addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
