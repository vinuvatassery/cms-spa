import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { CaseFacade, FinancialVendorFacade, FinancialVendorProviderTab, FinancialVendorProviderTabCode, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { NotificationFacade, TodoFacade } from '@cms/productivity-tools/domain';
import { SignalrEventHandlerService } from '@cms/shared/util-common';
import { ConfigurationProvider, LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
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
  OnInit, DoCheck {

  entityName = ""
  alertText = ""
  entityId = ""
  entityTypeCode = ""
  vendorTypeCode = ""
  alertId = ""
  @Output() hideSnackBar = new EventEmitter();
  @Output() snoozeReminder = new EventEmitter();
  @Output() dismissReminder = new EventEmitter();
  @Output() editReminder = new EventEmitter();
  @Output() reloadReminderSnackBars = new EventEmitter()
  @Input() snackBarMessage!: any
  @Input() dueDate!: any
  skeletonCounts = [
    1
  ]
  unviewedCount = 9
  tabCode = ""
  selectedAlertId = ""
  isReminderExpand = false;
  isReminderExpands = false;
  isReminderSideOn: any;
  isReminderSideOff: any;
  messageCount: any;
  dueDateText = ""
  isReminderOpenClicked = false
  newReminderDetailsDialog!: any
  getTodo$ = this.todoFacade.getTodo$
  showDataLoader = false;
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
      id: '15 Minutes'
    },
    {
      text: '30 Minute Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id: '30 Minutes'
    },
    {
      text: '1 hour Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id: '1 hour'
    },
    {
      text: '2 hour Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id: '2 hours'
    },
    {
      text: '1 day Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id: '1 day'
    },
    {
      text: '3 day Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id: '3 days'
    },
    {
      text: '7 day Snooze',
      buttonType: 'btn-h-primary',
      icon: 'clock',
      id: '7 days'
    },
  ];

  @ViewChild('NewReminderTemplate', { read: TemplateRef })
  NewReminderTemplate!: TemplateRef<any>;
  medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
  providerSearchResult$ = this.financialVendorFacade.searchProvider$
  clientSearchLoaderVisibility$ = this.financialRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialRefundFacade.clients$;
  clientSubject = this.financialRefundFacade.clientSubject;
  searchProviderSubject = this.financialVendorFacade.searchProviderSubject;

  entityTypeCodeSubject$ = this.lovFacade.entityTypeCodeSubject$;
  dateFormat = this.configurationProvider.appSettings.dateFormat;

  constructor(public viewContainerRef: ViewContainerRef
    , private configurationProvider: ConfigurationProvider
    , private readonly router: Router
    , private todoFacade: TodoFacade
    , private dialogService: DialogService
    , private lovFacade: LovFacade
    , private financialRefundFacade: FinancialVendorRefundFacade
    , public financialVendorFacade: FinancialVendorFacade
    , public cdr: ChangeDetectorRef
    , public intl: IntlService
    , public notificationFacade: NotificationFacade
    , public signalrEventHandlerService: SignalrEventHandlerService,
    private loaderService: LoaderService,
    private caseFacade: CaseFacade
  ) {

  }

  ngOnInit(): void {

    this.signalrEventHandlerService.remindersCount$.subscribe(res => {
      if (res > 0)
        this.unviewedCount = res;
    })
    this.todoFacade.deleteReminderSnackbar$.subscribe((alertId: any) => {     
      if(alertId)
        {
          this.reloadReminderSnackBars.emit(this.selectedAlertId)
          this.removePreviousMessage()      
        }
    })
  }

  ngDoCheck() {
    if (this.snackBarMessage) {
      this.entityName = this.snackBarMessage.alertExtraProperties.EntityName
      this.entityId = this.snackBarMessage.alertExtraProperties.EntityId
      this.vendorTypeCode = this.snackBarMessage.alertExtraProperties.VendorTypeCode
      this.entityTypeCode = this.snackBarMessage.alertExtraProperties.EntityTypeCode
      this.alertId = this.snackBarMessage.alertExtraProperties.AlertId
      this.alertText = this.snackBarMessage.alertText
      this.dueDateText = this.snackBarMessage.alertExtraProperties.DueDateText
      this.snackBarMessage?.unviewedCount$?.subscribe((res: any) => {
        this.unviewedCount = res;
      });
    }

    this.cdr.detectChanges()

  }

  public removePreviousMessage() {
    this.showSideReminderNotification();

    this.hideSnackBar.emit(this.alertId);
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

  onOptionClicked(event: any, alertId: any) {
    this.selectedAlertId = alertId;

    if (event.text == 'Edit Reminder') {
      if (!this.isReminderOpenClicked) {
        this.isEdit = true;
        this.onNewReminderOpenClicked(this.NewReminderTemplate)
      }
    } else {
      this.notificationFacade.snoozeReminder$.pipe(take(1)).subscribe(res =>{
        if(res){
          this.snoozeReminder.emit(this.selectedAlertId)
          this.removePreviousMessage()
        }
      })
        if (event.id.includes('hour') || event.id.includes('Minutes')) {
          this.snoozeRemindersInMins(event.id)
        }

        if (event.id.includes('days')) {
          this.snoozeRemindersInDays(event.id)
        }
      
    }
  }


  snoozeRemindersInDays(timePeriod: string) {
    this.showDataLoader = true 
    let days = parseInt(timePeriod.split(' ')[0]);
    this.notificationFacade.SnoozeReminder(this.selectedAlertId, days, true, true,false)
  }
  snoozeRemindersInMins(timePeriod: string) {
    this.showDataLoader = true
    let mins = 0;
    let time = parseInt(timePeriod.split(' ')[0]);

    if (timePeriod.includes('hour')) {
      mins = time * 60;
    }
    if (timePeriod.includes('Minutes')) {
      mins = time
    }
    this.notificationFacade.SnoozeReminder(this.selectedAlertId, mins, false, true,false)
  }

  onNewReminderOpenClicked(template: TemplateRef<unknown>): void {
    this.newReminderDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

  onGetTodoItemData(event: any) {
    this.todoFacade.getTodoItem(event);
  }

  getReminderDetailsLov() {
    this.lovFacade.getEntityTypeCodeLov()
  }
  searchClientName(event: any) {
    this.financialRefundFacade.loadClientBySearchText(event);
  }

  searchProvider(data: any) {
    this.financialVendorFacade.searchAllProvider(data);
  }


  onNewReminderClosed(result: any) {
    this.newReminderDetailsDialog.close();
    this.isEdit = true;
    if (result) {
      this.todoFacade.getTodo$.subscribe(res => {
        if (this.alertId == res.alertId) {
          this.removePreviousMessage()

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


  onEntityNameClick(event: any, entityId: any, entityTypeCode: any, vendorTypeCode: any) {
    if (entityTypeCode == "CLIENT") {
      this.getEligibilityInfoByEligibilityId(entityId)
    }
    else if (entityTypeCode == "VENDOR") {
      this.getVendorTabCode(vendorTypeCode)
      const query = {
        queryParams: {
          v_id: this.entityId,
          tab_code: this.tabCode
        },
      };
      this.router.navigate(['/financial-management/vendors/profile'], query)
    }
    event.stopPropagation()
  }
  getEligibilityInfoByEligibilityId(clientId: any) {
    this.loaderService.show();
    this.caseFacade.loadClientEligibility(clientId).subscribe({
      next: (response: any) => {
        if (response) {
          this.loaderService.hide();
          const eligibilityId = response?.clientCaseEligibilityId
          if (eligibilityId) {
            this.clientNavigation(eligibilityId, response?.caseStatus, clientId)
          }
        }
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.caseFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    })
  }


  clientNavigation(clientCaseEligibilityId: any, eligibilityStatusCode: any, clientId: any) {
    if (eligibilityStatusCode === 'ACCEPT') {
      this.router.navigate([`/case-management/cases/case360/${clientId}`]);
    }
    else {
      this.loaderService.show();
      this.caseFacade.getSessionInfoByCaseEligibilityId(clientCaseEligibilityId).subscribe({
        next: (response: any) => {
          if (response) {
            this.loaderService.hide();
            this.router.navigate(['case-management/case-detail'], {
              queryParams: {
                sid: response.sessionId,
                eid: response.entityID,
                wtc: response?.workflowTypeCode
              },
            });
          }
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.caseFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        }
      })
    }
  }

  getVendorTabCode(vendorTypeCode: any) {
    switch (vendorTypeCode) {
      case (FinancialVendorProviderTab.Manufacturers):
        this.tabCode = FinancialVendorProviderTabCode.Manufacturers;
        break;

      case (FinancialVendorProviderTab.MedicalClinic):
        this.tabCode = FinancialVendorProviderTabCode.MedicalProvider;
        break;

      case (FinancialVendorProviderTab.MedicalProvider):
        this.tabCode = FinancialVendorProviderTabCode.MedicalProvider;
        break;
      case (FinancialVendorProviderTab.InsuranceVendors):
        this.tabCode = FinancialVendorProviderTabCode.InsuranceVendors;
        break;

      case (FinancialVendorProviderTab.Pharmacy):
        this.tabCode = FinancialVendorProviderTabCode.Pharmacy;
        break;

      case (FinancialVendorProviderTab.DentalClinic):
        this.tabCode = FinancialVendorProviderTabCode.DentalProvider;
        break;

      case (FinancialVendorProviderTab.DentalProvider):
        this.tabCode = FinancialVendorProviderTabCode.DentalProvider;
        break;
    }
  }

  dismissAlert(alertId: any) {
    this.todoFacade.dismissAlert(alertId);
    this.todoFacade.dismissAlert$.subscribe(res => {
      if (res) {
        this.dismissReminder.emit(this.alertId);
        this.removePreviousMessage()
      }

    })

  }


}
