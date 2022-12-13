/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientEmployer, EmploymentFacade, WorkflowFacade } from '@cms/case-management/domain';
 
import { SnackBar } from '@cms/shared/ui-common';
import {  first, Subject } from 'rxjs';
import { LoaderService } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-remove-employer-confirmation',
  templateUrl: './remove-employer-confirmation.component.html',
  styleUrls: ['./remove-employer-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveEmployerConfirmationComponent implements OnInit{
  /** Public properties **/
  @Input() selectedEmployer: ClientEmployer = new ClientEmployer();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() deleteUpdateEmploymentEvent = new EventEmitter<any>();
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  sessionId!: string;
  clientId: any;
  clientCaseId : any;
  clientCaseEligibilityId : any;

  // Snackbar declaration
  handleSnackBar(title : string , subtitle : string ,type : string )
  {    
    const snackbarMessage: SnackBar = {
      title: title,
      subtitle: subtitle,
      type: type,
    };
    this.snackbarSubject.next(snackbarMessage);
  }

  /** Constructor **/
  constructor(
    private readonly employmentFacade: EmploymentFacade, 
    private loaderService: LoaderService,
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

  // click on remove employer confirmation
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
  // closing the remove employment popup
  onRemoveEmployerConfirmationClosed() {
    this.closeModal.emit(true);
  }
}
