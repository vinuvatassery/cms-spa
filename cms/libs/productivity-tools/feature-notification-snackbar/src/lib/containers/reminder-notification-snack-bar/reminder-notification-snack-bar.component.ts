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
import { NotificationRef, NotificationService } from '@progress/kendo-angular-notification';

/** Providers **/
import { ConfigurationProvider, ReminderNotificationSnackbarService, ReminderSnackBarNotificationType } from '@cms/shared/util-core';
import { SnackBar } from '@cms/shared/ui-common';
import { TodoFacade } from '@cms/productivity-tools/domain';
import { SignalrEventHandlerService } from '@cms/shared/util-common';
import { Router } from '@angular/router';
import { FinancialVendorFacade, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade } from '@cms/system-config/domain';
import { ReminderNotificationSnackBarsTemplateComponent } from '../../components/reminder-notification-snack-bar-template/reminder-notification-snack-bar-template.component';
import { Subject } from 'rxjs';
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
  tabCode = ""
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
  entityName = ""
  messageCount: any;
  alertId = ""
  dueDateText = ""
  isReminderOpenClicked = false
  newReminderDetailsDialog!: any
  remindersCountSubject = new Subject<any>();
  reminderCount$ = this.remindersCountSubject.asObservable();
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
  alertText = ""
  entityId = ""
  vendorTypeCode = ""
  entityTypeCode = ""
  selectedAlertId = ""
  dismissAlert$ = this.todoFacade.dismissAlert$;
  @ViewChild('NewReminderTemplate', { read: TemplateRef })
  NewReminderTemplate!: TemplateRef<any>;
  medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
  providerSearchResult$ = this.financialVendorFacade.searchProvider$
  clientSearchLoaderVisibility$ = this.financialRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialRefundFacade.clients$;
  clientSubject = this.financialRefundFacade.clientSubject;
  searchProviderSubject = this.financialVendorFacade.searchProviderSubject;
   notificationReferences:  any[] =[]
  entityTypeCodeSubject$ = this.lovFacade.entityTypeCodeSubject$;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  unviewedCount = 0;
  disablePrevButton = true;
  disableNxtButton = false;
  /** Constructor **/
  constructor(
    private readonly notificationService: NotificationService,
    private configurationProvider: ConfigurationProvider,
    private todoFacade: TodoFacade,
    private readonly router: Router,
    private readonly signalrEventHandlerService: SignalrEventHandlerService,
    public intl: IntlService,
    public dialogService: DialogService,
    public lovFacade: LovFacade,
    public financialRefundFacade: FinancialVendorRefundFacade,
    public financialVendorFacade: FinancialVendorFacade,
    public viewContainerRef: ViewContainerRef,
    private readonly reminderNotificationSnackbarService: ReminderNotificationSnackbarService,
  ) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.removePreviousMessage();
    this.reminderSnackBarSubscribe();
    this.deleteUpdateReminderSubscribe()
  }

  deleteUpdateReminderSubscribe()
  {
    this.todoFacade.deleteReminderSnackbar$.subscribe((alertId: any) => {     
      if(alertId)
        {
          const deleteReference = this.notificationReferences.find(x=>x.content.instance.snackBarMessage.alertExtraProperties.AlertId === alertId) 
          deleteReference.hide()
          this.updateSnackBarCount(alertId,deleteReference)
        }
    })
  }
  reminderSnackBarSubscribe() {
    this.reminderSnackBar$.subscribe((res: any) => {      

      const snackbarMessage: any = {
        payload:res,
        type: ReminderSnackBarNotificationType.LIGHT
      };
       
     if(snackbarMessage?.payload?.alertExtraProperties?.AlertId)
      {

        if (!this.signalrEventHandlerService.snackBarAlertIds.includes(snackbarMessage.payload?.alertExtraProperties?.AlertId)) {
          this.signalrEventHandlerService.snackBarAlertIds.push(snackbarMessage.payload.alertExtraProperties?.AlertId)
          this.showNotifications(snackbarMessage)

        }   
        else
        {
          const updatedNotificationReference = 
          this.notificationReferences.find(x=>x.content.instance.snackBarMessage.alertExtraProperties.AlertId === snackbarMessage.payload?.alertExtraProperties?.AlertId)              
          const payload = {
            ...snackbarMessage.payload,
          }
    
          updatedNotificationReference.content.instance.snackBarMessage = payload
        
        }
     }

     
    })



  }
  showNotifications(res: any) {    

    const notificationRef: NotificationRef = this.notificationService.show({
      content: ReminderNotificationSnackBarsTemplateComponent,
      appendTo: this.reminderNotificationTemplateContainer,
      position: { horizontal: 'right', vertical: 'bottom' },
      animation: { type: 'fade', duration: this.duration },
      closable: true,
      type: { style: res.type, icon: true },
      hideAfter: this.hideAfter,
      cssClass: 'reminder-notification-bar',
    });
    
    this.notificationReferences.push(notificationRef)
    if (notificationRef && notificationRef.content && notificationRef.content.instance) {

      const payload = {
        ...res.payload,
      }

      notificationRef.content.instance.snackBarMessage = payload
      this.signalrEventHandlerService.remindersCountSubject.next(this.signalrEventHandlerService.snackBarAlertIds.length)
      this.snoozeReminderHandler(notificationRef);
      this.dismissReminderHandler(notificationRef);
      this.editReminderHandler(notificationRef);
      notificationRef.content.instance.hideSnackBar.subscribe((event:any) =>
        this.updateSnackBarCount(event, notificationRef)
      );
    }
  }

  editReminderHandler(notificationRef :any){
    notificationRef.content.instance.editReminder.subscribe((event:any)=>{
      this.updateSnackBarCount(event,notificationRef)
      notificationRef.hide()
    })
  }
  dismissReminderHandler(notificationRef:any){
    notificationRef.content.instance.dismissReminder.subscribe((event:any)=>{
      this.updateSnackBarCount(event,notificationRef)
    })
  }
  snoozeReminderHandler(notificationRef:any){
    notificationRef.content.instance.snoozeReminder.subscribe((event: any) => {
      this.updateSnackBarCount(event,notificationRef)
    }
    );

  }


   updateSnackBarCount(alertId:any, notificationRef:any){
    notificationRef.hide()
    this.signalrEventHandlerService.snackBarAlertIds = this.signalrEventHandlerService.snackBarAlertIds.filter(x => x !== alertId)
    if (notificationRef && notificationRef.content && notificationRef.content.instance) {
      this.signalrEventHandlerService.remindersCountSubject.next(this.signalrEventHandlerService.snackBarAlertIds.length)
    }
   }
  setDueDateText(res: any) {
    let timeDifferenceMinutes = 0;
    this.dueDateText =""
    const repeatTime = res.payload.alertExtraProperties.RepeatTime
    const dueDate = this.intl.formatDate(res.payload.alertExtraProperties.AlertDueDate, this.dateFormat);
    const today = this.intl.formatDate(new Date(), this.dateFormat)
    if (repeatTime) {
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
          let timeInHours =  Math.floor(0-timeDifferenceMinutes/60);
          this.dueDateText = timeInHours +" Hrs Over Due"
          if(timeInHours >24){
           let timeInDays =  Math.floor(timeInHours/24);
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
      'k-notification-container'
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

}

