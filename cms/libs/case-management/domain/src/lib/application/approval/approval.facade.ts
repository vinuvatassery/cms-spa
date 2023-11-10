import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, ReminderNotificationSnackbarService, ReminderSnackBarNotificationType, SnackBarNotificationType } from '@cms/shared/util-core';
/** Entities **/ 
/** Data services **/
import { ApprovalDataService } from '../../infrastructure/approval/approval.data.service';

@Injectable({ providedIn: 'root' })
export class ApprovalFacade {
  
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueGeneralAPproval = 'batch';
  public sortGeneralList: SortDescriptor[] = [{
    field: this.sortValueGeneralAPproval,
  }];

  public sortValueApprovalPaymentsAPproval = 'batch';
  public sortApprovalPaymentsList: SortDescriptor[] = [{
    field: this.sortValueApprovalPaymentsAPproval,
  }];
  public sortValueImportedClaimsAPproval = 'batch';
  public sortImportedClaimsList: SortDescriptor[] = [{
    field: this.sortValueImportedClaimsAPproval,
  }];


  /** Private properties **/
  private approvalsPaymentsSubject =  new Subject<any>();
  private ImportedClaimsSubject =  new Subject<any>();

  /** Public properties **/
  approvalsPaymentsList$ = this.approvalsPaymentsSubject.asObservable();
  approvalsImportedClaimsLists$ = this.ImportedClaimsSubject.asObservable();

    // handling the snackbar & loader
    snackbarMessage!: SnackBar;
    snackbarSubject = new Subject<SnackBar>(); 
  
    showLoader() { this.loaderService.show(); }
    hideLoader() { this.loaderService.hide(); }
  
    errorShowHideSnackBar( subtitle : any)
    {
      this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR,subtitle, NotificationSource.UI)
    }
    showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
      if (type == SnackBarNotificationType.ERROR) {
        const err = subtitle;
        this.loggingService.logException(err)
      }
      this.notificationSnackbarService.manageSnackBar(type, subtitle)
      this.hideLoader();
    }


  NotifyShowHideSnackBar(type: ReminderSnackBarNotificationType, subtitle: any) {
    if (type == ReminderSnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
      this.reminderNotificationSnackbarService.manageSnackBar(type, subtitle)
      this.hideLoader();
    }

  /** Constructor **/ 
  constructor(
    public approvalDataService: ApprovalDataService,
    private loggingService: LoggingService,  
    private readonly reminderNotificationSnackbarService: ReminderNotificationSnackbarService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/
  loadApprovalsPayments(): void {
    this.approvalDataService.loadPendingPaymentsListsServices().subscribe({
      next: (approvalsPaymentsResponse) => {
        this.approvalsPaymentsSubject.next(approvalsPaymentsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadImportedClaimsLists(): void {
    this.approvalDataService.loadImportedClaimsListServices().subscribe({
      next: (Response) => {
        this.ImportedClaimsSubject.next(Response);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
