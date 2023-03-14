/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import { ClientEmployer, EmploymentFacade} from '@cms/case-management/domain';
import {  SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-remove-employer-confirmation',
  templateUrl: './remove-employer-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveEmployerConfirmationComponent{
  /** Public properties **/
  @Input() selectedEmployer: ClientEmployer = new ClientEmployer();
  @Input() clientCaseEligibilityId: any;
  @Input() clientId: any;
  @Input() clientCaseId: any;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() deleteUpdateEmploymentEvent = new EventEmitter<any>();
  sessionId!: string;
  btnDisabled = false;
  /** Constructor **/
  constructor(
    private readonly employmentFacade: EmploymentFacade) { }

   /** Internal event methods **/ 
  removeEmployer() {
    this.employmentFacade.showLoader()
    this.selectedEmployer.clientCaseEligibilityId = this.clientCaseEligibilityId;
    if (this.selectedEmployer) {
      this.btnDisabled = true
      this.employmentFacade.deleteEmployer(this.clientId,this.selectedEmployer.clientEmployerId).subscribe({
        next: (response) => {
          this.onRemoveEmployerConfirmationClosed();
          this.employmentFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Employer removed successfully')
          this.deleteUpdateEmploymentEvent.next(response);
          this.employmentFacade.hideLoader()
        },
        error: (err) => {
          this.btnDisabled = false;
          this.employmentFacade.hideLoader()
          this.employmentFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
      );
    }
  }
  // closing the remove employment popup
  onRemoveEmployerConfirmationClosed() {
    this.closeModal.emit(true);
  }
}
