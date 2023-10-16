import { Injectable } from '@angular/core';
import { PendingApprovalGeneralService } from '../infrastructure/pending-approval-general.data.service';
import { Subject } from 'rxjs';
import {
} from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class PendingApprovalGeneralFacade {

  /** Private properties **/
  private approvalsGeneralSubject = new Subject<any>();
  private casereassignmentExpandedInfoSubject = new Subject<any>();

  /** Public properties **/
  approvalsGeneralList$ = this.approvalsGeneralSubject.asObservable();
  casereassignmentExpandedInfo$ = this.casereassignmentExpandedInfoSubject.asObservable();

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

  loadCasereassignmentExpandedInfo(approvalId : any): void {
    this.pendingApprovalGeneralService.loadCasereassignmentExpandedInfo(approvalId).subscribe({
      next: (response) => {
        this.casereassignmentExpandedInfoSubject.next(response);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
