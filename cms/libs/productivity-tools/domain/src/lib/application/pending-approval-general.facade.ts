import { Injectable } from '@angular/core';
import { PendingApprovalGeneralService } from '../infrastructure/pending-approval-general.data.service';
import { Subject } from 'rxjs';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class PendingApprovalGeneralFacade {
    
  /** Private properties **/
  private approvalsGeneralSubject = new Subject<any>();

  /** Public properties **/
  approvalsGeneralList$ = this.approvalsGeneralSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly pendingApprovalGeneralService: PendingApprovalGeneralService
  ) {}

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
}
