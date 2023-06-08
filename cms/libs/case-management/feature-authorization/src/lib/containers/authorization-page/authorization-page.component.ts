/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkFlowProgress, WorkflowFacade } from '@cms/case-management/domain';
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { first, Subscription } from 'rxjs';

/** External Libraries **/
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'case-management-authorization-page',
  templateUrl: './authorization-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPageComponent implements OnInit{
  dateSignature?:any;
  btnDisabled = false; 
  isCerForm = false;
  sessionId! : string
  prevClientCaseEligibilityId! : string  
  reviewUrl! : string
  processId! : string
  entityId! : string
  workflowType! : string
  clientId!: any;
  clientCaseEligibilityId!: any;
  @Input() cerDateSignatureEvent =  new EventEmitter();

  /** Private properties **/
  private currentSessionSubscription !: Subscription;

    /** Constructor **/
    constructor(     
      private readonly workflowFacade: WorkflowFacade,    
      private readonly loaderService: LoaderService,  
      private readonly route: ActivatedRoute,
      private readonly router: Router,
      private readonly loggingService: LoggingService,
      private readonly ref: ChangeDetectorRef,
      private readonly intl: IntlService,
     ) { }

    /** Lifecycle hooks **/
    ngOnInit(): void {
      this.loadCurrentSession();
      this.loadEligibilityReviewUrlData();
    
    }
  
    private loadCurrentSession() {
  const sessionId = this.route.snapshot.queryParams['sid'];
  this.loaderService.show();
  this.workflowFacade.loadWorkFlowSessionData(sessionId);
  this.clientId = this.workflowFacade.clientId ?? 0;
  this.clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
  this.currentSessionSubscription = this.workflowFacade.sessionDataSubject$
  .subscribe({
    next: (resp: any) =>{
      if (resp) {
        this.prevClientCaseEligibilityId = JSON.parse(resp.sessionData)?.prevClientCaseEligibilityId;
        if (this.prevClientCaseEligibilityId) {
          this.isCerForm = true
          this.ref.detectChanges();
        }
      }
      this.loaderService.hide();
  },
  error: (err: any) => {
    this.loaderService.hide();
    this.workflowFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
    this.loggingService.logException(err);
  },
});
}

loadDateSignature(event : Date){
  this.dateSignature = event;
  if(this.dateSignature != null){
    this.btnDisabled = false;
  }else{
    this.btnDisabled = true;
  }
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