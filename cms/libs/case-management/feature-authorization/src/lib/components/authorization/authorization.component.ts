/** Angular **/
import { Component, ChangeDetectionStrategy, Input, TemplateRef, Output, EventEmitter, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/** Enums **/
import { UIFormStyle } from '@cms/shared/ui-tpa'

/** External Libraries **/
import { DialogService } from '@progress/kendo-angular-dialog';
import { UserDataService } from '@cms/system-config/domain';
import { AuthorizationApplicationSignature, AuthorizationFacade, ClientDocumentFacade, CommunicationEvents, CompletionChecklist, NavigationType, ScreenType, WorkflowFacade, ContactFacade, CommunicationFacade, EsignFacade, EsignStatusCode, CommunicationEventTypeCode, EntityTypeCode } from '@cms/case-management/domain';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService, formatDate } from '@progress/kendo-angular-intl';
import { SelectEvent } from '@progress/kendo-angular-upload';
import { BehaviorSubject, Subscription, forkJoin, mergeMap, of, tap } from 'rxjs';
import { StatusFlag } from '@cms/shared/ui-common';

@Component({
  selector: 'case-management-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent   implements OnInit, OnDestroy  {
  /** Input properties **/
  @Input() isCerForm: boolean= false;
  @Input() clientId!: any;
  @Input() clientCaseEligibilityId!: any;
  @Input() templateNotice$ : any

  /** Output properties **/
  @Output() cerDateSignatureEvent = new EventEmitter<any>();
  @Output() loadAuthorizationData = new EventEmitter();
  @Output() saveAuthorizationData = new EventEmitter<any>();
  @Output() loadAuthorizationNotice = new EventEmitter();
  @Output() setStartButtonVisibility = new EventEmitter<any>();

  /** Public properties **/
  currentDate = new Date();
  emailSentDate?:any = null;
  invalidSignatureDate$ = new BehaviorSubject(false);
  invalidApplicantSignatureDate$ = new BehaviorSubject(false);
  showCopyOfSignedApplicationRequiredValidation = new BehaviorSubject(false);
  showCopyOfSignedApplicationSizeValidation = new BehaviorSubject(false);
  documentTypeCode!: string;
  emailScreenName = CommunicationEventTypeCode.ClientEmail;
  letterScreenName = CommunicationEventTypeCode.ClientLetter;
  notificationGroup = ScreenType.ClientProfile;
  isPrintClicked!: boolean;
  isSendEmailClicked!: boolean;
  isAuthorizationNoticePopupOpened = false;
  uploadedDocument!: File | undefined;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  authorizationForm!: FormGroup;
  cerDateValidator: boolean = false;
  copyOfSignedApplication: any;
  copyOfSignedApplicationSizeValidation: boolean = false;
  prevClientCaseEligibilityId!: string;
  isGoPaperlessOpted: boolean = false;
  toEmail: Array<string> = [];
  typeCode!: string;
  subTypeCode!: string;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  authApplicationSignatureDetails$ = this.authorizationFacade.authApplicationSignatureDetails$;
  signedApplication!: AuthorizationApplicationSignature;
  incompleteDateValidation!: any;
  loginUserName!:any;
  loginUserEmail: any;
  isSendEmailSuccess: boolean = false;
  isCERApplicationSigned: boolean = false;
  private saveClickSubscription !: Subscription;
  private discardChangesSubscription !: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  private isSendLetterOpenedDialog : any;
  private isSendEmailOpenedDialog : any;
  uploadedCopyOfSignedApplication: any;
  isSendNewEmailPopupOpened = false;
  isSendNewLetterPopupOpened = false;
  dateSignatureNoted!: any;
  errorMessage!: string;
  isSendEmailFailed: boolean = false;
  signedClietDocumentId!: string;
  paperlessFlag: any;
  minApplicantSignedDate: any = '01/01/1900';
  cerCommunicationLetterTypeCode!: string;
  communicationLetterTypeCode!: string;
  communicationEmailTypeCode!: string;
  emailSubject!: string;
  templateLoadType!:any;
  informationalText :any = null;
  templateHeader : string='';
  confirmPopupHeader:any;
  saveForLaterHeadterText:any;
  saveForLaterModelText:any;
  confirmationModelText:any;
  entityType: string = EntityTypeCode.Client;
  authorization!: any;
  caseManagerEmail: any = null;

  /** Private properties **/
  private userProfileSubsriction !: Subscription;

  constructor(
    private readonly configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly workflowFacade: WorkflowFacade,
    private readonly loggingService: LoggingService,
    private readonly contactFacade: ContactFacade,
    private readonly intl: IntlService,
    private readonly ref: ChangeDetectorRef,
    private readonly userDataService: UserDataService,
    private readonly communicationFacade: CommunicationFacade,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private dialogService: DialogService,
    private readonly authorizationFacade: AuthorizationFacade,
    private readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly esignFacade: EsignFacade
  ) {   }

  /** Lifecycle hooks **/
  ngOnInit(): void
  {
    this.loadUserContactInfo(this.clientId, this.clientCaseEligibilityId);
    this.buildForm();
    this.addApplicationSignatureDetailsSubscription();
    this.addSaveSubscription();
    this.addSignedDateSubscription();
    this.addDiscardChangesSubscription();
    this.addSaveForLaterValidationsSubscription();
  }

  getNotificationTypeCode(sendEmailClick: boolean) {
    if (this.isCerForm) {
      if (this.paperlessFlag == StatusFlag.Yes && sendEmailClick) {
        this.templateLoadType = CommunicationEventTypeCode.CerAuthorizationEmail;
        this.communicationEmailTypeCode = CommunicationEventTypeCode.CerAuthorizationEmail;
      } else {
        this.templateLoadType = CommunicationEventTypeCode.CerAuthorizationLetter;
        this.communicationLetterTypeCode = CommunicationEventTypeCode.CerAuthorizationLetter;
      }
    } else {
      if (this.paperlessFlag == StatusFlag.Yes && sendEmailClick) {
        this.templateLoadType = CommunicationEventTypeCode.ApplicationAuthorizationEmail;
        this.communicationEmailTypeCode = CommunicationEventTypeCode.ApplicationAuthorizationEmail;
      } else {
        this.templateLoadType = CommunicationEventTypeCode.ApplicationAuthorizationLetter;
        this.communicationLetterTypeCode = CommunicationEventTypeCode.ApplicationAuthorizationLetter;
      }
    }
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
    this.discardChangesSubscription.unsubscribe();
  }
  /** Private methods **/
  private loadUserContactInfo(clientId: any, clientCaseEligibilityId: any) {
    this.loaderService.show();
      this.contactFacade.loadContactInfo(this.clientId ?? 0, this.clientCaseEligibilityId ?? '')
      .subscribe({
        next: (data: any) =>{
          if (data) {
              if(data?.clientCaseEligibility?.paperlessFlag === StatusFlag.Yes)
              {
                this.isGoPaperlessOpted = true;
                this.paperlessFlag = data?.clientCaseEligibility?.paperlessFlag;
                this.ref.detectChanges();
                if(data?.email?.email !== null){
                  this.toEmail.push(data?.email?.email.trim());
                }
              }
              this.getNotificationTypeCode(this.paperlessFlag ? true : false);
              this.loadPendingEsignRequestInfo();
            }
            this.loaderService.hide();
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  getLoggedInUserProfile(){
    this.loaderService.show();
    this.userProfileSubsriction=this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
       this.loginUserName= profile[0]?.firstName+' '+profile[0]?.lastName;
       if(profile[0]?.email){
        const ccEmail ={
          email: profile[0]?.email,
          isDefault: true
        };
          this.loginUserEmail = ccEmail;
       }
      }
    });
    this.loaderService.hide();
  }

  ngAfterViewInit() {
    this.workflowFacade.enableSaveButton();
  }

  /* Private methods */
  private buildForm() {
    this.authorizationForm = new FormGroup({
      applicantSignedDate: new FormControl(''),
      signatureNotedDate: new FormControl({ value: '', disabled: true }, { validators: Validators.required }),
    });
  }

  private addApplicationSignatureDetailsSubscription() {
    this.authApplicationSignatureDetails$.subscribe((resp: AuthorizationApplicationSignature) => {
      if (resp?.applicantSignedDate) {
        this.signedApplication = resp;
        this.authorizationForm?.get('applicantSignedDate')?.patchValue(new Date(resp?.applicantSignedDate));
        const signatureNotedDate = resp?.signatureNotedDate == null ? null : formatDate(new Date(resp?.signatureNotedDate), 'MM-dd-yyyy');
        if(signatureNotedDate != null){
          this.authorizationForm?.get('signatureNotedDate')?.patchValue(signatureNotedDate);
          this.dateSignatureNoted = signatureNotedDate;
        }
        if (resp.signedApplication) {
          this.copyOfSignedApplication = [
            {
              name: resp?.signedApplication?.documentName,
              size: resp?.signedApplication?.documentSize,
              src: resp?.signedApplication?.documentPath,
              uid: resp?.signedApplication?.documentId,
              documentId: resp?.signedApplication?.documentId,
            },
          ];
        }
        this.updateInitialDataPoints(resp?.applicantSignedDate, resp.signedApplication);
        this.setStartButtonVisibility.emit(this.isStartButtonEnabled());
      }
    })
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      tap(() => { this.workflowFacade.disableSaveButton(); this.loaderService.show(); }),
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe({
      next: ([navigationType, isSaved]) => {
        if (!isSaved) {
          this.workflowFacade.enableSaveButton();
          this.loaderService.hide();
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
      },
    });
  }

  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription = this.workflowFacade.discardChangesClicked$.subscribe((response: any) => {
      if (response) {
        this.authorizationForm.reset();
        this.reSetValidations();
        this.loadAuthorizationData.emit();
      }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        if(this.validate()){
        this.workflowFacade.showSaveForLaterConfirmationPopup(true);
        }
      }
    });
  }

  private save() {
    const isValid = this.validate();
    if (isValid) {
      const authorization = {
        clientCaseEligibilityId: this.clientCaseEligibilityId,
        applicantSignedDate: this.intl.formatDate(this.authorizationForm?.get('applicantSignedDate')?.value, this.dateFormat),
        signatureNotedDate: this.intl.formatDate(new Date(this.authorizationForm?.get('signatureNotedDate')?.value), this.dateFormat),
        signedApplicationDocument: this.uploadedCopyOfSignedApplication,
        signedApplication: {}
      }
      if (this.uploadedCopyOfSignedApplication) {
        const documentId = this.copyOfSignedApplication?.length > 0 ? (this.copyOfSignedApplication[0]?.uid ?? null) : null;
        authorization.signedApplication = {
          documentId: documentId,
          documentName: this.uploadedCopyOfSignedApplication.name,
          documentSize: this.uploadedCopyOfSignedApplication.size,
          documentTypeCode: this.documentTypeCode,
        }
      }

      this.saveAuthorizationData.emit(authorization);
      return of(true);
    }

    return of(false);
  }

  private validate() {
    let isValid = true;
    this.reSetValidations();
    const applicationSignedDate = this.authorizationForm?.get('applicantSignedDate');
    applicationSignedDate?.setValidators(Validators.required);
    applicationSignedDate?.updateValueAndValidity();
    const isLargeFile = (this.uploadedCopyOfSignedApplication?.size ?? 0) > this.configurationProvider.appSettings?.uploadFileSizeLimit;
    if (applicationSignedDate?.value > new Date()) {
      this.invalidSignatureDate$.next(true);
      this.invalidApplicantSignatureDate$.next(false);
      isValid = false;
    }
    if (applicationSignedDate?.value < new Date(this.minApplicantSignedDate)) {
      this.invalidSignatureDate$.next(false);
      this.invalidApplicantSignatureDate$.next(true);
      isValid = false;
    }
    if (!this.uploadedCopyOfSignedApplication && !this.copyOfSignedApplication) {
      this.showCopyOfSignedApplicationRequiredValidation.next(true);
      isValid = false;
    }
    else if (isLargeFile) {
      this.showCopyOfSignedApplicationSizeValidation.next(true);
      isValid = false;
    }

    return isValid && this.authorizationForm.valid;
  }

  private reSetValidations() {
    this.invalidSignatureDate$.next(false);
    this.showCopyOfSignedApplicationRequiredValidation.next(false);
    this.showCopyOfSignedApplicationSizeValidation.next(false);
    this.authorizationForm?.get('applicantSignedDate')?.setValidators(null);
    this.authorizationForm?.get('applicantSignedDate')?.updateValueAndValidity();
  }

  /** Internal event methods **/

  onSendNewLetterClicked(template: TemplateRef<unknown>): void {
    const sendEmailClick = false;
    this.getNotificationTypeCode(sendEmailClick);
    this.isSendLetterOpenedDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-xl just_start app-c-modal-np'
    });
  }

  onSendNewEmailClicked(template: TemplateRef<unknown>): void {
    const sendEmailClick = true;
    this.getNotificationTypeCode(sendEmailClick);
    this.isSendEmailOpenedDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-xl just_start app-c-modal-np'
    });
  }

  onCloseAuthorizationNoticeClicked() {
    this.isAuthorizationNoticePopupOpened = false;
  }

  onAuthorizationNoticeClicked() {
    this.loadAuthorizationNotice.emit()
    this.isAuthorizationNoticePopupOpened = true;
  }

  addSignedDateSubscription() {
    this.authorizationForm?.get('applicantSignedDate')?.valueChanges?.subscribe((value: Date) => {
      const today = new Date();
      if (value) {
        this.authorizationForm?.get('signatureNotedDate')?.setValue(formatDate(today, 'MM-dd-yyyy'));
        this.invalidSignatureDate$.next(value > today);
      }
      this.setStartButtonVisibility.emit(this.isStartButtonEnabled());
    })
  }

  private isStartButtonEnabled = () => ((this.copyOfSignedApplication?.length > 0 && this.copyOfSignedApplication[0]?.documentId) || this.uploadedCopyOfSignedApplication)
  && this.authorizationForm?.get('applicantSignedDate')?.value
  && this.authorizationForm?.get('applicantSignedDate')?.value < new Date();

  /** External event methods **/
  handleCloseSendNewEmailClicked(event: CommunicationEvents) {
    switch (event) {
      case CommunicationEvents.Close:
        this.isSendEmailOpenedDialog.close(event);
        break;
      case CommunicationEvents.Print:
        this.isSendNewEmailPopupOpened = false;
        if(this.isSendEmailSuccess){
        this.isSendEmailClicked = true;
        this.loadPendingEsignRequestInfo();
      }else{
        this.isSendEmailClicked = false;
      }
      break;
      default:
      break;
    }
  }

  handleCloseSendNewLetterClicked(event: CommunicationEvents) {
    switch (event) {
      case CommunicationEvents.Close:

        this.isSendLetterOpenedDialog.close(event);
        break;
      case CommunicationEvents.Print:
        this.isPrintClicked = true;
        this.getLoggedInUserProfile();
        break;
      default:
        break;
    }
  }

  handleTypeCodeEvent(e: any) {
    this.documentTypeCode = e;
  }

  handleFileSelected(e: SelectEvent) {
    this.uploadedCopyOfSignedApplication = e.files[0].rawFile;
    this.showCopyOfSignedApplicationRequiredValidation.next(false);
    const isLargeFile = (this.uploadedCopyOfSignedApplication?.size ?? 0) > this.configurationProvider.appSettings?.uploadFileSizeLimit;
    this.showCopyOfSignedApplicationSizeValidation.next(isLargeFile);
    this.updateDataPoints('copyOfSignedApplication', true);
    this.setStartButtonVisibility.emit(this.isStartButtonEnabled());
    this.saveDateAndSignedDoc();
    this.ref.detectChanges();
  }

  handleFileRemoved(e: SelectEvent) {
    this.showCopyOfSignedApplicationRequiredValidation.next(false);
    this.showCopyOfSignedApplicationSizeValidation.next(false);
    if (this.copyOfSignedApplication !== undefined && this.copyOfSignedApplication[0]?.uid) {
      this.loaderService.show();
      this.clientDocumentFacade.removeDocument(this.signedApplication?.signedApplication?.documentId ?? '').subscribe({
        next: (response) => {
          if (response === true) {
            this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Copy of Signed Application Removed Successfully!")
            this.copyOfSignedApplication = undefined;
            this.uploadedCopyOfSignedApplication = undefined;
            this.signedApplication.signedApplication = undefined;
            this.loaderService.hide();
            this.updateDataPoints('copyOfSignedApplication', false);
            this.setStartButtonVisibility.emit(this.isStartButtonEnabled());
            this.ref.detectChanges();          
          }
        },
        error: (err) => {
          this.loggingService.logException(err);
          this.loaderService.hide();
        },
      });
    }
    else {
      this.uploadedCopyOfSignedApplication = undefined;
      this.copyOfSignedApplication = undefined;
      this.updateDataPoints('copyOfSignedApplication', false);
      this.loaderService.hide();
      this.setStartButtonVisibility.emit(this.isStartButtonEnabled());
      this.ref.detectChanges();
    }

  }

  get authForm() { return this.authorizationForm.controls as any; }

  private updateInitialDataPoints(applicantSignedDate: Date, copyOfSignedApplication: any) {
    const workFlowData: CompletionChecklist[] = [
      {
        dataPointName: 'applicantSignedDate',
        status: applicantSignedDate ? StatusFlag.Yes : StatusFlag.No
      },
      {
        dataPointName: 'copyOfSignedApplication',
        status: copyOfSignedApplication ? StatusFlag.Yes : StatusFlag.No
      },
    ];

    this.workflowFacade.updateChecklist(workFlowData);
  }

  private updateDataPoints(dataPoint: string, isCompleted: boolean) {
    const workFlowData: CompletionChecklist[] = [
      {
        dataPointName: dataPoint,
        status: isCompleted ? StatusFlag.Yes : StatusFlag.No
      }];

    this.workflowFacade.updateChecklist(workFlowData);
  }

  loadDateSignature(){
  this.cerDateSignatureEvent.emit(this.dateSignatureNoted);
  }

  onChange(event : Date) {
    this.cerDateValidator = false;
    const signedDate = event;
    const todayDate = new Date();
    if (signedDate == null) {
      this.currentDate = signedDate;
      this.dateSignatureNoted = this.authorizationForm?.get('signatureNotedDate')?.patchValue(null);
      this.updateDataPoints('applicantSignedDate', false);
      this.cerDateSignatureEvent.emit(this.dateSignatureNoted);
      this.invalidApplicantSignatureDate$.next(false);
      this.invalidSignatureDate$.next(false);
      this.ref.detectChanges();
    }
    else if (signedDate > todayDate || signedDate < new Date(this.minApplicantSignedDate) ){
      this.currentDate = signedDate;
      this.cerDateValidator = true;
      this.dateSignatureNoted = this.authorizationForm?.get('signatureNotedDate')?.patchValue(null);
      this.cerDateSignatureEvent.emit(this.dateSignatureNoted);
      this.validate();
    }
    else
    {
      this.currentDate = event;
      this.dateSignatureNoted = formatDate(new Date(todayDate), 'MM-dd-yyyy');
      this.authorizationForm?.get('signatureNotedDate')?.patchValue(this.dateSignatureNoted)
      this.cerDateSignatureEvent.emit(this.dateSignatureNoted);
      this.saveDateAndSignedDoc();
      this.ref.detectChanges();
    }
  }

  saveDateAndSignedDoc() {
    this.loaderService.show();
    this.authorization = {
      clientCaseEligibilityId: this.clientCaseEligibilityId,
      applicantSignedDate: this.intl.formatDate(this.authorizationForm?.get('applicantSignedDate')?.value, this.dateFormat),
      signatureNotedDate: this.intl.formatDate(new Date(this.authorizationForm?.get('signatureNotedDate')?.value), this.dateFormat),
      signedApplicationDocument: this.uploadedCopyOfSignedApplication ?? '',
      signedApplication: {}
    }
    if (this.uploadedCopyOfSignedApplication) {
      const documentId = this.copyOfSignedApplication?.length > 0 ? (this.copyOfSignedApplication[0]?.uid ?? null) : null;
      this.authorization.signedApplication = {
        documentId: documentId,
        documentName: this.uploadedCopyOfSignedApplication.name,
        documentSize: this.uploadedCopyOfSignedApplication.size,
        documentTypeCode: this.documentTypeCode,
      }
    }
    this.authorizationFacade.saveDateSignedAndSignedFile(this.authorization).subscribe({
      next: (response) => {
        if(response){
          if(this.authorization?.applicantSignedDate){
            this.updateDataPoints('applicantSignedDate', true);
          }
          if(this.uploadedCopyOfSignedApplication){
          this.updateDataPoints('copyOfSignedApplication', true);
          }
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Authorization Saved Successfully!");
        this.ref.detectChanges();
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.workflowFacade.enableSaveButton();
        this.workflowFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

updateSendEmailSuccessStatus(event:any){
 this.isSendEmailSuccess = event;
}

loadPendingEsignRequestInfo(){
  this.loaderService.show();
  let flowName = this.isCerForm ? CommunicationEventTypeCode.CerAuthorizationEmail : CommunicationEventTypeCode.ApplicationAuthorizationEmail;
    this.esignFacade.getEsignRequestInfo(this.nullCheck(this.workflowFacade.clientCaseEligibilityId ), this.nullCheck(flowName))
    .subscribe({
      next: (data: any) =>{
        if (data != null && data?.esignRequestId != null) {
          if(data?.esignRequestStatusCode == EsignStatusCode.Pending || data?.esignRequestStatusCode == EsignStatusCode.Started|| data?.esignRequestStatusCode == EsignStatusCode.InProgress){
            this.loadPendingEsignRequest(data);
          }
          else if(data?.esignRequestStatusCode == EsignStatusCode.Complete){
            this.emailSentDate = this.intl.formatDate(new Date(data.creationTime), "MM/dd/yyyy");
            this.isCERApplicationSigned = true;
            this.isSendEmailClicked = true;
            this.loadCompletedEsignRequestInfo();
            this.getLoggedInUserProfile();
          }else if(data?.esignRequestStatusCode == EsignStatusCode.Failed){
            this.isSendEmailFailed = true;
            this.errorMessage = data?.errorMessage;
          }
            this.ref.detectChanges();
          }
          else{
            this.loadAuthorization();
          }
          this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      this.loggingService.logException(err);
    },
  });
}

  loadPendingEsignRequest(data: any) {
    this.emailSentDate = this.intl.formatDate(new Date(data.creationTime), "MM/dd/yyyy");
    this.isSendEmailClicked=true;
    this.getLoggedInUserProfile();
    if(this.signedApplication === null || this.signedApplication === undefined){
      this.loadAuthorization();
      }
  }

loadCompletedEsignRequestInfo(){
  this.loaderService.show();
  this.typeCode=CommunicationEventTypeCode.CopyOfSignedApplication;
  this.clientDocumentFacade.getSignedDocumentInfo(this.typeCode ?? ' ', this.subTypeCode ?? ' ',this.workflowFacade.clientCaseEligibilityId ?? '')
    .subscribe({
      next: (data: any) =>{
        if (data?.clientDocumentId != null) {
          this.clientCaseEligibilityId = data?.clientCaseEligibilityId;
          this.loadAuthorization();
          this.isCERApplicationSigned = true;
          this.ref.detectChanges();
          }
          this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      this.loggingService.logException(err);
    },
  });
}

onGetSignedApplicationClicked(){
  this.loaderService.show()
    this.clientDocumentFacade.getClientDocumentsViewDownload(this.signedClietDocumentId??'')
    .subscribe({
      next: (data: any) => {
        const fileUrl = window.URL.createObjectURL(data);
        window.open(fileUrl, "_blank");
        this.loaderService.hide();
      },
      error: (error) => {
        this.loaderService.hide();
        this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error);
        this.loggingService.logException(error);
      }
    });
}

loadAuthorization() {
  this.loaderService.show();
  this.authorizationFacade.bindAuthorizationDetails(this.clientCaseEligibilityId ?? '', CommunicationEventTypeCode.CopyOfSignedApplication ?? '')
  .subscribe({
    next: (data: any) => {
      if(data){
        this.signedApplication = data;
        const signatureNotedDate = data?.signatureNotedDate == null ? null : formatDate(new Date(data?.signatureNotedDate), 'MM-dd-yyyy');
        if(signatureNotedDate != null){
          this.authorizationForm?.get('signatureNotedDate')?.patchValue(signatureNotedDate);
          this.dateSignatureNoted = signatureNotedDate;
        }
        if (data.signedApplication) {
          this.copyOfSignedApplication = [
            {
              name: data?.signedApplication?.documentName,
              size: data?.signedApplication?.documentSize,
              src: data?.signedApplication?.documentPath,
              uid: data?.signedApplication?.documentId,
              documentId: data?.signedApplication?.documentId,
            },
          ];
          this.isSendEmailClicked = false;
        }
        this.updateInitialDataPoints(data?.applicantSignedDate, data.signedApplication);
        this.setStartButtonVisibility.emit(this.isStartButtonEnabled());
      }
      this.loaderService.hide();
    },
    error: (error) => {
      this.loaderService.hide();
      this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error);
      this.loggingService.logException(error);
    }
  });
}
nullCheck(value:any){
  if(value){
    return value;
  }
  else{
    return '';
  }
 }
}
