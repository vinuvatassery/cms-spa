/** Angular **/
import { Component, ChangeDetectionStrategy, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/** External Libraries **/
import { ConfigurationProvider, LoaderService, LoggingService } from '@cms/shared/util-core';
import { WorkflowFacade, CommunicationFacade } from '@cms/case-management/domain';
import { UserDataService } from '@cms/system-config/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subscription} from 'rxjs';

@Component({
  selector: 'case-management-authorization-page',
  templateUrl: './authorization-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPageComponent {
  btnDisabled = true; 
  dateSignature?:any;
  prevClientCaseEligibilityId!: string;
  @Input() cerDateSignatureEvent =  new EventEmitter();
  clientId!: any;
  clientCaseEligibilityId!: any;
  isCerForm: boolean = false;
  /** Private properties **/
  private currentSessionSubscription !: Subscription;

  constructor(
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly workflowFacade: WorkflowFacade,
    private readonly route: ActivatedRoute,
    private readonly intl: IntlService,
    private readonly ref: ChangeDetectorRef,
  ) {   }

ngOnInit(): void 
{
  this.loadCurrentSession();
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
}