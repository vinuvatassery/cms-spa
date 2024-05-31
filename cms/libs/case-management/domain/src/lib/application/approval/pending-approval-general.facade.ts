import { Injectable } from '@angular/core';
import { PendingApprovalGeneralService } from '../../infrastructure/approval/pending-approval-general.data.service';
import { Subject } from 'rxjs';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';

/** External libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Providers **/


@Injectable({ providedIn: 'root' })
export class PendingApprovalGeneralFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'EntryDate';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  /** Private properties **/
  private invoiceDataSubject = new Subject<any>();
  private serviceDataSubject = new Subject<any>();
  private isInvoiceLoadingSubject = new Subject<boolean>();
  private selectedMasterDetailSubject = new Subject<any>();
  private submitGenerealRequestSubject = new Subject<any>();

  /** Public properties **/
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  serviceData$ = this.serviceDataSubject.asObservable();
  invoiceData$ = this.invoiceDataSubject.asObservable();
  isInvoiceLoading$ = this.isInvoiceLoadingSubject.asObservable();
  submitGenerealRequest$ = this.submitGenerealRequestSubject.asObservable();
  selectedMasterDetail$ = this.selectedMasterDetailSubject.asObservable();



  showLoader() { this.loaderService.show(); }

  errorShowHideSnackBar( subtitle : any)
  {
    this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR,subtitle, NotificationSource.UI)
  }

  /** Constructor **/
  constructor(
    private pendingApprovalGeneralService: PendingApprovalGeneralService,
  private loggingService: LoggingService,
  private readonly notificationSnackbarService: NotificationSnackbarService,
  private configurationProvider: ConfigurationProvider,
  private readonly loaderService: LoaderService
  ) {}
  hideLoader() { this.loaderService.hide(); }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
  }


  /** Private properties **/
  private approvalsGeneralSubject = new Subject<any>();
  private approvalsGeneralExceptionCardSubject = new Subject<any>();

  /** Public properties **/
  approvalsGeneralList$ = this.approvalsGeneralSubject.asObservable();
  approvalsGeneralExceptionCardSubjectList$ = this.approvalsGeneralExceptionCardSubject.asObservable();


  /** Public methods **/
  loadApprovalsGeneral(): void {
    this.showLoader();
    this.pendingApprovalGeneralService.loadApprovalsGeneral().subscribe({
      next: (approvalGeneralResponse) => {
        this.approvalsGeneralSubject.next(approvalGeneralResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        this.hideLoader();
      },
    });
  }

  loadExceptionCard(data:any) {
    return this.pendingApprovalGeneralService.loadExceptionCard(data);
  }

  /** Public methods **/
  loadInvoiceListGrid(invoiceDto:any){
    this.isInvoiceLoadingSubject.next(true);
    this.pendingApprovalGeneralService.loadInvoiceListService(invoiceDto).subscribe({
      next: (dataResponse: any) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.invoiceDataSubject.next(gridView);
        this.isInvoiceLoadingSubject.next(false);

      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        this.isInvoiceLoadingSubject.next(false);
      },
    });
  }

  loadCasereassignmentExpandedInfo(approvalId : any) {
    return this.pendingApprovalGeneralService.loadCasereassignmentExpandedInfo(approvalId);
  }

  submitGeneralRequests(requests: any) {
    this.showLoader();
    this.pendingApprovalGeneralService.submitGeneralRequests(requests).subscribe(
      {
        next: (response: any) => {
          this.hideLoader();
          if(response.status)
          {
            this.notificationSnackbarService.manageSnackBar(
              SnackBarNotificationType.SUCCESS,
              response.message
            );
          }
          else{
            this.notificationSnackbarService.manageSnackBar(
              SnackBarNotificationType.ERROR,
              response.message
            );
          }
          this.submitGenerealRequestSubject.next(response);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
    );
  }
  getMasterDetails(masterDetailId: string,subTypeCode: string) {
    this.showLoader();
    this.pendingApprovalGeneralService.getMasterDetails(masterDetailId, subTypeCode).subscribe({
      next: (vendorDetail: any) => {
        this.selectedMasterDetailSubject.next(vendorDetail);
        this.hideLoader();
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    });
  }

  getMasterDetailData(masterDetailId: string,subTypeCode: string) {
    this.showLoader();
    return this.pendingApprovalGeneralService.getMasterDetails(masterDetailId, subTypeCode);
  }

}
