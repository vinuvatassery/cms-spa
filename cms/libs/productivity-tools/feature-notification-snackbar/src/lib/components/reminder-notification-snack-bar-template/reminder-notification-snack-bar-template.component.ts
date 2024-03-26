import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialVendorFacade, FinancialVendorProviderTab, FinancialVendorProviderTabCode, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { TodoFacade } from '@cms/productivity-tools/domain';
import { SignalrEventHandlerService } from '@cms/shared/util-common';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-reminder-notification-snack-bars',
  templateUrl: './reminder-notification-snack-bar-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderNotificationSnackBarsTemplateComponent {

@Input() entityName =""
@Input() alertText=""
@Input() entityId =""
@Input() entityTypeCode =""
@Input() vendorTypeCode =""
@Input() alertId =""
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
      text: '15 Minutes Snooze',
    },
    {
      text: '30 Minutes Snooze',
    },
    {
      text: '1 Hour Snooze',
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
  ,public financialVendorFacade : FinancialVendorFacade) {
      
  }

  public removePreviousMessage(alertId:any) {
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
    if(event.text == 'Edit Reminder'){
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
  
  onNewReminderClosed(event:any){

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
