/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ApprovalFacade } from '@cms/productivity-tools/domain';

@Component({
  selector: 'productivity-tools-approval-page',
  templateUrl: './approval-page.component.html',
  styleUrls: ['./approval-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalPageComponent implements OnInit {
  /** Public properties **/
  approvals$ = this.approvalFacade.approvals$;
  approvalPayments$ = this.approvalFacade.approvalsPaymentsList$;

  /** Contructor **/
  constructor(private readonly approvalFacade: ApprovalFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadApprovals();
  }

  /** Private methods **/
  private loadApprovals(): void {
    this.approvalFacade.loadApprovals();
  }

  private loadApprovalPaymentsGrid(): void {
    this.approvalFacade.loadApprovalPayments();
  }
}
