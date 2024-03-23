import { Injectable } from '@angular/core';
import { PendingApprovalPaymentService } from '../../infrastructure/approval/pending-approval-payment.data.service';
import { Subject } from 'rxjs';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ApprovalUserStatusCode } from '../../enums/approval-user-status-code.enum';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class PendingApprovalPaymentFacade {

  public sortValueApprovalPaymentsApproval = 'batchName';
  public sortApprovalPaymentsList: SortDescriptor[] = [{
    field: this.sortValueApprovalPaymentsApproval,
    dir: 'desc',
  }];

  /** Private properties **/
  private pendingApprovalGridSubject = new Subject<any>();
  private pendingApprovalMainListSubject = new Subject<any>();
  private pendingApprovalSubmittedSummarySubject = new Subject<any>();
  private pendingApprovalBatchDetailPaymentsCountSubject = new Subject<any>();
  private pendingApprovalBatchDetailPaymentsGridSubject = new Subject<any>();
  private pendingApprovalSubmitSubject = new Subject<any>();
  private pendingApprovalPaymentsCountSubject = new Subject<any>();

  /** Public properties **/
  pendingApprovalGrid$ = this.pendingApprovalGridSubject.asObservable();
  approverCount = 0;
  sendBackCount = 0;

  pendingApprovalMainList$ = this.pendingApprovalMainListSubject.asObservable();
  pendingApprovalSubmittedSummary$ = this.pendingApprovalSubmittedSummarySubject.asObservable();
  pendingApprovalBatchDetailPaymentsCount$ = this.pendingApprovalBatchDetailPaymentsCountSubject.asObservable();
  pendingApprovalBatchDetailPaymentsGrid$ = this.pendingApprovalBatchDetailPaymentsGridSubject.asObservable();
  pendingApprovalSubmit$ = this.pendingApprovalSubmitSubject.asObservable();
  pendingApprovalPaymentsCount$ = this.pendingApprovalPaymentsCountSubject.asObservable();
  approvalPaymentProfilePhotoSubject = new Subject();

  constructor(
    private readonly PendingApprovalPaymentService: PendingApprovalPaymentService,
    private readonly loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly userManagementFacade: UserManagementFacade,
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
            this.approverCount = this.sendBackCount = 0;
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
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
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        },
      }
    );
  }

  loadSubmittedSummary(paymentRequestBatchIds: string[]) {
    this.showLoader();
    this.PendingApprovalPaymentService.loadSubmittedSummary(paymentRequestBatchIds).subscribe(
      {
        next: (paymentsSummaryResponseDto: any) => {
            this.hideLoader();
            this.pendingApprovalSubmittedSummarySubject.next(paymentsSummaryResponseDto);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
    );
  }

  getPendingApprovalBatchDetailPaymentsGrid(gridSetupData: any, batchId: string, serviceSubType: string) {
    this.PendingApprovalPaymentService.getPendingApprovalBatchDetailPaymentsGrid(gridSetupData, batchId, serviceSubType).subscribe({
      next: (dataResponse: any) => {
        const gridView = {
          data: dataResponse["items"],
          total: dataResponse["totalCount"]
        };
          this.pendingApprovalBatchDetailPaymentsGridSubject.next(gridView);
          this.loadApprovalPaymentsDistinctUserIdsAndProfilePhoto(dataResponse["items"]);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
      },
    });
  }

  loadApprovalPaymentsDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.approvalPaymentProfilePhotoSubject.next(data);
          }
        },
      });
    }
  } 

  submitForApproval(data: any) {
    this.showLoader();
    this.PendingApprovalPaymentService.submitForApproval(data).subscribe(
      {
        next: (response: any) => {
          this.hideLoader();
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.SUCCESS,
            response.message
          );
          this.pendingApprovalSubmitSubject.next(response);
          this.pendingApprovalPaymentsCountSubject.next(response);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
    );
  }

}
