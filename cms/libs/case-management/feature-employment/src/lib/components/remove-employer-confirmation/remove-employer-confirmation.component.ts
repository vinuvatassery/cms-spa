/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ClientEmployer, EmploymentFacade, WorkflowFacade } from '@cms/case-management/domain';
 
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import { LoaderService } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-remove-employer-confirmation',
  templateUrl: './remove-employer-confirmation.component.html',
  styleUrls: ['./remove-employer-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveEmployerConfirmationComponent {
  /** Public properties **/
  @Input() selectedEmployer: ClientEmployer = new ClientEmployer();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() deleteUpdateEmploymentEvent = new EventEmitter<any>();
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  handleSnackBar(title : string , subtitle : string ,type : string )
  {    
    const snackbarMessage: SnackBar = {
      title: title,
      subtitle: subtitle,
      type: type,
    };
    this.snackbarSubject.next(snackbarMessage);
  }
  clientId = this.workflowFacade.clientId;
  clientCaseId = this.workflowFacade.clientCaseId;
  clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId;
  /** Constructor **/
  constructor(
    private readonly employmentFacade: EmploymentFacade, 
    private loaderService: LoaderService,
    private workflowFacade: WorkflowFacade) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
  }

  /** Internal event methods **/
  onRemoveEmployerConfirmationClosed() {
    this.closeModal.emit(true);
  }

  removeEmployer() {
    this.loaderService.show()
    this.selectedEmployer.clientCaseEligibilityId = this.clientCaseEligibilityId;
    if (this.selectedEmployer) {
      this.employmentFacade.deleteEmployer(this.selectedEmployer.clientCaseEligibilityId, this.selectedEmployer.clientEmployerId ).subscribe({
        next: (response) => {
          this.onRemoveEmployerConfirmationClosed();
          this.handleSnackBar('Success' ,'Employer Successfully Removed','info');
          this.deleteUpdateEmploymentEvent.next(response);  
          this.loaderService.hide() 
        },
        error: (err) => {
          this.handleSnackBar( err.code + ' / ' + err.name ,err.message,'error');  
          this.loaderService.hide()

        },
      }
      );
    }
  }
}
