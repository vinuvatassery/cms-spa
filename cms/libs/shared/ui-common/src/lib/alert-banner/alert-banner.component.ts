/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { DialogService } from '@progress/kendo-angular-dialog';
import { AlertDueOn } from '../enums/alert-due-on.enum';
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
  @Output() onMarkAlertAsDoneClick = new EventEmitter<any>();
  @Output() onDeleteAlertClick = new EventEmitter<any>();
  public hideAfter = this.configurationProvider.appSettings.snackbarHideAfter;
  public duration =this.configurationProvider.appSettings.snackbarAnimationDuration;
  showMoreAlert = false;
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';
  alertText:string='';
  DueDate="";
  topAlert:any;
  moreItems="";
  secondaryAlertList!:any[];
  notificationReminderDialog : any;
  //delete confirmation dailog
  @ViewChild('deleteToDODialogTemplate', { read: TemplateRef })
  deleteToDODialogTemplate!: TemplateRef<any>;
  isOpenDeleteTodo = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public deleteToDoDialog: any;
  isToDODeleteActionOpen = false;
  selectedAlertId:string="";
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  public popoverAlertActions = [
    {
      buttonType:"btn-h-primary",
      text: "Done",
      icon: "done",
      id:"done",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      id:"edit",
      click: (): void => {
        
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      id:"del",
      click: (): void => {
      },
    },
  ];

  public bannerAlertActions = [
    {
      buttonType:"btn-h-primary",
      text: "Done",
      icon: "done",
      click: (): void => { 
        this.onMarkAlertAsDoneClick.emit(this.topAlert.alertId);
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
        if (!this.isToDODeleteActionOpen) {
          this.isToDODeleteActionOpen = true;
          this.selectedAlertId = this.topAlert.alertId;
          this.onOpenDeleteToDoClicked(this.deleteToDODialogTemplate);
        }
        //this.onDeleteAlertClick.emit(this.topAlert.alertId);
      },
    },
  ];
  /** Constructor **/
  constructor(private configurationProvider : ConfigurationProvider,
              private readonly cdr: ChangeDetectorRef,
              private readonly intl: IntlService,
              private dialogService: DialogService) {
              this.secondaryAlertList = new Array();
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadTodoAlertBannerData();
    this.alertList$.subscribe((data: any) => {
      this.loadTodoAlertBannerData();
    });
  }  
  private loadTodoAlertBannerData(){
      let alertType=this.alertTypeCode;
      let alertDueDate =this.intl.formatDate(
        new Date(), this.configurationProvider?.appSettings?.dateFormat)
      var xfilter=[
        {"filters":[{"field":"entityId","operator":"eq","value":this.entityId},
        {"field":"entityTypeCode","operator":"eq","value":this.entityType},
        {"field":"alertTypeCode","operator":"eq","value":this.alertTypeCode},
        {"field":"alertDueDate","operator":"gte","value":alertDueDate}],
        "logic":"and"}]; 
      const gridDataRefinerValue = {
        skipCount: 0,
        maxResultCount: 10,
        sorting: 'alertDueDate',
        sortType: 'asc',
        filter:JSON.stringify(xfilter),
      }; 
        this.isLoadAlertListEvent.emit({gridDataRefinerValue, alertType})
        this.alertList$.subscribe((data: any) => { 
          if(data?.totalCount >0 ){
            this.topAlert=data.items[0];
            this.alertText=data.items[0].alertName;
            this.DueDate=this.DueOn(data.items[0].alertDueDate);
            this.moreItems = (data?.totalCount-1) < 1 ? "" : (data?.totalCount-1) + "+ More Items";
            this.makePopoverAlertBanner(data);
            this.cdr.detectChanges();
          }else{
            this.alertText = '';
            this.cdr.detectChanges();
          }
        });
  } 
  public DueOn(alertDueDate:any):any{
    let dateNow = new Date();
    let dueDate = new Date(alertDueDate); 
         if (dueDate.toLocaleDateString() == dateNow.toLocaleDateString()) {
             return AlertDueOn.Today;
          } else if(!(dueDate.toLocaleDateString() < dateNow.toLocaleDateString()) && 
            (dueDate.toLocaleDateString() <= this.addDays(dateNow,1).toLocaleDateString())) {
             return AlertDueOn.Tomorrow;
           }
           return (this.intl.formatDate(
           new Date(alertDueDate), this.configurationProvider?.appSettings?.displayFormat));
  }
  private addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  todoItemCrossedDueDate(alertDueDate:any):boolean{
    let isCrossedDueDate = false;
    let dueDate = alertDueDate == null ? this.topAlert.alertDueDate: alertDueDate;
    if(dueDate){
      var currentDate = new Date();
      var numberOfDaysToAdd = 7;
      var resultDate =new Date(currentDate.setDate(currentDate.getDate() + numberOfDaysToAdd));
      if(new Date(dueDate) < resultDate){
        isCrossedDueDate = true;
      }
    }
     return isCrossedDueDate;
  }
  makePopoverAlertBanner(alertData:any){
    this.secondaryAlertList.splice(0); 
    let defaultCount = 3;
    if(alertData.totalCount > 1){
      let popOverBannerCount = alertData.items.length > defaultCount ? defaultCount : alertData.items.length;
      for (let index = 1; index < popOverBannerCount; index++) { 
        this.secondaryAlertList.push(alertData.items[index])
      }
    } 
  }
  onNotificationsAndRemindersClosed() { 
    this.notificationReminderDialog.close()
  }

  onNotificationsAndRemindersOpenClicked(template: TemplateRef<unknown>): void {
    this.notificationReminderDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-wid-md-full no_body_padding-modal reminder_modal',
    });  
  }
  onToDoActionClicked(item: any,gridItem: any){ 
    if(item.id == 'done'){ 
      this.onMarkAlertAsDoneClick.emit(gridItem.alertId);
    }else if(item.id == 'edit'){ 

    }
    else if(item.id == 'del'){
      if (!this.isToDODeleteActionOpen) {
        this.isToDODeleteActionOpen = true;
        this.selectedAlertId = gridItem.alertId;
        this.onOpenDeleteToDoClicked(this.deleteToDODialogTemplate);
      } 
    }
  }
  
  onOpenTodoDetailsClicked() {
    this.isModalTodoDetailsOpenClicked.emit(this.selectedAlertId);
  }

  onOpenDeleteToDoClicked(template: TemplateRef<unknown>): void {
    this.deleteToDoDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onCloseDeleteToDoClicked(result: any) {
    if (result) {
      this.isToDODeleteActionOpen = false;
      this.deleteToDoDialog.close();
    }
  }
  onDeleteToDOClicked(result: any) 
  {
    if (result) {
      this.isToDODeleteActionOpen = false;
      this.deleteToDoDialog.close();
      this.onDeleteAlertClick.emit(this.selectedAlertId);
    }
  }
}
