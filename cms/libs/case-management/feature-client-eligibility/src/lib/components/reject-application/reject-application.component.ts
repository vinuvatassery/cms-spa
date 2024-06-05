/** Angular **/
import { Component, ChangeDetectionStrategy, Input,Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CaseFacade,CaseStatusCode, ContactFacade, WorkflowFacade, WorkflowTypeCode} from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'case-management-reject-application',
  templateUrl: './reject-application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectApplicationComponent implements OnInit, OnDestroy {

  @Input() clientCaseEligibilityId: string = '';
  @Input() clientCaseId: string = '';
  @Input() clientId: any;
  @Output() isCloseDenyModal: EventEmitter<boolean> = new EventEmitter();
  updateCaseStatusSubscription !: Subscription;
  paperless$ = this.contactFacade.paperless$;
  paperlessFlag: any;
  templateLoadType: any;
  emailCommunicationTypeCode: any
  informationalText: any
  templateHeader: any
  emailSubject: any
  workflowTypeCode:any;
  constructor(private readonly caseFacade: CaseFacade,private readonly loaderService: LoaderService,
    private readonly contactFacade: ContactFacade, private readonly router: Router,private readonly workflowFacade: WorkflowFacade,
    private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.contactFacade.loadClientPaperLessStatus(this.clientId,this.clientCaseEligibilityId);
    this.loadSessionData();
  }

  ngOnDestroy(): void {
    this.updateCaseStatusSubscription.unsubscribe();
  }

  private loadSessionData() {   
    this.workflowTypeCode = this.route.snapshot.queryParams['wtc'];
  }
  updateCaseStatus()
  {
    this.loaderService.show();
    this.updateCaseStatusSubscription = this.caseFacade.updateCaseStatus(this.clientCaseId,CaseStatusCode.reject,this.clientCaseEligibilityId).subscribe({
      next: (data) => {  
        this.workflowFacade.sendLetterEmailFlag = StatusFlag.Yes;
        this.workflowFacade.caseStatus = CaseStatusCode.reject;
        this.caseFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Case status updated successfully.'
        );
        this.isCloseDenyModal.emit(true);
        if (this.workflowTypeCode === WorkflowTypeCode.NewCase) {
          this.router.navigate(['/case-management/case-detail/application-review/send-letter'], {
            queryParamsHandling: "preserve"
          });
        }
        else
        {
          this.router.navigate(['/case-management/cer-case-detail/application-review/send-letter'], {
            queryParamsHandling: "preserve"
          });
        }
        this.loaderService.hide();
      },
      error: (err) => {
        if (err){
          this.loaderService.hide();
          this.caseFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        }
      },
    });
  }  

  onModalClose()
  {
    this.isCloseDenyModal.emit(false);
  }
}
