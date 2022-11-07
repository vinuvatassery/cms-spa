/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Approval } from '../entities/approval';
/** Data services **/
import { ApprovalDataService } from '../infrastructure/approval.data.service';

@Injectable({ providedIn: 'root' })
export class ApprovalFacade {
  /** Private properties **/
  private approvalsSubject = new BehaviorSubject<Approval[]>([]);

  /** Public properties **/
  approvals$ = this.approvalsSubject.asObservable();

  /** Constructor **/
  constructor(private readonly approvalDataService: ApprovalDataService) {}

  /** Public methods **/
  loadApprovals(): void {
    this.approvalDataService.loadApprovals().subscribe({
      next: (approvalResponse) => {
        this.approvalsSubject.next(approvalResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
