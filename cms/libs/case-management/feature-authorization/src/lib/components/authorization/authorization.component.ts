/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/** Enums **/
import { UIFormStyle } from '@cms/shared/ui-tpa'

/** External Libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { CommunicationEvents, ScreenType, StatusFlag } from '@cms/case-management/domain';
import { Subscription} from 'rxjs';
import { IntlService } from '@progress/kendo-angular-intl';

/** Internal Libraries **/
import {
  WorkflowFacade, ContactFacade, ContactInfo, 
} from '@cms/case-management/domain';

@Component({
  selector: 'case-management-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent   {
  currentDate?:any = null;;
  dateSignature?:any = null;
  /** Public properties **/
  screenName = ScreenType.Authorization;
  isPrintClicked!: boolean;
  isSendEmailClicked!: boolean;
  isSendNewLetterPopupOpened = false;
  isSendNewEmailPopupOpened = false;
  isAuthorizationNoticePopupOpened = false;
  uploadedDocument!: File | undefined;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  isCerForm = false;
  cerDateValidator: boolean = false;
  copyOfSignedApplication: any;
  showCopyOfSignedApplicationRequiredValidation: boolean = false;
  copyOfSignedApplicationSizeValidation: boolean = false;
  @Output() cerDateSignatureEvent = new EventEmitter<any>(); 
  prevClientCaseEligibilityId!: string;
  contactInfo!: ContactInfo;
  isGoPaperlessOpted: boolean = false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
    /** Private properties **/
    private currentSessionSubscription !: Subscription;

  constructor(
    private readonly configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private workflowFacade: WorkflowFacade,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly contactFacade: ContactFacade,
    private readonly route: ActivatedRoute,
    public intl: IntlService,
    private readonly ref: ChangeDetectorRef
  ) {   }

  /** Lifecycle hooks **/
  ngOnInit(): void 
  {  
    this.loadCurrentSession();
  }

  ngOnDestroy(): void {
    this.currentSessionSubscription.unsubscribe();
  }

    /** Private methods **/
  private loadCurrentSession() {
    const sessionId = this.route.snapshot.queryParams['sid'];
    this.loaderService.show();
    this.workflowFacade.loadWorkFlowSessionData(sessionId);
    this.currentSessionSubscription = this.workflowFacade.sessionDataSubject$.subscribe((resp) => {
      if (resp) {
        this.prevClientCaseEligibilityId = JSON.parse(resp.sessionData)?.prevClientCaseEligibilityId;
        if (this.prevClientCaseEligibilityId) {
          this.isCerForm = true
        }
        this.loadContactInfo();
        this.loaderService.hide();
      }
    });
  }
  
  private loadContactInfo(isFormFillRequired = true) {
    this.loaderService.show();
      this.contactFacade.loadContactInfo(this.workflowFacade.clientId ?? 0, this.workflowFacade.clientCaseEligibilityId ?? '')
        .subscribe((data: ContactInfo) => {
          if (data) {
            this.contactInfo = data;
            if(this.contactInfo != null && this.contactInfo != undefined && this.contactInfo.clientCaseEligibility != undefined && this.contactInfo.clientCaseEligibility != null){
              if(this.contactInfo.clientCaseEligibility.paperlessFlag === StatusFlag.Yes)
              {
                this.isGoPaperlessOpted = true;
              }else{
                this.isGoPaperlessOpted = false; 
              }
                this.ref.detectChanges();
            }
          }
        });
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
        this.isSendNewLetterPopupOpened = false;
        this.isPrintClicked = true;
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
    this.copyOfSignedApplication = null;
    this.copyOfSignedApplicationSizeValidation = false;
    this.copyOfSignedApplication = event.files[0].rawFile;
    this.showCopyOfSignedApplicationRequiredValidation = false;
   if(this.copyOfSignedApplication.size > this.configurationProvider.appSettings.uploadFileSizeLimit)
   {
    this.copyOfSignedApplicationSizeValidation=true;
    this.copyOfSignedApplication = null;
   }
  }
}