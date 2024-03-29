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
import { AlertDueOn } from '@cms/productivity-tools/domain';
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
  isEditReminderActionOpen = false;
  selectedAlertId:string="";
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  @Output() onEditReminderClicked = new EventEmitter<any>()
  @Output()  onDeleteReminderClicked =  new EventEmitter<any>()
  public popoverAlertActions = [
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
          this.selectedAlertId = this.topAlert.alertId;
          if(this.topAlert.alertTypeCode == 'REMINDER'){
          this.onEditReminderClicked.emit(this.selectedAlertId)
          }
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {
        this.selectedAlertId = this.topAlert.alertId;
        if(this.topAlert.alertTypeCode == 'REMINDER'){
          this.onDeleteReminderClicked.emit(this.selectedAlertId)
          }else{
        if (!this.isToDODeleteActionOpen) {
          this.isToDODeleteActionOpen = true;
        
          this.onOpenDeleteToDoClicked(this.deleteToDODialogTemplate);
        } 
      }
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
    this.isLoadAlertListEvent.emit(this.entityId)
    this.loadTodoAlertBannerData(); 
    this.alertList$.subscribe((data: any) => {
      this.loadTodoAlertBannerData(); 
      });
  } 
  ngDestroy(): void {
    //this.alertList$.unsubscribe();
  }  
  private loadTodoAlertBannerData(){
        this.alertList$.subscribe((data: any) => {
          if(data==true){
            this.isLoadAlertListEvent.emit(this.entityId)
          }
          if(data?.total > 0 ){
            this.topAlert=data.data[0]; 
            this.moreItems = (data?.total-1) < 1 ? "" : (data?.total-1) + "+ More Items";
            if ((data?.total-1) > 3) {
                this.showMoreAlert = true;
            }else
              this.showMoreAlert = false;
            this.makePopoverAlertBanner(data);
            this.cdr.detectChanges();
          }else{ 
            this.cdr.detectChanges();
          }
        });
  } 
  public DueOn(alertItem:any):any{
    let dateNow = new Date();
    let dueDate = new Date(alertItem.alertDueDate); 
         if (dueDate.toLocaleDateString() == dateNow.toLocaleDateString()) {
             return alertItem.alertTypeCode != 'TODO' ?  '(Due '+AlertDueOn.Today+')' : AlertDueOn.Today;
          } else if(!(dueDate.toLocaleDateString() < dateNow.toLocaleDateString()) && 
            (dueDate.toLocaleDateString() <= this.addDays(dateNow,1).toLocaleDateString())) {
             return alertItem.alertTypeCode != 'TODO' ?  '(Due in 1 day)' : AlertDueOn.Tomorrow;
           }else if(dueDate.toLocaleDateString() > dateNow.toLocaleDateString()){
            return alertItem.alertTypeCode != 'TODO' ?  '(Due in '+this.differenceInDays(dueDate,dateNow)+ ' days)' :
            (this.intl.formatDate(new Date(alertItem.alertDueDate), this.configurationProvider?.appSettings?.displayFormat));
           }else if (dueDate.toLocaleDateString() < dateNow.toLocaleDateString()){
            return alertItem.alertTypeCode != 'TODO' ?  '(Overdue)' : '';
           }
           return (this.intl.formatDate(
           new Date(alertItem.alertDueDate), this.configurationProvider?.appSettings?.displayFormat));
  }
  private addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  private differenceInDays(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffInTime = date1.getTime() - date2.getTime();
    return Math.round(diffInTime / oneDay);
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
    if(alertData.total > 1){
      let popOverBannerCount = (alertData.data.length - 1) >= defaultCount ? defaultCount : (alertData.data.length-1);
      for (let index = 1; index <= popOverBannerCount; index++) { 
        this.secondaryAlertList.push(alertData.data[index])
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
      this.selectedAlertId = gridItem.alertId;
      if(this.topAlert.alertTypeCode == 'REMINDER'){
      this.onEditReminderClicked.emit(this.selectedAlertId)
      }
    }
    else if(item.id == 'del'){
      this.selectedAlertId = gridItem.alertId;
      if(this.topAlert.alertTypeCode == 'REMINDER'){
        this.onDeleteReminderClicked.emit(this.selectedAlertId)
        }else{
      if (!this.isToDODeleteActionOpen) {
        this.isToDODeleteActionOpen = true;
        this.onOpenDeleteToDoClicked(this.deleteToDODialogTemplate);
      } 
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
