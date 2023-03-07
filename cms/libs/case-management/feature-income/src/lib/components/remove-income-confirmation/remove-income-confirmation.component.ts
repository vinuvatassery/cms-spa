/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IncomeFacade, WorkflowFacade } from '@cms/case-management/domain';
import {  first } from 'rxjs';
import {  SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-remove-income-confirmation',
  templateUrl: './remove-income-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveIncomeConfirmationComponent {
  @Input() selectedIncome: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() closePopup: EventEmitter<boolean> = new EventEmitter();
  @Output() public sendDetailToIncomeList = new EventEmitter<any>();
  @Output() deleteUpdateIncomeEvent = new EventEmitter<any>();
  sessionId!: string;
  clientId: any;
  clientCaseId : any;
  clientCaseEligibilityId : any;
  btnDisabled = false
  /** Constructor **/
  constructor(
    private readonly incomeFacade: IncomeFacade,
    private readonly router: Router,
    private route: ActivatedRoute,
    private workflowFacade: WorkflowFacade) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadCase();
  }

  // loading case details like session id, eligibility id , clientid and clientcaseid
  loadCase(){
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
     this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
     .subscribe((session: any) => {
      this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId
      this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId
      this.clientId =JSON.parse(session.sessionData).clientId
     });
  }
  /** Internal event methods **/

  // click on Delete employer confirmation
  removeIncome() {
    if (this.selectedIncome) {
      this.btnDisabled = true;
      this.incomeFacade.ShowLoader();
      this.incomeFacade.deleteIncome(this.selectedIncome.clientIncomeId,this.clientId).subscribe({
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
