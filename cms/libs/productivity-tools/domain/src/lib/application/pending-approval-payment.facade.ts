import { Injectable } from '@angular/core';
import { PendingApprovalPaymentService } from '../infrastructure/pending-approval-payment.service';
import { Subject } from 'rxjs';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class PendingApprovalPaymentFacade {
  /** Private properties **/
  private pendingApprovalCountSubject = new Subject<any>();
  private pendingApprovalGridSubject = new Subject<any>();
  private pendingApprovalMainListSubject = new Subject<any>();
  private pendingApprovalSubmittedSummarySubject = new Subject<any>();

  /** Public properties **/
  pendingApprovalCount$ = this.pendingApprovalCountSubject.asObservable();
  pendingApprovalGrid$ = this.pendingApprovalGridSubject.asObservable();
  pendingApprovalMainList$ = this.pendingApprovalMainListSubject.asObservable();
  pendingApprovalSubmittedSummary$ = this.pendingApprovalSubmittedSummarySubject.asObservable();
  constructor(
    private readonly PendingApprovalPaymentService: PendingApprovalPaymentService,
    private readonly loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
  ) {

  }
  
  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
      if(type == SnackBarNotificationType.ERROR)
      {
        const err= subtitle;    
        this.loggingService.logException(err)
      }  
        this.notificationSnackbarService.manageSnackBar(type,subtitle)
        this.hideLoader();   
  }

  showLoader()
  {
    this.loaderService.show();
  }
    
  hideLoader()
  {
    this.loaderService.hide();
  }

  getAllPendingApprovalPaymentCount() {
    this.PendingApprovalPaymentService.getAllPendingApprovalPaymentCount().subscribe(
      {
        next: (count: any) => {
            this.pendingApprovalCountSubject.next(count);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
        },
      }
    );
  }
  
  getPendingApprovalPaymentGrid(gridSetupData: any, serviceSubType: string) {

    this.PendingApprovalPaymentService.getPendingApprovalPaymentGrid(gridSetupData ,serviceSubType).subscribe(
      {
        next: (dataResponse: any) => {
          const gridView = {
            data: dataResponse["items"],
            total: dataResponse["totalCount"]
          };
            this.pendingApprovalGridSubject.next(gridView);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
        },
      }
    );
  }

  getPendingApprovalPaymentMainList(gridSetupData: any, serviceSubType: string) {

    this.PendingApprovalPaymentService.getPendingApprovalPaymentMainList(gridSetupData ,serviceSubType).subscribe(
      {
        next: (dataResponse: any) => {
          const gridView = {
            data: dataResponse["items"],
            total: dataResponse["totalCount"]
          };
            this.pendingApprovalMainListSubject.next(gridView);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
        },
      }
    );
  }

  loadSubmittedSummary(paymentRequestBatchIds: string[]) {
    this.PendingApprovalPaymentService.loadSubmittedSummary(paymentRequestBatchIds).subscribe(
      {
        next: (paymentsSummaryResponseDto: any) => {
            this.pendingApprovalSubmittedSummarySubject.next(paymentsSummaryResponseDto);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
        },
      }
    );
  }
}
