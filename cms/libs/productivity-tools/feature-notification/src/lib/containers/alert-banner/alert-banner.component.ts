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
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

  isOpenDeleteTodo = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public deleteToDoDialog: any;
  isToDODeleteActionOpen = false;
  isEditReminderActionOpen = false;
  selectedAlertId:string="";
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  @Output() onEditReminderClicked = new EventEmitter<any>()
  @Output() onEditTodoClicked = new EventEmitter<any>()
  @Output()  onDeleteReminderClicked =  new EventEmitter<any>()
  routeSubscription!: Subscription;
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
          this.selectedAlertId = this.topAlert.alertId;
          if(this.topAlert.alertTypeCode == 'REMINDER'){
          this.onEditReminderClicked.emit(this.selectedAlertId)
          }
          if(this.topAlert.alertTypeCode == 'TODO'){
            this.onEditTodoClicked.emit(this.selectedAlertId)
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
        if (this.topAlert.alertTypeCode == 'TODO') {
          this.onDeleteAlertClick.emit(this.selectedAlertId);
        } 
      }
      },
    },
  ];
  /** Constructor **/
  constructor(private configurationProvider : ConfigurationProvider,
              private readonly cdr: ChangeDetectorRef,
              private readonly intl: IntlService,
              private dialogService: DialogService,
              private readonly router: Router,) {
              this.secondaryAlertList = new Array();
              this.routeSubscription = this.router.events.subscribe(event => {
                if (event instanceof NavigationStart) {
                  if(this.entityId != null){
                    let isNewEntityId = (this.entityId?.toString() != event.url.toString().split("/")[4]); 
                    this.entityId = event.url.toString().split("/")[4];  
                    if(parseInt(this.entityId)>0 && isNewEntityId){
                      this.isLoadAlertListEvent.emit(this.entityId)
                      this.loadTodoAlertBannerData();
                    } 
                  }
                }
            });
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
    this.routeSubscription.unsubscribe();
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
            this.topAlert =undefined
            this.secondaryAlertList =[]
            this.cdr.detectChanges();
          }
        });
  } 


  public DueOn(alertItem:any):any{
   
    let dateNow = new Date();
    dateNow = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
    let dueDate = new Date(alertItem.alertDueDate); 
         if (dueDate == dateNow) {
             return alertItem.alertTypeCode != 'TODO' ?  '(Due '+AlertDueOn.Today+')' : AlertDueOn.Today;
          } else if(!(dueDate < dateNow) && 
            (dueDate <= this.addDays(dateNow,1))) {
             return alertItem.alertTypeCode != 'TODO' ?  '(Due in 1 day)' : AlertDueOn.Tomorrow;
           }else if(dueDate > dateNow){
            return alertItem.alertTypeCode != 'TODO' ?  '(Due in '+(this.differenceInDays(dueDate,dateNow)+1)+ ' days)' :
            (this.intl.formatDate(new Date(alertItem.alertDueDate), this.configurationProvider?.appSettings?.displayFormat));
           }else if (dueDate < dateNow){
            return alertItem.alertTypeCode != 'TODO' ?  '(Overdue)' : 
            (this.intl.formatDate(new Date(alertItem.alertDueDate), this.configurationProvider?.appSettings?.displayFormat));
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
      if(gridItem.alertTypeCode == 'REMINDER'){
      this.onEditReminderClicked.emit(this.selectedAlertId)
      }
      if(gridItem.alertTypeCode == 'TODO'){
        this.onEditTodoClicked.emit(this.selectedAlertId)
        }
    }
    else if(item.id == 'del'){
      this.selectedAlertId = gridItem.alertId;
      if(gridItem.alertTypeCode == 'REMINDER'){
        this.onDeleteReminderClicked.emit(this.selectedAlertId)
        }else{
          if(gridItem.alertTypeCode == 'TODO'){
        this.onDeleteAlertClick.emit(this.selectedAlertId);
      } 
    }
    }
  }
  
  onOpenTodoDetailsClicked() {
    this.isModalTodoDetailsOpenClicked.emit(this.selectedAlertId);
  }

}
