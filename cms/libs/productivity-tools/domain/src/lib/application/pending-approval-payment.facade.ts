import { Injectable } from '@angular/core';
import { PendingApprovalPaymentService } from '../infrastructure/pending-approval-payment.data.service';
import { Subject } from 'rxjs';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { ApprovalUserStatusCode } from '../enums/approval-user-status-code.enum';

@Injectable({ providedIn: 'root' })
export class PendingApprovalPaymentFacade {
  /** Private properties **/
  private pendingApprovalGridSubject = new Subject<any>();
  private pendingApprovalMainListSubject = new Subject<any>();
  private pendingApprovalSubmittedSummarySubject = new Subject<any>();
  private pendingApprovalBatchDetailPaymentsCountSubject = new Subject<any>();
  private pendingApprovalBatchDetailPaymentsGridSubject = new Subject<any>();

  /** Public properties **/
  pendingApprovalGrid$ = this.pendingApprovalGridSubject.asObservable();
  approverCount = 0;
  sendBackCount = 0;

  pendingApprovalMainList$ = this.pendingApprovalMainListSubject.asObservable();
  pendingApprovalSubmittedSummary$ = this.pendingApprovalSubmittedSummarySubject.asObservable();
  pendingApprovalBatchDetailPaymentsCount$ = this.pendingApprovalBatchDetailPaymentsCountSubject.asObservable();
  pendingApprovalBatchDetailPaymentsGrid$ = this.pendingApprovalBatchDetailPaymentsGridSubject.asObservable();

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
  
  getPendingApprovalPaymentGrid(gridSetupData: any, serviceSubType: string, level: number) {

    this.PendingApprovalPaymentService.getPendingApprovalPaymentGrid(gridSetupData ,serviceSubType, level).subscribe(
      {
        next: (dataResponse: any) => {
          dataResponse.items.forEach((element:any) => {
            if(element.approvalUserStatusCode === ApprovalUserStatusCode.APPROVED){
              this.approverCount++;
            }else if(element.approvalUserStatusCode === ApprovalUserStatusCode.DENIED){
              this.sendBackCount++;
            }
          });
          const gridViewData = {
            data: dataResponse["items"],
            total: dataResponse["totalCount"],
            approverCount: this.approverCount,
            sendBackCount:this.sendBackCount,
          };
            this.pendingApprovalGridSubject.next(gridViewData);
            this.approverCount = this.sendBackCount = 0
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
        },
      }
    );
  }

  getPendingApprovalPaymentMainList(gridSetupData: any, serviceSubType: string, level: number) {
    this.PendingApprovalPaymentService.getPendingApprovalPaymentMainList(gridSetupData ,serviceSubType, level).subscribe(
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

  getPendingApprovalBatchDetailPaymentsGrid(gridSetupData: any, batchId: string, serviceSubType: string) {

    this.PendingApprovalPaymentService.getPendingApprovalBatchDetailPaymentsGrid(gridSetupData, batchId, serviceSubType).subscribe(
      {
        next: (dataResponse: any) => {
          const gridView = {
            data: dataResponse["items"],
            total: dataResponse["totalCount"]
          };
            this.pendingApprovalBatchDetailPaymentsGridSubject.next(gridView);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
        },
      }
    );
  }

}
