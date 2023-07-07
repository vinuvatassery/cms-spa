/** Angular **/
import { Component, ChangeDetectionStrategy, Input, TemplateRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/** Enums **/
import { UIFormStyle } from '@cms/shared/ui-tpa'

/** External Libraries **/
import { DialogService } from '@progress/kendo-angular-dialog';
import { UserDataService } from '@cms/system-config/domain';
import { AuthorizationApplicationSignature, AuthorizationFacade, ClientDocumentFacade, CommunicationEvents, CompletionChecklist, NavigationType, ScreenType, StatusFlag, WorkflowFacade, ContactFacade, CommunicationFacade, EsignFacade } from '@cms/case-management/domain';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService, formatDate } from '@progress/kendo-angular-intl';
import { SelectEvent } from '@progress/kendo-angular-upload';
import { BehaviorSubject, Subscription, forkJoin, mergeMap, of, tap } from 'rxjs';

@Component({
  selector: 'case-management-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent   {
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
  showCopyOfSignedApplicationRequiredValidation = new BehaviorSubject(false);
  showCopyOfSignedApplicationSizeValidation = new BehaviorSubject(false);
  documentTypeCode!: string;
  screenName = ScreenType.Authorization;
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
  isSendEmailSuccess: boolean = false;
  private saveClickSubscription !: Subscription;
  private discardChangesSubscription !: Subscription;
  private isSendLetterOpenedDialog : any;
  private isSendEmailOpenedDialog : any;
  uploadedCopyOfSignedApplication: any;
  isSendNewEmailPopupOpened = false;
  isSendNewLetterPopupOpened = false;
  dateSignatureNoted!: any;
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
                this.ref.detectChanges();
                if(data?.email?.email !== null){
                  this.toEmail.push(data?.email?.email.trim());
                }
              }
              this.loadEsignRequestInfo();
              // this.loadClientDocumentInfo();
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

  // private loadClientDocumentInfo() {
  //   this.loaderService.show();
  //   if(this.isGoPaperlessOpted)
  //   {
  //     this.typeCode=CommunicationEvents.CerAuthorizationEmail
  //     this.subTypeCode= CommunicationEvents.Email
  //   }
  //   else
  //   {
  //     this.typeCode=CommunicationEvents.CerAuthorizationLetter
  //     this.subTypeCode= CommunicationEvents.Letter
  //   }
  //     this.communicationFacade.getClientDocuments(this.typeCode ?? '', this.subTypeCode ?? '',this.workflowFacade.clientCaseEligibilityId ?? '')
  //     .subscribe({
  //       next: (data: any) =>{
  //         if (data) {
  //             this.emailSentDate = this.intl.formatDate(new Date(data.creationTime), this.dateFormat);
  //             if(data.documentTypeCode==CommunicationEvents.CerAuthorizationEmail)
  //             {
  //             this.isSendEmailClicked=true;
  //             }
  //             else
  //             {
  //             this.isPrintClicked=true;
  //             }
  //             this.ref.detectChanges();
  //             this.getLoggedInUserProfile();
  //           }
  //           this.loaderService.hide();
  //     },
  //     error: (err: any) => {
  //       this.loaderService.hide();
  //       this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
  //       this.loggingService.logException(err);
  //     },
  //   });
  // }

  getLoggedInUserProfile(){
    this.loaderService.show();
    this.userProfileSubsriction=this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
       this.loginUserName= profile[0]?.firstName+' '+profile[0]?.lastName;
      }
    })
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
        const signatureNotedDate = resp?.signatureNotedDate ? formatDate(new Date(resp?.signatureNotedDate), 'MM-dd-yyyy') : '';
        this.authorizationForm?.get('signatureNotedDate')?.patchValue(signatureNotedDate);
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
    this.isSendLetterOpenedDialog = this.dialogService.open({ 
      content: template, 
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np'
    }); 
  }

  onSendNewEmailClicked(template: TemplateRef<unknown>): void {
    this.isSendEmailOpenedDialog = this.dialogService.open({ 
      content: template, 
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np'
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
      const isValid = value && value < today;
      this.updateDataPoints('applicantSignedDate', isValid)
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
        this.loadEsignRequestInfo();
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
        // this.loadClientDocumentInfo();
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
      this.cerDateSignatureEvent.emit(this.dateSignatureNoted);
    }
    else if (signedDate > todayDate) {
      this.currentDate = signedDate;
      this.cerDateValidator = true;
      this.dateSignatureNoted = this.authorizationForm?.get('signatureNotedDate')?.patchValue(null);
      this.cerDateSignatureEvent.emit(this.dateSignatureNoted);
    }else{
      this.currentDate = event;
      this.dateSignatureNoted = this.authorizationForm?.get('signatureNotedDate')?.value;
      this.cerDateSignatureEvent.emit(this.dateSignatureNoted); 
    }
  }



updateSendEmailSuccessStatus(event:any){
 this.isSendEmailSuccess = event;
}

loadEsignRequestInfo(){
  this.loaderService.show();
    this.esignFacade.getEsignRequestInfo(this.workflowFacade.clientCaseEligibilityId ?? '')
    .subscribe({
      next: (data: any) =>{
        if (data?.esignRequestId != null) {
            this.emailSentDate = this.intl.formatDate(new Date(data.creationTime), this.dateFormat);
            this.isSendEmailClicked=true;
            this.getLoggedInUserProfile();
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
}
