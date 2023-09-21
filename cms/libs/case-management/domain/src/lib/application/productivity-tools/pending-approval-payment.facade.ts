import { Injectable } from '@angular/core';
import { PendingApprovalPaymentService } from '../../infrastructure/productivity-tools/pending-approval-payment.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PendingApprovalPayment {
  /** Private properties **/
  private pendingApprovalCountSubject = new Subject<number>();

  /** Public properties **/
  pendingApprovalCount$ = this.pendingApprovalCountSubject.asObservable();

  constructor(
    private readonly PendingApprovalPaymentService: PendingApprovalPaymentService
  ) {}

  getAllPendingApprovalPaymentCount() {
    this.PendingApprovalPaymentService.getAllPendingApprovalPaymentCount().subscribe(
      {
        next: (count: number) => {
            this.pendingApprovalCountSubject.next(count);
        },
        error: (err) => {},
      }
    );
  }
}
