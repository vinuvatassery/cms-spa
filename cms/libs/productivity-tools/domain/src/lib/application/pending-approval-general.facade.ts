import { Injectable } from '@angular/core';
import { PendingApprovalGeneralService } from '../infrastructure/pending-approval-general.data.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class PendingApprovalGeneralFacade {

  /** Private properties **/
  private approvalsGeneralSubject = new Subject<any>();
  private ClientsSubjects = new BehaviorSubject<any>([]);


  /** Public properties **/
  approvalsGeneralList$ = this.approvalsGeneralSubject.asObservable();
  ClientsSubjects$ = this.ClientsSubjects.asObservable();


  /** Constructor **/
  constructor(
    private readonly pendingApprovalGeneralService: PendingApprovalGeneralService,
     private loggingService: LoggingService,
     private readonly loaderService: LoaderService,
     private readonly notificationSnackbarService: NotificationSnackbarService,
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

  /** Public methods **/
  loadApprovalsGeneral(): void {
    this.pendingApprovalGeneralService.loadApprovalsGeneral().subscribe({
      next: (approvalGeneralResponse) => {
        this.approvalsGeneralSubject.next(approvalGeneralResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  getUserById(){
    this.pendingApprovalGeneralService.getUserById().subscribe({
      next: (value)=>{
        this.ClientsSubjects.next(value);
      },
      error:(err)=>{
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    })
  }
}
