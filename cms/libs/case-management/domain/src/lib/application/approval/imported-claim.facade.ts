import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ImportedClaimService } from '../../infrastructure/approval/imported-claim.data.service';

@Injectable({ providedIn: 'root' })
export class ImportedClaimFacade {

  public sortValueImportedClaimsAPproval = 'clientName';
  public sortImportedClaimsList: SortDescriptor[] = [{
    field: this.sortValueImportedClaimsAPproval,
  }];

  /** Private properties **/
  // private pendingApprovalGridSubject = new Subject<any>();
  // private pendingApprovalMainListSubject = new Subject<any>();
  // private pendingApprovalSubmittedSummarySubject = new Subject<any>();
  // private pendingApprovalBatchDetailPaymentsCountSubject = new Subject<any>();
  // private pendingApprovalBatchDetailPaymentsGridSubject = new Subject<any>();
  // private pendingApprovalSubmitSubject = new Subject<any>();
  // private pendingApprovalPaymentsCountSubject = new Subject<any>();

  private ImportedClaimsSubject =  new Subject<any>();
  /** Public properties **/
  approvalsImportedClaimsLists$ = this.ImportedClaimsSubject.asObservable();


  // pendingApprovalMainList$ = this.pendingApprovalMainListSubject.asObservable();
  // pendingApprovalSubmittedSummary$ = this.pendingApprovalSubmittedSummarySubject.asObservable();
  // pendingApprovalBatchDetailPaymentsCount$ = this.pendingApprovalBatchDetailPaymentsCountSubject.asObservable();
  // pendingApprovalBatchDetailPaymentsGrid$ = this.pendingApprovalBatchDetailPaymentsGridSubject.asObservable();
  // pendingApprovalSubmit$ = this.pendingApprovalSubmitSubject.asObservable();
  // pendingApprovalPaymentsCount$ = this.pendingApprovalPaymentsCountSubject.asObservable();

  constructor(
    private readonly ImportedClaimService: ImportedClaimService,
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

  loadImportedClaimsLists(gridSetupData: any) {

    this.ImportedClaimService.loadImportedClaimsListServices(gridSetupData).subscribe(
      {
        next: (dataResponse: any) => {
          const gridView = {
            data: dataResponse["items"],
            total: dataResponse["totalCount"]
          };
            this.ImportedClaimsSubject.next(gridView);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
    );
  }
}
