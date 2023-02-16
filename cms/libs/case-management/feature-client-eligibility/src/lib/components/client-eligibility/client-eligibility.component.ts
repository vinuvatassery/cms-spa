/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { first, Observable, forkJoin, Subscription } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { YesNoFlag,WorkflowFacade, ClientDocumentFacade, ClientEligibilityFacade, ClientDocumnetEntityType, ReviewQuestionResponseFacade, ReviewQuestionAnswerFacade, ReviewQuestionAnswer, ReviewQuestionCode, QuestionTypeCode } from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType
} from '@cms/shared/util-core';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'case-management-client-eligibility',
  templateUrl: './client-eligibility.component.html',
  styleUrls: ['./client-eligibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientEligibilityComponent implements OnInit {
  @Input() eligibilityForm: FormGroup;
  @Input() formSubmited!: boolean;
  @Input() questions: any = [];
  @Input() isSaveAndContinueAcceptance!: boolean;

  @Output() getQuestionsResponse = new EventEmitter<any>();
  @Output() changeApplicationAcceptedStatus = new EventEmitter<any>();


  private reviewQuestionAnswerSubscription!: Subscription;
  private reviewQuestionResponseSubscription!: Subscription;

  /** Public properties **/
  isShowException = false;
  isOpenAcceptance = false;
  isOpenDeny = false;
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
    private readonly reviewQuestionAnswerFacade: ReviewQuestionAnswerFacade

  ) {
    this.eligibilityForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.loadSessionData();
    this.reviewQuestionAnswerFacade.getReviewQuestionAnswerByQuestionTypeCode(QuestionTypeCode.reviewChecklist);

  }
  ngOnDestroy(): void {
    this.reviewQuestionAnswerSubscription.unsubscribe();
    this.reviewQuestionResponseSubscription.unsubscribe();
  }

  loadReviewQuestionAnswers() {
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
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          const sessionData = JSON.parse(session.sessionData);
          this.clientCaseId = sessionData.ClientCaseId;
          this.clientCaseEligibilityId = sessionData.clientCaseEligibilityId;
          this.clientId = sessionData.clientId;
          this.eligibilityForm.controls['clientCaseEligibilityId'].setValue(this.clientCaseEligibilityId);
          this.loadDocumentsAndEligibility();
        }
      });
  }
  loadDocumentsAndEligibility() {
    let documents = this.clientDocumentFacade.getClientDocumentsByClientCaseEligibilityId(this.clientCaseEligibilityId);
    let eligibility = this.clientEligibilityFacade.getEligibility(this.clientCaseEligibilityId, this.clientId);
    this.loaderService.show();
    forkJoin([documents, eligibility]).subscribe(
      (results: any) => {
        if (results.length === 0) return;
        this.documents = results[0];
        this.eligibility = results[1];
        this.cdr.detectChanges();
        this.loaderService.hide();
        this.loadReviewQuestionAnswers();
      }
      , (error) => {
        this.showSnackBar(SnackBarNotificationType.ERROR, error);
        this.loaderService.hide();
      }
    );

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
    this.isSaveAndContinueAcceptance = false;
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
