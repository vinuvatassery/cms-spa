/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

/** Enums **/
import { UIFormStyle } from '@cms/shared/ui-tpa'

/** External Libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { CommunicationEvents, ScreenType, StatusFlag, WorkflowFacade, ContactFacade, ContactInfo,CommunicationFacade } from '@cms/case-management/domain';
import { UserDataService } from '@cms/system-config/domain';
import { Subscription} from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'case-management-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent   {
  currentDate?:any = null;
  dateSignature?:any = null;
  emailSentDate?:any = null;
  /** Public properties **/
  screenName = ScreenType.Authorization;
  isPrintClicked!: boolean;
  isSendEmailClicked!: boolean;
  isSendNewLetterPopupOpened = false;
  isSendNewEmailPopupOpened = false;
  isAuthorizationNoticePopupOpened = false;
  uploadedDocument!: File | undefined;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Input() isCerForm: boolean= false;
  @Input() clientId!: any;
  @Input() clientEligibilityId!: any;
  cerDateValidator: boolean = false;
  copyOfSignedApplication: any;
  showCopyOfSignedApplicationRequiredValidation: boolean = false;
  copyOfSignedApplicationSizeValidation: boolean = false;
  @Output() cerDateSignatureEvent = new EventEmitter<any>(); 
  prevClientCaseEligibilityId!: string;
  contactInfo!: ContactInfo;
  isGoPaperlessOpted: boolean = false;
  toEmail: any = [];
  typeCode!: string;
  subTypeCode!: string;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  incompleteDateValidation!: any;
  loginUserName!:any;
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
    private readonly communicationFacade: CommunicationFacade
  ) {   }

  /** Lifecycle hooks **/
  ngOnInit(): void 
  {  
    this.loadUserContactInfo(this.clientId, this.clientEligibilityId);
  }

    /** Private methods **/  
  private loadUserContactInfo(clientId: any, clientEligibilityId: any) {
    this.loaderService.show();
      this.contactFacade.loadContactInfo(this.clientId ?? 0, this.clientEligibilityId ?? '')
      .subscribe({
        next: (data: any) =>{
          if (data) {
              if(data?.clientCaseEligibility?.paperlessFlag === StatusFlag.Yes)
              {
                this.isGoPaperlessOpted = true;
                this.ref.detectChanges();
                if(data?.email?.email !== null){
                  let emailObject = {
                    clientEmailId : data?.email?.clientEmailId, 
                    email : data?.email?.email,
                  }
                  this.toEmail.push(emailObject);
                }
              }
              this.loadClientDocumentInfo();
            }
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  private loadClientDocumentInfo() {
    if(this.isGoPaperlessOpted)
    {
      this.typeCode=CommunicationEvents.CerAuthorizationEmail
      this.subTypeCode= CommunicationEvents.Email
    }
    else
    {
      this.typeCode=CommunicationEvents.CerAuthorizationLetter
      this.subTypeCode= CommunicationEvents.Letter
    }
      this.communicationFacade.getClientDocument(this.typeCode ?? '', this.subTypeCode ?? '',this.workflowFacade.clientCaseEligibilityId ?? '')
      .subscribe({
        next: (data: any) =>{
          if (data) {
              this.emailSentDate = this.intl.formatDate(new Date(data.creationTime), this.dateFormat);
              if(data.documentTypeCode==CommunicationEvents.CerAuthorizationEmail)
              {
              this.isSendEmailClicked=true;
              }
              else
              {
              this.isPrintClicked=true;
              }
              this.ref.detectChanges();
              this.getLoggedInUserProfile();
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
    this.userProfileSubsriction=this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
       this.loginUserName= profile[0]?.firstName+' '+profile[0]?.lastName;
      }
    })
  }

  /** Internal event methods **/
  onSendNewLetterClicked() {
    this.isSendNewLetterPopupOpened = true;
  }

  onSendNewEmailClicked() {
    this.isSendNewEmailPopupOpened = true;
  }

  onCloseAuthorizationNoticeClicked() {
    this.isAuthorizationNoticePopupOpened = false;
  }

  onAuthorizationNoticeClicked() {
    this.isAuthorizationNoticePopupOpened = true;
  }

  /** External event methods **/
  handleCloseSendNewEmailClicked(event: CommunicationEvents) {
    switch (event) {
      case CommunicationEvents.Close:
        this.isSendNewEmailPopupOpened = false;
        break;
      case CommunicationEvents.Print:
        this.isSendNewEmailPopupOpened = false;
        this.isSendEmailClicked = true;
        this.getLoggedInUserProfile();
        this.loadClientDocumentInfo();
        break;
      default:
        break;
    }
  }

  handleCloseSendNewLetterClicked(event: CommunicationEvents) {
    switch (event) {
      case CommunicationEvents.Close:
        this.isSendNewLetterPopupOpened = false;
        break;
      case CommunicationEvents.Print:
        this.isPrintClicked = true;
        this.loadClientDocumentInfo();
        this.getLoggedInUserProfile();
        break;
      default:
        break;
    }
  }
  loadDateSignature(){
  this.cerDateSignatureEvent.emit(this.dateSignature);
  }

  onChange(event : Date) {
    this.cerDateValidator = false;
    const signedDate = event;
    const todayDate = new Date();
    if (signedDate == null) {
      this.currentDate = signedDate;
      this.dateSignature = null;
      this.cerDateSignatureEvent.emit(this.dateSignature);
    }
    else if (signedDate > todayDate) {
      this.currentDate = signedDate;
      this.cerDateValidator = true;
      this.dateSignature = null;
      this.cerDateSignatureEvent.emit(this.dateSignature);
    }else{
      this.currentDate = event;
      this.dateSignature = this.intl.formatDate(new Date(), this.dateFormat);
      this.cerDateSignatureEvent.emit(this.dateSignature);
    }
  }

  handleFileSelected(event: any) {
    if(event === null || event === undefined || event.files[0] === null){
      this.showCopyOfSignedApplicationRequiredValidation = false;
    }else{
    this.copyOfSignedApplication = null;
    this.copyOfSignedApplicationSizeValidation = false;
    this.copyOfSignedApplication = event.files[0].rawFile;
   if(this.copyOfSignedApplication.size > this.configurationProvider.appSettings.uploadFileSizeLimit)
   {
    this.copyOfSignedApplicationSizeValidation=true;
    this.copyOfSignedApplication = null;
   }
  }
}
}
