/** Angular **/
import { Component, ChangeDetectionStrategy, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FinancialVendorProviderTab, FinancialVendorProviderTabCode } from '@cms/case-management/domain';
import { NotificationFacade } from '@cms/productivity-tools/domain';
import { ToDoEntityTypeCode } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { BehaviorSubject, Subject } from 'rxjs';
@Component({
  selector: 'productivity-tools-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationListComponent {
  @Output() isLoadReminderAndNotificationEvent = new EventEmitter<any>();
  @Input() notificationList$: any;
  alertsData:any = {};
  @Input()searchNotification$ : any;
  isToDoGridLoaderShow = new BehaviorSubject<boolean>(true);
  notificationaAndReminderDataSubject = new Subject<any>();
  gridDataResult!: GridDataResult;
  gridToDoItemData$ = this.notificationaAndReminderDataSubject.asObservable();
  @Output() loadNotificationtEvent = new EventEmitter<any>();
  @Output() searchTermTextEvent = new EventEmitter<any>();
  @Output() closeDialog = new EventEmitter<void>();
  searchTerm = new FormControl();
  tabCode= 'MEDICAL_CLINIC'
  dateFormat = this.configurationProvider.appSettings.dateFormat;
    /** Lifecycle hooks **/
    ngOnInit(): void {
      this.loadNotificationsAndReminders();
      this.notificationList$.subscribe((data: any) => {
        this.alertsData.items =data?.items ?  data?.items?.filter((item:any) => item.alertTypeCode == 'NOTIFICATION').sort((a : any, b : any) => {
          const dateA = new Date(a.alertDueDate).getTime();
          const dateB = new Date(b.alertDueDate).getTime();
          return dateA - dateB}) : []; // Sorting by alertDueDate in ascending order;
        this.cdr.detectChanges();
      });
      this.searchTerm.valueChanges.subscribe((value) => {
        const containsOnlyNumbers = /^\d+$/.test(value);
        const tempDate = new Date(value);
        const isDateFormat = !isNaN(tempDate.getTime());
        if (containsOnlyNumbers) 
        { 
            this.searchTermTextEvent.emit(value);
        } 
        else if (isDateFormat) 
        {
            const formattedDate = this.intl.formatDate(tempDate, this.dateFormat);
            this.searchTermTextEvent.emit(formattedDate);
        }
       else 
       {
            this.searchTermTextEvent.emit(value?.trim());
        }
    });
    }
    constructor(
      private cdr : ChangeDetectorRef,
      private readonly router: Router,
      private readonly configurationProvider: ConfigurationProvider,
      public readonly  intl: IntlService,
      private notificationFacade: NotificationFacade
    ) {}
  // data: Array<any> = [{}];
  public formUiStyle : UIFormStyle = new UIFormStyle();
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  public data = [
    {
      buttonType:"btn-h-primary",
      text: "Snooze",
      icon: "snooze",
      click: (): void => {
      },
    },
 
    
    {
      buttonType:"btn-h-danger",
      text: "Dismiss",
      icon: "notifications_off",
      click: (): void => {
      },
    },
   
    
  ];
  public loadNotificationsAndReminders() {
    this.isToDoGridLoaderShow.next(true);
    this.isLoadReminderAndNotificationEvent.emit({ });
    this.notificationList$.subscribe((data: any) => {
      this.gridDataResult = data?.items;
      if (data?.totalCount >= 0 || data?.totalCount === -1) {
      this.alertsData.items =  data.items.filter((item:any) => item.alertTypeCode == 'NOTIFICATION');
        this.isToDoGridLoaderShow.next(false);
      }
      this.notificationaAndReminderDataSubject.next(this.gridDataResult);
    });
  }
  public get entityTypes(): typeof ToDoEntityTypeCode {
    return ToDoEntityTypeCode;
  }
  onNavigationClicked(result: any) {
    if (result.entityTypeCode == this.entityTypes.Client) {
      this.router.navigate([`/case-management/cases/case360/${result.entityId}`]);
    }
    else if(result.entityTypeCode == this.entityTypes.Vendor)
    { 
      this.getVendorProfile(result.vendorTypeCode);
     
      const query = {
        queryParams: {
          v_id: result?.entityId ,
          tab_code : this.tabCode
        },
      };
      this.router.navigate(['/financial-management/vendors/profile'], query )
    }
    this.closeDialog.emit();
  }
  getVendorProfile(vendorTypeCode :any) {
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
  toggleDescription(message: any) {
    message.showFullDescription = !message.showFullDescription;
  }
}