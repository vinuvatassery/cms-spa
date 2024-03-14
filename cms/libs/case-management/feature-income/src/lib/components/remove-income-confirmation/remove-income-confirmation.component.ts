/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IncomeFacade, WorkflowFacade } from '@cms/case-management/domain';
import {  SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-remove-income-confirmation',
  templateUrl: './remove-income-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveIncomeConfirmationComponent {
  @Input() selectedIncome: any;
  @Input() clientCaseEligibilityId: any;
  @Input() clientId: any;
  @Input() clientCaseId: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() closePopup: EventEmitter<boolean> = new EventEmitter();
  @Output() public sendDetailToIncomeList = new EventEmitter<any>();
  @Output() deleteUpdateIncomeEvent = new EventEmitter<any>();
  @Output() public loadIncomeList = new EventEmitter<any>();
  sessionId!: string;
  btnDisabled = false
  /** Constructor **/
  constructor(
    private readonly incomeFacade: IncomeFacade,
    private readonly router: Router,
    private route: ActivatedRoute,
    private workflowFacade: WorkflowFacade) { }

  /** Internal event methods **/ 
  removeIncome() {
    if (this.selectedIncome) {
      this.btnDisabled = true;
      this.incomeFacade.showLoader();
      this.incomeFacade.deleteIncome(this.selectedIncome.clientIncomeId,this.clientId).subscribe({
        next: (response: any) => {
          this.onRemoveIncomeConfirmationClosed();
          this.incomeFacade.hideLoader();
          this.incomeFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Income removed successfully')
          this.loadIncomeList.next(true);
        },
        error: (err: any) => {
          this.btnDisabled = false;
          this.incomeFacade.hideLoader();
          this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
      );
    }
  }
  // closing the remove income popup
  onRemoveIncomeConfirmationClosed() {
    this.closeModal.emit(true);
    this.closePopup.emit(false);
  }
}
