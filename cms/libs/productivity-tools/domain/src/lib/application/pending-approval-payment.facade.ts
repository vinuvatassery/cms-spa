import { Injectable } from '@angular/core';
import { PendingApprovalPaymentService } from '../infrastructure/pending-approval-payment.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PendingApprovalPaymentFacade {
  /** Private properties **/
  private pendingApprovalCountSubject = new Subject<any>();

  /** Public properties **/
  pendingApprovalCount$ = this.pendingApprovalCountSubject.asObservable();

  constructor(
    private readonly PendingApprovalPaymentService: PendingApprovalPaymentService
  ) {

  }

  getAllPendingApprovalPaymentCount() {
    this.PendingApprovalPaymentService.getAllPendingApprovalPaymentCount().subscribe(
      {
        next: (count: any) => {
            this.pendingApprovalCountSubject.next(count);
        },
        error: (err) => {

        },
      }
    );
  }
}
