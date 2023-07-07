/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Approval, ApprovalPayments } from '../entities/approval';
/** Data services **/
import { ApprovalDataService } from '../infrastructure/approval.data.service';

@Injectable({ providedIn: 'root' })
export class ApprovalFacade {
  /** Private properties **/
  private approvalsSubject = new BehaviorSubject<Approval[]>([]);
  private approvalsPaymentsSubject = new  BehaviorSubject<ApprovalPayments[]>([]);

  /** Public properties **/
  approvals$ = this.approvalsSubject.asObservable();
  approvalsPaymentsList$ = this.approvalsPaymentsSubject.asObservable();

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

  loadApprovalPayments(): void {
    this.approvalDataService.loadPendingPaymentsListsServices().subscribe({
      next: (approvalsPaymentsResponse) => {
        this.approvalsPaymentsSubject.next(approvalsPaymentsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
