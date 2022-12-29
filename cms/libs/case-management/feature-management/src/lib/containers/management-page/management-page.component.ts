/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
/** External libraries **/
import { first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade,  NavigationType, CaseManagerFacade } from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';

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
  clientCaseId! : string;
  sessionId! : string;
  clientId ! : number
  clientCaseEligibilityId ! : string

  getCaseManagers$ = this.caseManagerFacade.getCaseManagers$;

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private caseManagerFacade: CaseManagerFacade,
    private route: ActivatedRoute) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.addSaveSubscription();
    this.loadCase()
    
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private Methods **/
    
      private loadCase()
      {  
       this.sessionId = this.route.snapshot.queryParams['sid'];    
       this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
        this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
        .subscribe((session: any) => {      
         this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId   
         this.clientCaseEligibilityId =JSON.parse(session.sessionData).clientCaseEligibilityId   
         this.clientId = JSON.parse(session.sessionData).clientId   
         this.loadCaseManagers()    
        });        
      } 

  loadCaseManagers()
  {
    this.caseManagerFacade.loadCaseManagers(this.clientCaseId);
  }

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
  
    // TODO: validate the form
    if (true) {
    //  return this.managementFacade.save();
    }

    return of(false)
  }
}
