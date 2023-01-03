/** Angular **/
import { Component,OnInit, ChangeDetectionStrategy ,ChangeDetectorRef} from '@angular/core';
import { first, forkJoin, mergeMap } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { WorkflowFacade,ClientDocumentFacade,ClientEligibilityFacade,ClientDocumnetEntityType } from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';
import { LoaderService} from '@cms/shared/util-core';
@Component({
  selector: 'case-management-client-eligibility',
  templateUrl: './client-eligibility.component.html',
  styleUrls: ['./client-eligibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  eligibility: any;
  incomDocuments: any = [];
  oregonDocuments: any = [];
  HIVDocuments: any = [];  

  /** Constructor **/
  constructor(
    private cdr: ChangeDetectorRef
    ,private readonly loaderService: LoaderService
    ,private workflowFacade: WorkflowFacade,private route: ActivatedRoute
    ,private clientDocumentFacade:ClientDocumentFacade
    ,private clientEligibilityFacade:ClientEligibilityFacade
    
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
           this.incomDocuments=data.filter((m:any)=>m.entityTypeCode===ClientDocumnetEntityType.Income);
           this.oregonDocuments=data.filter((m:any)=>m.entityTypeCode===ClientDocumnetEntityType.HomeAddressProof);
           this.HIVDocuments=data.filter((m:any)=>m.entityTypeCode===ClientDocumnetEntityType.HivVerification);
            this.getIncomeEligibility();
          },(error) => {
              //this.ShowHideSnackBar(SnackBarNotificationType.ERROR, error)
            })

        }
      });

  }
  getIncomeEligibility() {
    this.loaderService.show()
    this.clientEligibilityFacade.getEligibility(this.clientCaseEligibilityId,this.clientId).subscribe((data: any) => {
    this.eligibility=data;
    this.cdr.detectChanges();
    this.loaderService.hide();
     },(error:any) => {
      this.loaderService.hide();
       })
  }

 formatBytes(bytes:any, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
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
