/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
/** Entities **/

/** Services **/
import { NotificationService } from '@progress/kendo-angular-notification';

/** Providers **/
import { ConfigurationProvider, ReminderNotificationSnackbarService, ReminderSnackBarNotificationType } from '@cms/shared/util-core';
import { SnackBar } from '@cms/shared/ui-common';
import { TodoFacade } from '@cms/productivity-tools/domain';
import { SignalrEventHandlerService } from '@cms/shared/util-common';
import { Router } from '@angular/router';
import { FinancialVendorFacade, FinancialVendorProviderTab, FinancialVendorProviderTabCode, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade } from '@cms/system-config/domain';
@Component({
  selector: 'productivity-tools-reminder-notification-snack-bar',
  templateUrl: './reminder-notification-snack-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderNotificationSnackBarComponent implements OnInit {
 
  @Input() data$!: Observable<SnackBar>;
  public hideAfter = this.configurationProvider.appSettings.snackbarHideAfter;
  public duration =
    this.configurationProvider.appSettings.snackbarAnimationDuration;
    tabCode =""
    isEdit = false;
    getTodo$ = this.todoFacade.getTodo$
  @ViewChild('reminderNotificationTemplate', { read: TemplateRef })
  alertTemplate!: TemplateRef<any>;
  snackbarMessage!: SnackBar; 
  @ViewChild('reminderNotificationTemplateContainer', {
    read: ViewContainerRef,
  })
  reminderNotificationTemplateContainer!: ViewContainerRef; 
  isReminderExpand = false;
  isReminderExpands = false;
  isReminderSideOn: any;
  isReminderSideOff: any;
  entityName =""
  messageCount : any;
  alertId=""
  dueDateText =""
  isReminderOpenClicked = false
  newReminderDetailsDialog!:any
  public data = [
    {
      text: 'Edit Reminder',
    },
    {
      text: '15 Minutes Snooze',
    },
    {
      text: '30 Minutes Snooze',
    },
    {
      text: '1 Hour Snooze',
    },
  ];

  reminderSnackBar$ = this.signalrEventHandlerService.reminderSnackBar$
  remindersUnViewedCount$ =  this.signalrEventHandlerService.remindersUnViewedCount$
  alertText =""
  entityId =""
  vendorTypeCode =""
  entityTypeCode=""
  selectedAlertId =""
  dismissAlert$ = this.todoFacade.dismissAlert$;
  @ViewChild('NewReminderTemplate', { read: TemplateRef })
  NewReminderTemplate!: TemplateRef<any>;
  medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
  providerSearchResult$ =this.financialVendorFacade.searchProvider$ 
  clientSearchLoaderVisibility$ = this.financialRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialRefundFacade.clients$;
  clientSubject = this.financialRefundFacade.clientSubject;
  searchProviderSubject = this.financialVendorFacade.searchProviderSubject;

  entityTypeCodeSubject$ = this.lovFacade.entityTypeCodeSubject$;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  unviewedCount =0;
  /** Constructor **/
  constructor(
    private readonly notificationService: NotificationService,
    private configurationProvider: ConfigurationProvider,
    private todoFacade : TodoFacade,
    private readonly router: Router,
    private readonly signalrEventHandlerService: SignalrEventHandlerService,
    public intl: IntlService,
    public dialogService : DialogService,
    public lovFacade : LovFacade,
    public financialRefundFacade : FinancialVendorRefundFacade,
    public financialVendorFacade : FinancialVendorFacade,
    private readonly reminderNotificationSnackbarService: ReminderNotificationSnackbarService,
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.removePreviousMessage();
    this.reminderSnackBarSubscribe();
  }

  reminderSnackBarSubscribe() {
    this.remindersUnViewedCount$.subscribe((res:number) =>{
       this.unviewedCount = res;
    })
    this.reminderSnackBar$.subscribe((res:any) =>{
      this.snackbarMessage = res;
       this.entityName = res.alertExtraProperties.EntityName
       this.entityId = res.alertExtraProperties.EntityId
       this.vendorTypeCode = res.alertExtraProperties.VendorTypeCode
       this.entityTypeCode  = res.alertExtraProperties.EntityTypeCode
       this.alertId =res.alertExtraProperties.AlertId
       const repeatTime = res.alertExtraProperties.RepeatTime
       const dueDate = new Date(this.intl.formatDate(res.alertExtraProperties.AlertDueDate, this.dateFormat));
       const today = new Date(this.intl.formatDate(new Date(), this.dateFormat))
        if(repeatTime){
          const times =repeatTime.split(':')
          const timeStart = new Date().getTime();
          const timeEnd = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate(), times[0], times[1]).getTime()
          var hourDiff = timeEnd - timeStart; //in ms
          var minDiff = hourDiff / 60 / 1000;
          if(minDiff <=15 && minDiff >=0){
            this.dueDateText = "Due in" + minDiff
          }
          if(minDiff <=0){
            this.dueDateText = "Overdue" + minDiff
          }
          if(minDiff ==0){
            this.dueDateText = "Now"
          }
        }
       if(dueDate == today && !repeatTime){
        this.dueDateText ="Today"
       }
    this.reminderNotificationSnackbarService
    .manageSnackBar(ReminderSnackBarNotificationType.LIGHT, res.alertText)

    })
    this.reminderNotificationSnackbarService.snackbar$.subscribe({
      next: (res) => {
        if (res) {          
          this.alertText = res.subtitle;
          this.snackbarMessage = res;
          this.notificationService.show({
            content: this.alertTemplate,
            appendTo: this.reminderNotificationTemplateContainer,
            position: { horizontal: 'right', vertical: 'bottom' },
            animation: { type: 'fade', duration: this.duration },
            closable: true,
            type: { style: res.type, icon: true },
            hideAfter: this.hideAfter,
            cssClass: 'reminder-notification-bar',
          });
        }
        this.messageCount = document.getElementsByClassName(
          'k-notification-container ng-star-inserted'
        );
   
      },
     
    });
  }

  public removePreviousMessage() {
    this.showSideReminderNotification();
    
    const divMessage = document.getElementsByClassName(
      'k-notification-container ng-star-inserted'
    );
    if (divMessage.length > 0) {
      let currentMessage = divMessage.item(0);
      currentMessage?.remove();
    }
  }

  reminderContainerClicked() {
    this.showSideReminderNotification();
    const divMessage = document.getElementsByClassName(
      'k-notification-container ng-star-inserted'
    );
    if (divMessage.length > 1) {
      this.isReminderExpand = !this.isReminderExpand;
    } else {
      this.isReminderExpand = false;
    }
  }
  moveSideReminderNotification() {
    this.isReminderSideOn = document.getElementById('reminder_notify');
    this.isReminderSideOn.classList.add('move_notify_aside');
    this.isReminderSideOn.classList.remove('expand_view');
    this.isReminderSideOn.classList.remove('collapse_view');
    this.isReminderExpand = false;
    this.isReminderExpands = true;
  }

  showSideReminderNotification() {
    this.isReminderSideOff = document.getElementById('reminder_notify');
    this.isReminderSideOff.classList.remove('move_notify_aside');
    this.isReminderExpands = false;
  }


  onEntityNameClick(entityId :any, entityTypeCode:any,vendorTypeCode:any) {
    if (entityTypeCode == "CLIENT") {
      this.router.navigate([`/case-management/cases/case360/${entityId}`]);
    }
    else if (entityTypeCode == "VENDOR") {
      this.getVendorTabCode(vendorTypeCode)
      const query = {
        queryParams: {
          v_id: this.entityId ,
          tab_code : this.tabCode
        },
      };
      this.router.navigate(['/financial-management/vendors/profile'], query )
    }
}

getVendorTabCode(vendorTypeCode :any) {
  switch (vendorTypeCode) {
    case (FinancialVendorProviderTab.Manufacturers)  :
      this.tabCode = FinancialVendorProviderTabCode.Manufacturers;
      break;

    case  (FinancialVendorProviderTab.MedicalClinic) :
      this.tabCode = FinancialVendorProviderTabCode.MedicalProvider;
      break;

      case  (FinancialVendorProviderTab.MedicalProvider) :
        this.tabCode = FinancialVendorProviderTabCode.MedicalProvider;
        break;
    case  (FinancialVendorProviderTab.InsuranceVendors):
      this.tabCode = FinancialVendorProviderTabCode.InsuranceVendors;
      break;

    case  (FinancialVendorProviderTab.Pharmacy):
      this.tabCode = FinancialVendorProviderTabCode.Pharmacy;
      break;

    case (FinancialVendorProviderTab.DentalClinic)  :
      this.tabCode =FinancialVendorProviderTabCode.DentalProvider;
      break;

      case (FinancialVendorProviderTab.DentalProvider)  :
        this.tabCode =FinancialVendorProviderTabCode.DentalProvider;
        break;
  }
}

dismissReminder(alertId:any,event:any){
  const eventData = event
  this.dismissAlert$.subscribe(res =>{
     if(res){
      this.moveSideReminderNotification()
      eventData.stopPropagation()
     }
  })
  this.todoFacade.dismissAlert(alertId)
}

onOptionClicked(event:any, alertId:any){
  if(event == 'Edit Reminder'){
if (!this.isReminderOpenClicked) {
  this.isEdit = true;
  this.selectedAlertId = alertId;
           this.onNewReminderOpenClicked(this.NewReminderTemplate)
         }
  }
}

onNewReminderOpenClicked(template: TemplateRef<unknown>): void {
  this.newReminderDetailsDialog = this.dialogService.open({
    content: template,
    cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
  });
}

onGetTodoItemData(event:any){
  this.todoFacade.getTodoItem(event);
}

getReminderDetailsLov(){
  this.lovFacade.getEntityTypeCodeLov()
}
searchClientName(event:any){
  this.financialRefundFacade.loadClientBySearchText(event);
}

searchProvider(data:any){
  this.financialVendorFacade.searchAllProvider(data);
}

remainderFor(even:any){

}

onNewReminderClosed(result: any) {
  this.newReminderDetailsDialog.close();
  this.isEdit = false;
    
}
}

