/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { first, forkJoin, Subscription } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { WorkflowFacade, ClientDocumentFacade, ClientEligibilityFacade, ClientDocumnetEntityType, ReviewQuestionResponseFacade, ReviewQuestionAnswerFacade, ReviewQuestionCode, QuestionTypeCode, EligibilityRequestType, ClientNoteTypeCode, CaseStatusCode, WorkflowTypeCode } from '@cms/case-management/domain';
import { StatusFlag, YesNoFlag } from '@cms/shared/ui-common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
  DocumentFacade
} from '@cms/shared/util-core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'case-management-client-eligibility',
  templateUrl: './client-eligibility.component.html',
  styleUrls: ['./client-eligibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientEligibilityComponent implements OnInit,OnDestroy {
  @Input() eligibilityForm: FormGroup;
  @Input() formSubmited!: boolean;
  @Input() questions: any = [];
  @Input() isSaveAndContinueAcceptance!: boolean;
  @Input() cerNote! : string

  @Output() getQuestionsResponse = new EventEmitter<any>();
  @Output() cerNoteResponse = new EventEmitter<any>();
  @Output() changeApplicationAcceptedStatus = new EventEmitter<any>();
  @Output() changeIsSaveAndContinueAcceptance = new EventEmitter<any>();


  private reviewQuestionAnswerSubscription!: Subscription;
  private reviewQuestionResponseSubscription!: Subscription;
  private discardChangesSubscription !: Subscription;

  /** Public properties **/
  isShowException = false;
  isOpenAcceptance = false;
  isOpenDeny = false;
  isOpenDisenroll = false;
  isDenialLetter = false;
  isEdit = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  sessionId: any = "";
  clientId: any;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  eligibility: any;
  incomDocuments: any = [];
  documents: any = [];
  oregonDocuments: any = [];
  hivDocuments: any = [];
  reviewQuestionAnswers: any = [];
  //questions: any = [];
  reviewQuestionCode = ReviewQuestionCode;
  acceptedApplicationStatus = true;
  btnDisabled = false;
  prevClientCaseEligibilityId: any;
  isCerForm = false;
  acceptanceModalTitle: string = 'Application Accepted';
  isreviewQuestionAnswersFacadeSubscribed = false;
  workflowTypeCode:any;

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly loaderService: LoaderService,
    private readonly workflowFacade: WorkflowFacade,
    private readonly route: ActivatedRoute,
    public readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly clientEligibilityFacade: ClientEligibilityFacade,
    private readonly reviewQuestionResponseFacade: ReviewQuestionResponseFacade,
    private readonly formBuilder: FormBuilder,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loggingService: LoggingService,
    private readonly reviewQuestionAnswerFacade: ReviewQuestionAnswerFacade,  
    public readonly documentFacade: DocumentFacade,
    private readonly router: Router,

  ) {
    this.eligibilityForm = this.formBuilder.group({});
  }

  ngOnInit(): void {

    this.addDiscardChangesSubscription();
    this.loadSessionData();  
   
  }
  ngOnDestroy(): void {
    this.reviewQuestionAnswerSubscription?.unsubscribe();
    this.reviewQuestionResponseSubscription?.unsubscribe();


  }
 
  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription = this.workflowFacade.discardChangesClicked$.subscribe((response: any) => {
      if (response) {
        this.cerNote = ""
        this.loadSessionData();  
      }
    });
  }

  loadReviewQuestionAnswers() {
    this.isreviewQuestionAnswersFacadeSubscribed = true;
    this.reviewQuestionAnswerSubscription = this.reviewQuestionAnswerFacade.reviewQuestionAnswers$
      .subscribe((data: any) => {
        this.reviewQuestionAnswers = data;

        this.questions = this.getQuestions(data.filter((m: any) => m.reviewQuestionParentId === null)).sort((a: any, b: any) => a.questionDisplayOrder - b.questionDisplayOrder);
        this.questions.forEach((q: any) => {
          q.answerCode = YesNoFlag.No.toUpperCase();
        });
        this.getQuestionsResponse.emit(this.questions);
        this.getSavedQuestionsResponse();
        this.cdr.detectChanges();
      })
  }

  getQuestions(data: any) {
    let questions: any = [];
    data.forEach((q: any) => {
      if (!questions.some((m: any) => m.questionCode === q.questionCode)) {
        q.clientCaseEligibilityId = this.clientCaseEligibilityId;
        q.responseAnswerId = undefined;
        q.notes = null;
        const answers = this.reviewQuestionAnswers.filter((m: any) => m.questionCode === q.questionCode).sort((a: any, b: any) => a.answerDisplayOrder - b.answerDisplayOrder);
        q.answers = JSON.parse(JSON.stringify(answers));
        q.childQuestions = this.getQuestions(this.reviewQuestionAnswers.filter((m: any) => m.reviewQuestionParentId === q.reviewQuestionId)).sort((a: any, b: any) => a.questionDisplayOrder - b.questionDisplayOrder);

        questions.push(q);
      }

    });
    return questions;
  }

  answerClick(question: any, answer: any) {
    question.responseAnswerId = answer.reviewQuestionAnswerId;
    question.answerCode = answer.answerCode;
    question.reviewQuestionAnswerId = answer.reviewQuestionAnswerId;
    this.acceptedApplicationStatus = !this.questions.every((m:any)=>m.answerCode===YesNoFlag.Yes.toUpperCase());
    this.changeApplicationAcceptedStatus.emit(this.acceptedApplicationStatus);
    this.getQuestionsResponse.emit(this.questions);
  }

  notesChanged(){
    this.getQuestionsResponse.emit(this.questions);
  }

  cerNotesChanged()
  {
    const clientNote: any = {
      clientCaseEligibilityId: this.clientCaseEligibilityId,
      clientId: this.clientId,
      note: this.cerNote,
      NoteTypeCode:ClientNoteTypeCode.cerEligibility
    };  
    this.cerNoteResponse.emit(clientNote);
  }

  getQuestionDocuments(questionCode: string) {
    let entityTypeCode = '';
    switch (questionCode) {
      case ReviewQuestionCode.origonResident:
        entityTypeCode = ClientDocumnetEntityType.HomeAddressProof;
        break;
      case ReviewQuestionCode.income:
        entityTypeCode = ClientDocumnetEntityType.Income;
        break;
      case ReviewQuestionCode.hivStatus:
        entityTypeCode = ClientDocumnetEntityType.HivVerification;
        break;

      default:
        break;
    }
    return this.documents.filter((m: any) => m.entityTypeCode === entityTypeCode);
  }

  showSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
  }

  loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowTypeCode = this.route.snapshot.queryParams['wtc'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          const sessionData = JSON.parse(session.sessionData);
          this.clientCaseId = sessionData.ClientCaseId;
          this.clientCaseEligibilityId = sessionData.clientCaseEligibilityId;
          this.clientId = sessionData.clientId;
          this.eligibilityForm.controls['clientCaseEligibilityId'].setValue(this.clientCaseEligibilityId);
          this.prevClientCaseEligibilityId = JSON.parse(session.sessionData)?.prevClientCaseEligibilityId;
          if (this.prevClientCaseEligibilityId) {
            this.isCerForm = true;
            this.acceptanceModalTitle= this.isCerForm ? "Client Eligible" : "Application Accepted";
          }

          if(this.isCerForm)
          {
            this.reviewQuestionAnswerFacade.getReviewQuestionAnswerByQuestionTypeCode(QuestionTypeCode.cerReviewChecklist);
          }
          else
          {
            this.reviewQuestionAnswerFacade.getReviewQuestionAnswerByQuestionTypeCode(QuestionTypeCode.reviewChecklist);
          }
          this.loadDocumentsAndEligibility();
          this.prevClientCaseEligibilityId = JSON.parse(session.sessionData)?.prevClientCaseEligibilityId;     
          if(this.prevClientCaseEligibilityId) {
            this.isCerForm =  true;
          }
        }
      });
  }
  loadDocumentsAndEligibility() {
    let documents = this.clientDocumentFacade.getClientDocumentsByClientCaseEligibilityId(this.clientCaseEligibilityId);
    let eligibility = this.clientEligibilityFacade.getEligibility(this.clientId,this.clientCaseId,this.clientCaseEligibilityId,EligibilityRequestType.applicationEligibility);
    this.loaderService.show();
    forkJoin([documents, eligibility]).subscribe({
      next: (results: any) => {
        if (results.length === 0) return;
        this.documents = results[0];
        this.eligibility = results[1];
        this.cdr.detectChanges();
        this.loaderService.hide();
        if(!this.isreviewQuestionAnswersFacadeSubscribed){
          this.loadReviewQuestionAnswers();
        }
      }
      , error: (error) => {
        this.showSnackBar(SnackBarNotificationType.ERROR, error);
        this.loaderService.hide();
      }
  });

  }
  getSavedQuestionsResponse() {
    this.reviewQuestionResponseFacade.getReviewQuestionResponseByClientCaseEligibilityId(this.clientCaseEligibilityId);
    this.reviewQuestionResponseSubscription = this.reviewQuestionResponseFacade.reviewQuestionResponse$.subscribe((data: any) => {
      if (data.length === 0) return;


      this.setSavedResponseInQuestions(this.questions, data);
      this.acceptedApplicationStatus = !this.questions.every((m:any)=>m.answerCode===YesNoFlag.Yes.toUpperCase());
      this.changeApplicationAcceptedStatus.emit(this.acceptedApplicationStatus);
      this.getQuestionsResponse.emit(this.questions);
    })
  }
  setSavedResponseInQuestions(questions: any, responses: any) {
    questions.forEach((q: any) => {
      const answer = responses.find((m: any) => m.reviewQuestionId === q.reviewQuestionId);
      if (answer !== undefined) {
        q.reviewQuestionResponseId = answer.reviewQuestionResponseId;
        q.reviewQuestionAnswerId = answer.reviewQuestionAnswerId;
        q.responseAnswerId = answer.reviewQuestionAnswerId;
        q.notes = answer.notes;
        q.answerCode = q.answers.find((m: any) => m.reviewQuestionAnswerId === answer.reviewQuestionAnswerId)?.answerCode;

        q.activeFlag = answer.activeFlag;
        q.concurrencyStamp = answer.concurrencyStamp;
        if (q.childQuestions.length > 0) {
          this.setSavedResponseInQuestions(q.childQuestions, responses);
        }
      }
    });

  }

  /** Internal event methods **/
  onToggleExceptionClicked() {
    this.isShowException = !this.isShowException;
  }

  onCloseAcceptanceClicked() {
    this.isOpenAcceptance = false;
    if (this.isSaveAndContinueAcceptance)
    {
      this.isSaveAndContinueAcceptance = false;
      this.changeIsSaveAndContinueAcceptance.emit();
    }

  }

  isOpenAcceptanceClicked() {
    this.isOpenAcceptance = true;
  }

  isCloseDenyClicked() {
    this.isOpenDeny = false;
  }

  isOpenDenyClicked() {    
    if(this.isCerForm)
    {
    this.isOpenDisenroll = true;
    }
    else
    {
      this.isOpenDeny = true;
    }
  }

  isCloseDisenrollClicked() {    
    this.isOpenDisenroll = false;   
  }

  handleClosAfterDisEnroll(event: any) {
    if (event.cancel === true) {
      this.isOpenDisenroll = false;
    }
    else {

      if (this.clientCaseId && this.clientCaseEligibilityId && event?.disenrollReasonCode) {
        this.isOpenDisenroll = false;
        this.clientEligibilityFacade.disEnrollCerApplication(this.clientCaseId, this.clientCaseEligibilityId, event?.disenrollReasonCode);
        this.workflowFacade.sendLetterEmailFlag = StatusFlag.Yes;
        this.workflowFacade.caseStatus = CaseStatusCode.disenrolled;
        if (this.workflowTypeCode === WorkflowTypeCode.NewCase) {
          this.router.navigate(['/case-management/case-detail/application-review/send-letter'], {
            queryParamsHandling: "preserve"
          });
        }
        else {
          this.router.navigate(['/case-management/cer-case-detail/application-review/send-letter'], {
            queryParamsHandling: "preserve"
          });
        }
      }
    }
  }

  handleClosAfterDeny(event: boolean) {
    if (event) {
      this.isOpenDeny = false;
      this.isDenialLetter = true;
    }
    else {
      this.isOpenDeny = false;
      this.isDenialLetter = false;
    }
  }
  denialPopupClose() {
    this.isDenialLetter = false;
  }

  checkQuestionDocuments(questionCode: string) {
    let entityTypeCode = '';
    switch (questionCode) {
      case ReviewQuestionCode.origonResident:
        entityTypeCode = ClientDocumnetEntityType.HomeAddressProof;
        break;
      case ReviewQuestionCode.income:
        entityTypeCode = ClientDocumnetEntityType.Income;
        break;
      case ReviewQuestionCode.hivStatus:
        entityTypeCode = ClientDocumnetEntityType.HivVerification;
        break;

      default:
        break;
    }

    const documents=this.documents.filter((m: any) => m.entityTypeCode === entityTypeCode);
    if(documents.length>0){
      return true;
    }
    return false;
  }
  
}
