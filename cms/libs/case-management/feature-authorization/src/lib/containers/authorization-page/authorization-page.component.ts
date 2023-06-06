/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkFlowProgress, WorkflowFacade } from '@cms/case-management/domain';
import { LoaderService } from '@cms/shared/util-core';
import { first } from 'rxjs';

@Component({
  selector: 'case-management-authorization-page',
  templateUrl: './authorization-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPageComponent implements OnInit{
  btnDisabled = false; 
  isCerForm = false;
  sessionId! : string
  prevClientCaseEligibilityId! : string  
  reviewUrl! : string
  processId! : string
  entityId! : string
  workflowType! : string

    /** Constructor **/
    constructor(     
      private readonly workflowFacade: WorkflowFacade,    
      private readonly loaderService: LoaderService,  
      private readonly route: ActivatedRoute,
      private readonly router: Router,
     ) { }

    /** Lifecycle hooks **/
    ngOnInit(): void {
      this.loadEligibilityReviewUrlData();
    
    }
  

    loadEligibilityReviewUrlData() {      
      this.sessionId = this.route.snapshot.queryParams['sid'];   
      this.workflowType  = this.route.snapshot.queryParams['wtc'];
      this.entityId = this.route.snapshot.queryParams['eid'];         
      this.workflowFacade.loadWorkFlowMaster(this.sessionId)
      this.workflowFacade.routesData$.pipe(first((routesData : WorkFlowProgress[]) => routesData.length > 0))
      .subscribe((workFlowProgress: WorkFlowProgress[]) => {             
        const routesData = workFlowProgress;  
        const maxSequenceNumber = routesData.reduce((prev, curr) => prev > curr.sequenceNbr ? prev : curr.sequenceNbr, 0)   
        this.reviewUrl = routesData.filter((route: WorkFlowProgress) => route.sequenceNbr === maxSequenceNumber)[0]?.url       
      })
      
    }
  
    navigateReviewPage()
    {
      this.router.navigate(
        [this.reviewUrl],
        {
          queryParams: {
            sid: this.sessionId,
            pid: this.processId,
            eid: this.entityId,
            wtc : this.workflowType
          }
        }
      );
    }
}
