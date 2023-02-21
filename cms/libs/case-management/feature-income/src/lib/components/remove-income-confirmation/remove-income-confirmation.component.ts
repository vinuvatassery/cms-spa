/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientEmployer, IncomeFacade, WorkflowFacade } from '@cms/case-management/domain';
import {  first } from 'rxjs';
import {  SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-remove-income-confirmation',
  templateUrl: './remove-income-confirmation.component.html',
  styleUrls: ['./remove-income-confirmation.component.scss'],
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

  sessionId!: string;
  btnDisabled = false
  /** Constructor **/
  constructor(
    private readonly incomeFacade: IncomeFacade, 
    private readonly router: Router,
    private route: ActivatedRoute,
    private workflowFacade: WorkflowFacade) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {

  }

  /** Internal event methods **/

  // click on Delete employer confirmation
  removeIncome() {
    if (this.selectedIncome) {      
      this.btnDisabled = true;
      this.incomeFacade.ShowLoader();
      this.incomeFacade.deleteIncome(this.selectedIncome.clientIncomeId,this.clientId, this.clientCaseEligibilityId ).subscribe({
        next: (response: any) => {        
          this.onRemoveIncomeConfirmationClosed();     
          this.incomeFacade.HideLoader();
          this.incomeFacade.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Income removed successfully') 
          this.sendDetailToIncomeList.next(true);
        },
        error: (err: any) => {
          this.btnDisabled = false;
          this.incomeFacade.HideLoader();
          this.incomeFacade.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
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
