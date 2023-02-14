/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { first } from 'rxjs';
/** Facades **/
import { CaseFacade,WorkflowFacade,ClientEligibilityFacade, ClientEligibilityInfo } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { ActivatedRoute } from '@angular/router';
import { LoaderService,SnackBarNotificationType} from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';


@Component({
  selector: 'case-management-send-letter-profile',
  templateUrl: './send-letter-profile.component.html',
  styleUrls: ['./send-letter-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendLetterProfileComponent implements OnInit {
 currentDate = new Date();
 userImage$ = this.userManagementFacade.userImage$;

  /** Public properties **/
  ddlSendLetters$ = this.caseFacade.ddlSendLetters$;
  isEligibilityInfoDialogOpened = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  sessionId: any = "";
  clientId: any;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  isEdit = true;
  clientEligibilityInfo! : ClientEligibilityInfo;


  /** Constructor **/
  constructor(private readonly caseFacade: CaseFacade,
     private readonly clientEligibilityFacade: ClientEligibilityFacade
    ,private readonly loaderService: LoaderService
    ,private readonly changeDetector: ChangeDetectorRef
    ,private readonly workflowFacade: WorkflowFacade
    ,private readonly route: ActivatedRoute
   , private readonly userManagementFacade : UserManagementFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.loadDdlSendLetters();
  }

  loadSessionData() {
    this.loaderService.show();
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          const sessionData=JSON.parse(session.sessionData);
          this.clientCaseId = sessionData.ClientCaseId;
          this.clientCaseEligibilityId = sessionData.clientCaseEligibilityId;
          this.clientId = sessionData.clientId;
          if(this.clientCaseEligibilityId && this.clientId && this.clientCaseId)
          {
          this.loadEligibilityInfo();
          }
          else
          {
            this.loaderService.hide();
          }
        }
      });

  }

  /** Private methods **/
  private loadDdlSendLetters() {
    this.caseFacade.loadDdlSendLetters();
  }

  /** Internal event methods **/
  onCloseEligibilityInfoClicked() {
    this.loaderService.show();
    this.isEligibilityInfoDialogOpened = false;
    this.loadEligibilityInfo();
  }

  onOpenEligibilityInfoClicked() {
    this.isEligibilityInfoDialogOpened = true;
  }
  loadEligibilityInfo()
  {
    this.clientEligibilityFacade.getClientEligibilityInfo(this.clientCaseEligibilityId, this.clientId,this.clientCaseId).subscribe({
      next: (data:any) => {
        this.clientEligibilityInfo = data;
        this.changeDetector.detectChanges();
        this.loaderService.hide();
      },
      error: (err) => {
        if (err){
          this.loaderService.hide();
          this.clientEligibilityFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        }
      },
    });
  }
  getCaseWorkerPhoto(assignedCaseWorkerId : any)
   {
      if(assignedCaseWorkerId)
      {
        this.userManagementFacade.getUserImage(assignedCaseWorkerId);
      }
   }
}
