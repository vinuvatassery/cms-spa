/** Angular **/
import { Component,OnInit, ChangeDetectionStrategy } from '@angular/core';
import { first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { WorkflowFacade,ClientDocumentFacade,IncomeFacade } from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'case-management-client-eligibility',
  templateUrl: './client-eligibility.component.html',
  styleUrls: ['./client-eligibility.component.scss'],

})
export class ClientEligibilityComponent implements OnInit {
  /** Public properties **/
  isShowException = false;
  isOpenAcceptance = false;
  isOpenDeny = false;
  isDenialLetter = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  sessionId: any = "";
  clientId: any;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  income: any;
  incomDocuments: any = [];

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,private route: ActivatedRoute
    ,private clientDocumentFacade:ClientDocumentFacade
    ,private incomeFacade:IncomeFacade

    ) { }

  ngOnInit(): void {

    this.loadSessionData();
  }

  loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          const sessionData=JSON.parse(session.sessionData);
          this.clientCaseId = sessionData.ClientCaseId;
          this.clientCaseEligibilityId = sessionData.clientCaseEligibilityId;
          this.clientId = sessionData.clientId;

          this.clientDocumentFacade.getClientDocumentsByClientCaseEligibilityId(this.clientCaseEligibilityId).subscribe((data: any) => {
           this.incomDocuments=data.filter((m:any)=>m.entityTypeCode==='Income');
            this.getIncomeEligibility();
          },(error) => {
              //this.ShowHideSnackBar(SnackBarNotificationType.ERROR, error)
            })

        }
      });

  }
  getIncomeEligibility() {
    this.incomeFacade.getIncomeEligibility(this.clientCaseEligibilityId,this.clientId).subscribe((data: any) => {
    this.income=data;
     },(error:any) => {
         //this.ShowHideSnackBar(SnackBarNotificationType.ERROR, error)
       })
  }

  /** Internal event methods **/
  onToggleExceptionClicked() {
    this.isShowException = !this.isShowException;
  }

  onCloseAcceptanceClicked() {
    this.isOpenAcceptance = false;
  }

  isOpenAcceptanceClicked() {
    this.isOpenAcceptance = true;
  }

  isCloseDenyClicked() {
    this.isOpenDeny = false;
  }

  isOpenDenyClicked() {
    this.isOpenDeny = true;
  }
  handleClosAfterDeny(event:boolean) {
    if(event)
    {
      this.isOpenDeny = false;
      this.isDenialLetter = true;
    }
    else
    {
      this.isOpenDeny = false;
      this.isDenialLetter = false;
    }
  }
  DenialPopupClose()
  {
    this.isDenialLetter = false;
  }
}
