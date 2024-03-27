import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialVendorFacade, FinancialVendorProviderTab, FinancialVendorProviderTabCode, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { NotificationFacade, TodoFacade } from '@cms/productivity-tools/domain';
import { SignalrEventHandlerService } from '@cms/shared/util-common';
import { ConfigurationProvider, ReminderNotificationSnackbarService, ReminderSnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { IntlService } from '@progress/kendo-angular-intl';

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
    },
    {
      text: '15 Minutes',
    },
    {
      text: '30 Minutes',
    },
    {
      text: '1 hour',
    },
    {
      text: '2 hours',
    }, 
    {
      text: '1 day',
    },
    {
      text: '3 days',
    },
    {
      text: '7 days',
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
  ) {
      
  }

  ngOnInit(): void {

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

      } 
    this.cdr.detectChanges()

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

  onOptionClicked(event:any, alertId:any){
    this.selectedAlertId = alertId;

    if(event.text == 'Edit Reminder'){
  if (!this.isReminderOpenClicked) {
    this.isEdit = true;
     this.onNewReminderOpenClicked(this.NewReminderTemplate)
    }
 }
 if(event.text == '15 Minutes'){
  this.notificationFacade.SnoozeReminder(this.selectedAlertId,15,false)
  this.removePreviousMessage()
 }
 if(event.text == '30 Minutes'){
  this.notificationFacade.SnoozeReminder(this.selectedAlertId,30)
 }
 if(event.text == '1 hour'){
  this.notificationFacade.SnoozeReminder(this.selectedAlertId,1)
 }
 if(event.text == '2 hours'){
  this.notificationFacade.SnoozeReminder(this.selectedAlertId,1)
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
      this.snackBarMessage.alertText = res.alertDesc;
      this.snackBarMessage.entityName = res.entityTypeCode == 'CLIENT' ? res.clientFullName : res.providerName
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
}

}
