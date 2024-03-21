/** Angular **/
import { Component, ChangeDetectionStrategy, Input,Output, EventEmitter, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {CaseFacade,CaseStatusCode, CommunicationEventTypeCode, ContactFacade, WorkflowFacade} from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { first } from 'rxjs';


@Component({
  selector: 'case-management-reject-application',
  templateUrl: './reject-application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectApplicationComponent implements OnInit {

  @Input() clientCaseEligibilityId: string = '';
  @Input() clientCaseId: string = '';
  @Input() clientId: any;
  @Output() isCloseDenyModal: EventEmitter<boolean> = new EventEmitter();
  
  paperless$ = this.contactFacade.paperless$;
  paperlessFlag: any;
  templateLoadType: any;
  emailCommunicationTypeCode: any
  informationalText: any
  templateHeader: any
  emailSubject: any
  constructor(private readonly caseFacade: CaseFacade,private readonly loaderService: LoaderService,
    private readonly contactFacade: ContactFacade, private readonly router: Router,private readonly workflowFacade: WorkflowFacade) {}

  ngOnInit(): void {
    this.contactFacade.loadClientPaperLessStatus(this.clientId,this.clientCaseEligibilityId);
  }

  updateCaseStatus()
  {
    this.loaderService.show();
    this.caseFacade.updateCaseStatus(this.clientCaseId,CaseStatusCode.reject,this.clientCaseEligibilityId).subscribe({
      next: (data) => {  
        this.workflowFacade.sendLetterEmailFlag = StatusFlag.Yes;
        this.workflowFacade.caseStatus = CaseStatusCode.reject;
        this.caseFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Case status updated successfully.'
        );
        this.isCloseDenyModal.emit(true);
        this.router.navigate(['/case-management/case-detail/application-review/send-letter'], {
          queryParamsHandling: "preserve"
        });
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
