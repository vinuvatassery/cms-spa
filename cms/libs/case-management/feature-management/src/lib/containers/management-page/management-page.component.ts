/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription, first } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, ManagementFacade, NavigationType } from '@cms/case-management/domain';

import { ActivatedRoute,  Router } from '@angular/router';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementPageComponent implements OnInit, OnDestroy {
  /** Public properties **/
  isVisible: any;
  isSelected = true;
  clientId ! : number
  clientCaseEligibilityId ! : string
  clientCaseId! : string;
  sessionId! : string;
  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  private sessionDataSubscription !: Subscription;
  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private managementFacade: ManagementFacade,
    private loaderService:LoaderService,
    private router : Router,
    private route: ActivatedRoute) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.addSaveSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
    this.sessionDataSubscription.unsubscribe();
  }

  /** Private Methods **/
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.navigate(navigationType);
      }
    });
  }

  private save() {
    let isValid = true;
    // TODO:Validation functionality is pending as the Save and Other related work is not in Sprint 2.2 scope.
    if (isValid) {
      return this.managementFacade.save();
    }

    return of(false)
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.pipe(
      mergeMap((statusResponse: boolean) =>
        forkJoin([of(statusResponse), this.save()])
      ),
    ).subscribe(([statusResponse, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.router.navigate([`/case-management/cases/case360/${this.clientCaseId}`])
      }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        if(this.checkValidations()){
          this.workflowFacade.showSaveForLaterConfirmationPopup(true);
        }
      }
    });
  }

  checkValidations(){
    // TO DO:Validation functionality is pending as the Save and Other related work is not in Sprint 2.2 scope.
    return true;
  }

  private loadSessionData()
  {  
   this.sessionId = this.route.snapshot.queryParams['sid'];    
   this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.sessionDataSubscription=this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
    .subscribe((session: any) => {      
     this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId   
     this.clientCaseEligibilityId =JSON.parse(session.sessionData).clientCaseEligibilityId   
     this.clientId = JSON.parse(session.sessionData).clientId   
    });        
  } 
}
