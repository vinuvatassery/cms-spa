/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientEmployer, EmploymentFacade, WorkflowFacade } from '@cms/case-management/domain';
import {  first } from 'rxjs';
import {  SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-remove-employer-confirmation',
  templateUrl: './remove-employer-confirmation.component.html',
  styleUrls: ['./remove-employer-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveEmployerConfirmationComponent implements OnInit{
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

  /** Lifecycle hooks **/
  ngOnInit(): void {
  }
  /** Internal event methods **/

  // click on Delete employer confirmation
  removeEmployer() {
    this.employmentFacade.showLoader()
    this.selectedEmployer.clientCaseEligibilityId = this.clientCaseEligibilityId;
    if (this.selectedEmployer) {
      this.btnDisabled = true
      this.employmentFacade.deleteEmployer(this.selectedEmployer.clientCaseEligibilityId, this.selectedEmployer.clientEmployerId ).subscribe({
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
