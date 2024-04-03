/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  OnInit,
  TemplateRef,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
  AfterContentChecked,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunicationEventTypeCode, CommunicationFacade, ContactFacade, ScreenType, WorkflowFacade } from '@cms/case-management/domain';
import { CaseStatusCode, StatusFlag } from '@cms/shared/ui-common';
import { UserDataService } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subscription, first } from 'rxjs';

@Component({
  selector: 'case-management-send-letter-page',
  templateUrl: './send-letter-page.component.html',
  styleUrls: ['./send-letter-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendLetterPageComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
  /** Public properties **/
  getLetterEditorValue = new EventEmitter<boolean>();
  letterContentValue!: any;
  isOpenedPrint = false;
  isOpenedPrintPreview = false;
  isCERForm = false;
  title = "Send "
  customTitle = ""
  printModelTitle = "";
  confirmTitle = " letter?"
  sendType = ""
  printModelText = "";
  isDisenrollmentPage = false;
  sessionId!: string
  clientId: any;
  clientCaseEligibilityId: any
  private disenrollLaterDialog: any;
  private approvalLaterDialog: any;
  private saveForLaterValidationSubscription !: Subscription;
  private loggedInUserProfileSubscription !: Subscription;
  emailSubscription!: Subscription;
  @ViewChild('disenrollment_letter_later', { read: TemplateRef }) disenrollment_letter_later!: TemplateRef<any>;

  @ViewChild('approval_letter_later', { read: TemplateRef }) approval_letter_later!: TemplateRef<any>;
  paperless$ = this.contactFacade.paperless$;
  mailingAddress$ = this.contactFacade.mailingAddress$;
  letterCommunicationTypeCode: any;
  emailCommunicationTypeCode: any;
  templateLoadType !: any;
  screenName = ScreenType.ClientProfile;
  isNewNotificationClicked: boolean = false;
  isContinueDraftClicked: boolean = false;
  notificationDraftId: string = ''
  paperlessFlag: any = '';
  emailAddress$ = this.contactFacade.emailAddress$;
  toEmail: Array<string> = [];
  informationalText: any = null;
  templateHeader: string = '';
  confirmPopupHeader: string = '';
  emailSubject: any = '';
  triggerFrom: any = '';
  loginUserEmail:any;
  /** Constructor**/
  constructor(
    private route: ActivatedRoute,
    private workflowFacade: WorkflowFacade,
    private dialogService: DialogService,
    private readonly contactFacade: ContactFacade,
    private readonly cdr: ChangeDetectorRef,
    private readonly communicationFacade: CommunicationFacade,
    private readonly userDataService: UserDataService
  ) {
  }

  ngOnInit(): void {

    //NOSONAR this is a temporary title setting please work on it when the form is developed
    this.isCERForm = this.route.snapshot.queryParams['wtc'] === 'CA_CER';

    this.customTitle = "Approval"
    if (this.isCERForm) {
      this.customTitle = "Eligibility"

      this.confirmTitle = this.customTitle + this.confirmTitle

      if (this.route.snapshot?.data?.["title"]?.toLowerCase().includes("disenrollment")) {
        this.customTitle = "Disenrollment"
        this.isDisenrollmentPage = true;
        this.printModelTitle = "Send Disenrollment Letter to "
        this.printModelText = "This action cannot be undone, If applicable, the client will also automatically receive a notification via email, SMS text, and/or their online portal."
      }
    }
    this.title = this.title + this.customTitle
    this.getLoggedInUserProfileSubscriptionInit();
    this.loadCase()
    this.addSaveForLaterValidationsSubscription();
    this.addEmailSubscription();
  }

  ngOnDestroy(): void {
    this.saveForLaterValidationSubscription.unsubscribe();
    this.loggedInUserProfileSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.workflowFacade.enableSaveButton();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {

      if (this.isDisenrollmentPage) {
        this.disenrollLaterDialog = this.dialogService.open({
          title: "Send Disenrollment " + this.sendType + " later?",
          content: this.disenrollment_letter_later,
          cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
        });
      }
      else {
        this.approvalLaterDialog = this.dialogService.open({
          title: "Send " + this.customTitle + " " + this.sendType + " later?",
          content: this.approval_letter_later,
          cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
        });
      }
    });

  }

  /** Internal event methods **/
  onClosePrintClicked() {
    this.isOpenedPrint = false;
  }

  onClosePrintPreviewClicked() {
    this.isOpenedPrintPreview = false;
  }

  onOpenPrintClicked() {
    this.isOpenedPrint = true;
    this.isOpenedPrintPreview = false;
    this.getLetterEditorValue.emit(true);
  }

  onOpenPrintPreviewClicked() {
    this.isOpenedPrintPreview = true;
    this.getLetterEditorValue.emit(true);
  }

  /** External event methods **/
  handleLetterEditor(event: any) {
    this.letterContentValue = event;
  }

  loadCase() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.triggerFrom = this.route.snapshot.queryParams['wtc'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId);
    this.workflowFacade.sessionDataSubject$
      .pipe(first((sessionData) => sessionData.sessionData != null))
      .subscribe((session: any) => {
        this.clientId = JSON.parse(session.sessionData).clientId;
        this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;

        if (this.clientId && this.clientCaseEligibilityId) {
          this.loadClientPaperLessStatusHandle()
        }
      })
  }

  closeLetterModalEvent() {
    this.disenrollLaterDialog.close();
  }

  closeApprovalLetterModal() {
    this.approvalLaterDialog.close();
  }

  loadClientPaperLessStatusHandle(): void {
    this.contactFacade.loadClientPaperLessStatus(
      this.clientId,
      this.clientCaseEligibilityId
    );
    this.loadPaperLessStatus();
  }

  loadPaperLessStatus() {
    this.paperless$
      ?.pipe(first((emailData: any) => emailData?.paperlessFlag != null))
      .subscribe((emailData: any) => {
        if (emailData?.paperlessFlag) {
          let pageType = this.isDisenrollmentPage === true ? "Disenrollment" : this.customTitle
          this.paperlessFlag = emailData?.paperlessFlag;
          this.printModelTitle = this.printModelTitle + (this.paperlessFlag === 'Y' ? 'email?' : 'print?')
          this.confirmTitle = (this.paperlessFlag === 'Y' ? "Send " + pageType + " Email?" : "Send " + pageType + " Letter to Print?")
          this.sendType = this.paperlessFlag === 'Y' ? 'Email' : 'Letter'
          this.setValues();
        }
        this.cdr.detectChanges();
        this.communicationFacade.loadTemplateSubject.next(true);
      });
  }

  setValues() {
    if (this.workflowFacade.sendLetterEmailFlag === StatusFlag.Yes && this.workflowFacade.caseStatus === CaseStatusCode.incomplete) {
      this.setValueIncomplete();
    }
    else if (this.workflowFacade.sendLetterEmailFlag === StatusFlag.Yes && this.workflowFacade.caseStatus === CaseStatusCode.reject) {
      this.seValueReject();
    }
    else if (this.workflowFacade.sendLetterEmailFlag === StatusFlag.Yes && this.workflowFacade.caseStatus === CaseStatusCode.accept) {
      this.setValueAccept();
    }
    else if (this.workflowFacade.sendLetterEmailFlag === StatusFlag.Yes && this.workflowFacade.caseStatus === CaseStatusCode.disenrolled) {
      this.setValueDisenrollment();
    }
  }

  setValueDisenrollment() {
    if (this.paperlessFlag === StatusFlag.Yes) {
      this.templateLoadType = CommunicationEventTypeCode.DisenrollmentNoticeEmail;
      this.emailCommunicationTypeCode = CommunicationEventTypeCode.DisenrollmentNoticeEmail;
      this.informationalText = "If there is an issue with this email template, please contact your Administrator. Make edits as needed, then click ''Send Email'' once the email is complete."
      this.templateHeader = 'Send Disenrollment Email';
      this.emailSubject = "CAREAssist Disenrollment Notice";
      this.confirmPopupHeader = 'Send Disenrollment email to print?';
    }
    else {
      this.templateLoadType = CommunicationEventTypeCode.DisenrollmentNoticeLetter;
      this.letterCommunicationTypeCode = CommunicationEventTypeCode.DisenrollmentNoticeLetter;
      this.informationalText = "If there is an issue with this letter template, please contact your Administrator. Make edits as needed, then click ''Send to Print'' once the letter is complete."
      this.templateHeader = 'Send Disenrollment Letter';
      this.emailSubject = '';
      this.confirmPopupHeader = 'Send Disenrollment letter to print?';
    }
  }

  setValueAccept() {
    if (this.paperlessFlag === StatusFlag.Yes) {
      this.templateLoadType = CommunicationEventTypeCode.ClientEmail;
      this.emailCommunicationTypeCode = CommunicationEventTypeCode.ApprovalNoticeEmail;
      this.informationalText = "If there is an issue with this template, please contact your Administrator. Make edits as needed, then click ''SEND TO PRINT''/SEND EMAIL once the notice is complete."
      this.templateHeader = 'Send Approval Email';
      this.emailSubject = "CareAssist Approval Notice";
      this.confirmPopupHeader = 'Send Approval Email?';
    }
    else {
      this.templateLoadType = CommunicationEventTypeCode.ClientLetter;
      this.letterCommunicationTypeCode = CommunicationEventTypeCode.ApprovalNoticeLetter;
      this.informationalText = "If there is an issue with this template, please contact your Administrator. Make edits as needed, then click ''SEND TO PRINT''/SEND EMAIL once the notice is complete."
      this.templateHeader = 'Send Approval Letter';
      this.emailSubject = '';
      this.confirmPopupHeader = 'Send Approval Letter to Print?';
    }
  }

  seValueReject() {
    if (this.paperlessFlag === StatusFlag.Yes) {
      this.templateLoadType = CommunicationEventTypeCode.ClientEmail;
      this.emailCommunicationTypeCode = CommunicationEventTypeCode.RejectionNoticeEmail;
      this.informationalText = "If there is an issue with this letter template, please contact your Administrator. Make edits as needed, then click ''Send Email'' once the email is complete."
      this.templateHeader = 'Send Denial Email';
      this.emailSubject = "CAREAssist Denial Notice";
      this.confirmPopupHeader = 'Send Denial Email?';
    }
    else {
      this.templateLoadType = CommunicationEventTypeCode.ClientLetter;
      this.letterCommunicationTypeCode = CommunicationEventTypeCode.RejectionNoticeLetter;
      this.informationalText = "If there is an issue with this letter template, please contact your Administrator. Make edits as needed, then click ''Send to Print'' once the letter is complete."
      this.templateHeader = 'Send Denial Letter';
      this.emailSubject = '';
      this.confirmPopupHeader = 'Send Denial Letter to print?';
    }
  }

  setValueIncomplete() {
    if (this.paperlessFlag === StatusFlag.Yes) {
      this.templateLoadType = CommunicationEventTypeCode.ClientEmail;
      this.emailCommunicationTypeCode = CommunicationEventTypeCode.PendingNoticeEmail;
      this.informationalText = "If there is an issue with this email template, please contact your Administrator. Make edits as needed, then click ''SEND EMAIL'' once the email is complete."
      this.templateHeader = 'Send Pending Email';
      this.emailSubject = '';
      this.confirmPopupHeader = 'Send Pending Email to print';
    }
    else {
      this.templateLoadType = CommunicationEventTypeCode.ClientLetter;
      this.letterCommunicationTypeCode = CommunicationEventTypeCode.PendingNoticeLetter;
      this.informationalText = "If there is an issue with this letter template, please contact your Administrator. Make edits as needed, then click ''SEND TO PRINT'' once the letter is complete."
      this.templateHeader = 'Send Pending Letter';
      this.emailSubject = '';
      this.confirmPopupHeader = 'Send Pending Letter to print?';
    }
  }

  loadMailingAddress() {
    this.contactFacade.loadMailingAddress(this.clientId);
    this.cdr.detectChanges();
  }

  private addEmailSubscription() {
    this.emailSubscription = this.emailAddress$.subscribe((email: any) => {
      const isEmailOk = email.filter((email: any) => email.paperlessFlag === StatusFlag.Yes)?.length > 0;
      // Iterate over the list and push emails based on a condition
      if (isEmailOk) {
        email.forEach((item: any) => {
          if (item.paperlessFlag === StatusFlag.Yes) {
            this.toEmail.push(item.email.trim());
          }
        });
      }
    });
  }

  loadEmailAddress() {
    this.contactFacade.loadEmailAddress(this.clientId, this.clientCaseEligibilityId);
  }

  getLoggedInUserProfileSubscriptionInit(){
    this.loggedInUserProfileSubscription = this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
       this.loginUserEmail = profile[0]?.email;
      }
    });
  }

}
