import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialVendorFacade, FinancialVendorProviderTab, FinancialVendorProviderTabCode, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { NotificationFacade, TodoFacade } from '@cms/productivity-tools/domain';
import { SignalrEventHandlerService } from '@cms/shared/util-common';
import { ConfigurationProvider, ReminderNotificationSnackbarService, ReminderSnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { IntlService } from '@progress/kendo-angular-intl';
import { take } from 'rxjs';

@Component({
  selector: 'cms-reminder-notification-snack-bars',
  templateUrl: './reminder-notification-snack-bar-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderNotificationSnackBarsTemplateComponent implements 
OnInit,DoCheck {

entityName =""
alertText=""
entityId =""
entityTypeCode =""
vendorTypeCode =""
alertId =""
@Output() hideSnackBar = new EventEmitter();
@Output() snoozeReminder = new EventEmitter();
@Output() dismissReminder = new EventEmitter();
@Input() snackBarMessage!:any
@Input() dueDate!:any
unviewedCount=9
tabCode = ""
selectedAlertId =""
isReminderExpand = false;
  isReminderExpands = false;
  isReminderSideOn: any;
  isReminderSideOff: any;
  messageCount : any;
  dueDateText =""
  isReminderOpenClicked = false
  newReminderDetailsDialog!:any
  getTodo$ = this.todoFacade.getTodo$

  public hideAfter = this.configurationProvider.appSettings.snackbarHideAfter;
  public duration =
    this.configurationProvider.appSettings.snackbarAnimationDuration;
    isEdit = false;
  public data = [
    {
      text: 'Edit Reminder',
      icon: 'edit'
    },
    {
      text: '15 Minute Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id:'15 Minutes'
    },
    {
      text: '30 Minute Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id:'30 Minutes'
    },
    {
      text: '1 hour Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id:'1 hour'
    },
    {
      text: '2 hour Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id:'2 hours'
    }, 
    {
      text: '1 day Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id:'1 day'
    },
    {
      text: '3 day Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id:'3 days'
    },
    {
      text: '7 day Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id:'7 days'
    },
  ];

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

  constructor(public viewContainerRef : ViewContainerRef
    ,private configurationProvider : ConfigurationProvider
    ,  private readonly router: Router 
    ,private todoFacade : TodoFacade
   , private dialogService : DialogService 
   , private lovFacade : LovFacade
   ,private financialRefundFacade : FinancialVendorRefundFacade
  ,public financialVendorFacade : FinancialVendorFacade
  , public cdr : ChangeDetectorRef
  ,  public intl: IntlService
  , public notificationFacade : NotificationFacade
  , public signalrEventHandlerService : SignalrEventHandlerService
  ) {
      
  }

  ngOnInit(): void {
    this.signalrEventHandlerService.remindersCount$.subscribe(res =>{
      if(res>0)
      this.unviewedCount = res;
    })
  }

  ngDoCheck(){
    if(this.snackBarMessage){
      this.entityName = this.snackBarMessage.alertExtraProperties.EntityName
      this.entityId = this.snackBarMessage.alertExtraProperties.EntityId
      this.vendorTypeCode = this.snackBarMessage.alertExtraProperties.VendorTypeCode
      this.entityTypeCode  = this.snackBarMessage.alertExtraProperties.EntityTypeCode
      this.alertId =this.snackBarMessage.alertExtraProperties.AlertId  
      this.alertText =this.snackBarMessage.alertText  
      this.dueDateText = this.snackBarMessage.dueDateText
      this.snackBarMessage?.unviewedCount$?.subscribe((res : any) =>{
        this.unviewedCount = res;
       });
      } 

    this.cdr.detectChanges()

  }

  public removePreviousMessage() {
    this.showSideReminderNotification();
    
    this.hideSnackBar.emit(); 
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

  onOptionClicked(event:any, alertId:any){
    this.selectedAlertId = alertId;

    if(event.text == 'Edit Reminder'){
  if (!this.isReminderOpenClicked) {
    this.isEdit = true;
     this.onNewReminderOpenClicked(this.NewReminderTemplate)
    }
 }else{
  this.notificationFacade.snoozeReminder$.pipe(take(1)).subscribe(res =>{
    if(res){
      this.snoozeReminder.emit(this.selectedAlertId)
      this.removePreviousMessage()
    }
  })
 if(event.id == '15 Minutes'){
  this.notificationFacade.SnoozeReminder(this.selectedAlertId,15,false,false)
 
 }
 if(event.id == '30 Minutes'){
  this.notificationFacade.SnoozeReminder(this.selectedAlertId,30,false, false)
 }
 if(event.id == '1 hour'){
  this.notificationFacade.SnoozeReminder(this.selectedAlertId,60,false, false)
 }
 if(event.id == '2 hours'){
  this.notificationFacade.SnoozeReminder(this.selectedAlertId,120,false, false)
 }
 if(event.id == '3 days'){
  this.notificationFacade.SnoozeReminder(this.selectedAlertId,3)
 }
 if(event.id == '1 day'){
  this.notificationFacade.SnoozeReminder(this.selectedAlertId,1)
 }
 if(event.id == '2 days'){
  this.notificationFacade.SnoozeReminder(this.selectedAlertId,2)
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
  

  onNewReminderClosed(result: any) {
   this.newReminderDetailsDialog.close();
    this.isEdit = true;
    if(result){
      this.todoFacade.getTodo$.subscribe(res =>{
        if(this.alertId == res.alertId){
        this.snackBarMessage.alertText = res.alertDesc;
        this.entityId = res.EntityId
        this.snackBarMessage.alertExtraProperties.vendorTypeCode = res.entityTypeCode
        this.snackBarMessage.alertExtraProperties.entityTypeCode  = res.entityTypeCode == 'CLIENT'? res.entityTypeCode :'VENDOR'
        this.snackBarMessage.alertExtraProperties.EntityName = res.entityTypeCode == 'CLIENT' ? res.clientFullName : res.providerName
        this.setDueDateText(res)
        }
      })
      this.todoFacade.getTodoItem(this.alertId);
  
   
  }
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

dismissAlert(alertId:any){
  this.todoFacade.dismissAlert(alertId);
  this.todoFacade.dismissAlert$.subscribe(res =>{
    if(res){
      this.dismissReminder.emit(this.alertId);
      this.removePreviousMessage()
    }

  })

}

setDueDateText(res: any) {
  let timeDifferenceMinutes = 0;
  this.dueDateText =""
  const repeatTime = res.repeatTime
  const dueDate = this.intl.formatDate(res.alertDueDate, this.dateFormat);
  const today = this.intl.formatDate(new Date(), this.dateFormat)
  if (repeatTime && dueDate !== today) {
    const times = repeatTime.split(':')
    const duedateWithRepeatTime = new Date(new Date().getFullYear(), new Date().getMonth(),
      new Date().getDate(), times[0], times[1])
    const timeDifferenceMs = duedateWithRepeatTime.getTime() - new Date().getTime();
    timeDifferenceMinutes = Math.floor(timeDifferenceMs / (1000 * 60));


    if (timeDifferenceMinutes >= 0 && timeDifferenceMinutes <= 15) {
      this.dueDateText = "In " + timeDifferenceMinutes + " Mins"
    }
      if (timeDifferenceMinutes <= 0) {
        this.dueDateText = 0-timeDifferenceMinutes + " Mins Over Due"
        if(0-timeDifferenceMinutes >60){
          var timeInHours =  Math.floor(0-timeDifferenceMinutes/60);
          this.dueDateText = timeInHours +" Hrs Over Due"
          if(timeInHours >24){
           var timeInDays =  Math.floor(timeInHours/24);
           this.dueDateText = timeInDays +" Days Over Due"
          }
        }

      }
    if (timeDifferenceMinutes == 0) {
      this.dueDateText = "Now"
    }

  }
  if (dueDate == today && !repeatTime) {
    this.dueDateText = "Today"
  }

  return {
    timeDifferenceMinutes: timeDifferenceMinutes,
    dueDate : dueDate,
    today : today, 
    repeatTime : repeatTime
  };
}

}
