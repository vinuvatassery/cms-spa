/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';


/** Internal Libraries **/
import { CommunicationEvents, CommunicationFacade, WorkflowFacade, ContactFacade, CommunicationEventTypeCode, VendorContactsFacade, ScreenType, AddressTypeCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

/** External Libraries **/
import { LoaderService, LoggingService, SnackBarNotificationType, NotificationSnackbarService } from '@cms/shared/util-core';
import { StatusFlag } from '@cms/shared/ui-common';
import { UserDataService } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-send-letter',
  templateUrl: './send-letter.component.html',
  styleUrls: ['./send-letter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendLetterComponent implements OnInit {
  /** Input properties **/
  @Input() data!: any;
  @Input() mailingAddress$!: Observable<any>;
  @Input() communicationLetterTypeCode!:any;
  @Input() clientCaseEligibilityId!: any;
  @Input() clientId!: any;
  @Input() isCerForm!: any;
  @Input() vendorId!: string;
  @Input() screenName!: any;

  /** Output properties  **/
  @Output() closeSendLetterEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();
  @Output() openDdlLetterEvent = new EventEmitter();
  @Output() emailEditorValueEvent = new EventEmitter<any>();

  private currentSessionSubscription !: Subscription;
   /** Constructor **/
   constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly ref: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly workflowFacade: WorkflowFacade,
    private readonly contactFacade: ContactFacade,
    private readonly vendorContactFacade: VendorContactsFacade,
    private readonly userDataService: UserDataService,) { }

  /** Public properties **/
  public formUiStyle : UIFormStyle = new UIFormStyle();
  letterEditorValueEvent = new EventEmitter<boolean>();
  letterContentValue!: any;
  isNewLetterClicked!: any;
  isOpenLetterTemplate = false;
  isShowPreviewLetterPopupClicked = false;
  isShowSaveForLaterPopupClicked = false;
  isShowSendLetterToPrintPopupClicked = false;
  currentLetterData:any;
  currentLetterPreviewData:any;
  prevClientCaseEligibilityId!: string;
  selectedTemplate!: any;
  cerEmailAttachedFiles: any[] = [];
  clientAndVendorAttachedFiles: any[] = [];
  mailingAddress: any;
  mailingAddressSubscription= new Subscription();
  attachmentCount: number = 0;
  entityId!: string;
  dataValue: Array<any> = [
    {
      text: '',
    },
  ];
  popupClass = 'app-c-split-button';
  ddlTemplates: any;
  isButtonVisible: boolean = true;
  loginUserId!: any;

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.getLoggedInUserProfile();
    if (this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter) {
      this.loadMailCodes();
      this.loadClientAndVendorDraftLetterTemplates();
    }
    else {
      this.vendorContactFacade.loadMailCodes(this.vendorId);
    }
    this.isNewLetterClicked =  this.data ? true : false;
  }

  getLoggedInUserProfile(){
    this.loaderService.show();
    this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
        this.loginUserId= profile[0]?.loginUserId;
      }
    })
    this.loaderService.hide();
  }

  loadClientAndVendorDraftLetterTemplates() {
    if(this.clientId){
      this.entityId = this.clientId;
    }
    if(this.vendorId){
      this.entityId = this.vendorId;
    }
    this.loaderService.show();
    this.communicationFacade.loadDraftNotificationRequest(this.entityId, this.communicationLetterTypeCode)
    .subscribe({
      next: (data: any) =>{
        if (data?.length > 0) {
          this.ddlTemplates = data;
          for (let template of this.ddlTemplates){
            template.documentTemplateId = template.notificationDraftId;
           }
          this.ref.detectChanges();
        }else{
          this.loadDropdownLetterTemplates();
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
    },
  });
  }

  private loadMailCodes() {
    this.vendorContactFacade.mailCodes$.subscribe((resp) => {
      if (resp && resp.length > 0) {
        let selectedAddress = resp.find((address: any) => address?.activeFlag === "Y" && address.preferredFlag === "Y");
        if (!selectedAddress) {
          selectedAddress = resp.find((address: any) => address?.activeFlag === "Y");
        }
        this.mailingAddress = selectedAddress;
      }
      this.ref.detectChanges();
    });
  }

  private loadClientMailingAddress() {
    this.contactFacade.getClientAddress(this.clientId);
    this.contactFacade.address$.subscribe((address:any)=>{
      let selectedAddress = address.filter((x:any)=>x.activeFlag == StatusFlag.Yes && x.addressTypeCode === AddressTypeCode.Mail)[0];
      this.mailingAddress = selectedAddress;
    });
    this.ref.detectChanges();
  }

  private loadCurrentSession() {
    const sessionId = this.route.snapshot.queryParams['sid'];
    this.loaderService.show();
    this.workflowFacade.loadWorkFlowSessionData(sessionId);
    this.currentSessionSubscription = this.workflowFacade.sessionDataSubject$.subscribe((resp) => {
      if (resp) {
        this.prevClientCaseEligibilityId = JSON.parse(resp.sessionData)?.prevClientCaseEligibilityId;
        if (this.prevClientCaseEligibilityId) {
          this.isCerForm = true;
        }
        this.loaderService.hide();
      }
    });
  }

  /** Internal event methods **/
  onSendNewLetterClicked() {
    this.isNewLetterClicked = true;
    this.isShowPreviewLetterPopupClicked = false;
    this.isShowSendLetterToPrintPopupClicked = false;
    this.isShowSaveForLaterPopupClicked = false;
  }

  onCloseSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = false;
    this.isShowPreviewLetterPopupClicked = false;
    this.isOpenLetterTemplate = true;
  }

  saveClientAndVendorNotificationForLater(draftTemplate: any) {
    this.loaderService.show();
    let letterRequestFormdata = this.communicationFacade.prepareClientAndVendorLetterFormData(this.clientId, this.loginUserId);
    let draftEsignRequest = this.communicationFacade.prepareClientAndVendorEmailData(letterRequestFormdata, draftTemplate, this.clientAndVendorAttachedFiles, this.vendorId);
      if(draftTemplate?.notificationDraftId == undefined || draftTemplate?.notificationDraftId == null){
        this.communicationFacade.saveClientAndVendorNotificationForLater(draftEsignRequest)
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.onCloseNewLetterClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Email Saved As Draft');
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isOpenLetterTemplate = true;
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
    }else{
        this.communicationFacade.updateSavedClientandVendorEmailTemplate(draftEsignRequest)
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.onCloseNewLetterClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Email Saved As Draft');
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isOpenLetterTemplate = true;
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
      }
  }

  onSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = true;
  }

  onSaveForLaterTemplateClicked() {
    this.isShowSaveForLaterPopupClicked = true;
    this.isShowSaveForLaterPopupClicked = true;
    this.emailEditorValueEvent.emit(this.currentLetterData);
    this.selectedTemplate.templateContent = this.currentLetterData.templateContent;
    if (this.communicationLetterTypeCode === CommunicationEventTypeCode.CerAuthorizationLetter)
    {
      this.saveDraftLetterTemplate(this.selectedTemplate);
    }else{
      this.saveClientAndVendorNotificationForLater(this.selectedTemplate);
    }
  }

  onSendLetterToPrintDialogClicked(event: any) {
    this.isShowSendLetterToPrintPopupClicked = false;
    if (event === CommunicationEvents.Print) {
      this.emailEditorValueEvent.emit(this.currentLetterData);
    this.selectedTemplate.templateContent = this.currentLetterData.templateContent;
    this.sendLetterToPrint(this.selectedTemplate, CommunicationEvents.SendLetter);
    this.closeSendLetterEvent.emit(CommunicationEvents.Print);
    } else if (event === CommunicationEvents.Close) {
      this.isShowSendLetterToPrintPopupClicked = false;
    }
  }

  onPreviewLetterClicked() {
    this.isShowPreviewLetterPopupClicked = true;
    this.emailEditorValueEvent.emit(this.currentLetterData);
    this.selectedTemplate.templateContent = this.currentLetterData.templateContent;
    this.generateText(this.selectedTemplate, CommunicationEvents.Preview);
  }

  private generateText(letterData: any, requestType: CommunicationEvents){
    this.loaderService.show();
    if(this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter){
      this.generateClientTextTemplate(letterData, requestType);
    }else{
    this.clientId = this.workflowFacade.clientId ?? 0;
    this.clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
    }
  }

  private generateClientTextTemplate(letterData: any, requestType: CommunicationEvents){
    let formData = this.communicationFacade.preparePreviewModelData(letterData);
    this.communicationFacade.generateTextTemplate(this.clientId ?? 0, this.clientCaseEligibilityId ?? '', formData ?? '', requestType.toString() ??'', this.vendorId ?? '')
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.currentLetterPreviewData = data;
            this.letterEditorValueEvent.emit(this.currentLetterPreviewData);
            this.ref.detectChanges();
            if(requestType === CommunicationEvents.SendLetter){
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Document has been sent to Print');
            }
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        },
      });
  }

  private sendLetterToPrint(draftTemplate: any, requestType: CommunicationEvents){
    this.loaderService.show();
    if(this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter){
      this.sendClientAndVendorLetterToPrint(draftTemplate, requestType);
    }else{
      this.clientId = this.workflowFacade.clientId ?? 0;
      this.clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
    }
  }

  private sendClientAndVendorLetterToPrint(draftTemplate: any, requestType: CommunicationEvents){
    let formData = this.communicationFacade.prepareSendLetterData(draftTemplate, this.clientAndVendorAttachedFiles);
    this.communicationFacade.sendLetterToPrint(this.clientId, this.clientCaseEligibilityId, formData ?? '', requestType.toString() ??'', this.vendorId?? '')
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.currentLetterPreviewData = data;
            const fileUrl = window.URL.createObjectURL(data);
            const documentName = this.getFileNameFromTypeCode(draftTemplate.typeCode);
            this.ref.detectChanges();
            const downloadLink = document.createElement('a');
            downloadLink.href = fileUrl;
            downloadLink.download = documentName;
            downloadLink.click();
            this.onCloseNewLetterClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Document has been sent to Print')
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        },
      });
  }

  onSendLetterToPrintClicked() {
    this.isNewLetterClicked=true;
    this.isShowSendLetterToPrintPopupClicked=true;
    this.isShowPreviewLetterPopupClicked=false;
  }

  onCloseNewLetterClicked() {
    this.closeSendLetterEvent.emit(CommunicationEvents.Close);
  }
  onPreviewLetterClose(){
    this.isShowPreviewLetterPopupClicked = false;
  }

  /** External event methods **/
  handleLetterEditor(event: any) {
    this.currentLetterData = event;
  }

  handleOpenTemplateClicked() {
    this.isOpenLetterTemplate = true;
    this.loadInitialData.emit();
  }

  onClosePreview(){
    this.isShowPreviewLetterPopupClicked = false;
  }

  onConfirmSendLetterToPrintDialogClicked(){
    this.isShowSendLetterToPrintPopupClicked = false;
  }

  private loadDropdownLetterTemplates() {
    this.loaderService.show();
    const channelTypeCode = CommunicationEvents.Letter;
    this.communicationFacade.loadLetterTemplates(this.screenName, channelTypeCode)
    .subscribe({
      next: (data: any) =>{
        if (data) {
          this.ddlTemplates = data;
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      this.loggingService.logException(err);
    },
  });
  }

  handleDdlLetterValueChange(event: any) {
    if(event.documentTemplateId){
    this.loaderService.show();
    this.communicationFacade.loadTemplateById(event.documentTemplateId)
    .subscribe({
      next: (data: any) =>{
      if (data) {
        this.selectedTemplate = data;
        this.handleLetterEditor(data);
        this.isOpenLetterTemplate=true;
        this.ref.detectChanges();
        this.openDdlLetterEvent.emit();
        this.loadMailingAddress();
        this.emailEditorValueEvent.emit(data);
      }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
    },
  });
}else{
      this.selectedTemplate = event;
      this.handleLetterEditor(event);
      this.isOpenLetterTemplate=true;
      this.ref.detectChanges();
      this.openDdlLetterEvent.emit();
      this.loadMailingAddress();
 }
}

  private saveDraftLetterTemplate(draftTemplate: any) {
    this.loaderService.show();
    let formData = this.communicationFacade.prepareSendLetterData(draftTemplate, this.cerEmailAttachedFiles);
    this.communicationFacade.saveForLaterEmailTemplate(formData)
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.onCloseNewLetterClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Letter Saved As Draft')
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
  }

  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {
      if(type == SnackBarNotificationType.ERROR)
      {
        const err= subtitle;
        this.loggingService.logException(err)
      }
        this.notificationSnackbarService.manageSnackBar(type,subtitle)
        this.hideLoader();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }

  getClientDocumentsViewDownload(clientDocumentId: string) {
    return this.communicationFacade.getClientDocumentsViewDownload(clientDocumentId);
 }

 cerEmailAttachments(event:any){
  if (this.communicationLetterTypeCode == CommunicationEventTypeCode.CerAuthorizationLetter)
  {
    this.cerEmailAttachedFiles = event;
    this.attachmentCount = this.cerEmailAttachedFiles?.length;
  }else{
    this.clientAndVendorAttachedFiles = event;
    this.attachmentCount = this.clientAndVendorAttachedFiles?.length;
  }
}

loadMailingAddress() {
  if (this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter)
  {
    if(this.screenName == ScreenType.ClientProfile){
      this.loadClientMailingAddress();
    }else{
    this.vendorContactFacade.loadMailCodes(this.vendorId);
    }
  }
  else{
     this.contactFacade.loadMailingAddress(this.clientId);
  }
}

getFileNameFromTypeCode(typeCode: string): string {
  switch (typeCode) {
    case CommunicationEventTypeCode.ClientLetter:
      return "Client Letter.zip";
    case CommunicationEventTypeCode.VendorLetter:
      return "Vendor Letter.zip"; 
    case CommunicationEventTypeCode.CerAuthorizationLetter:
      return "CER Authorization Letter.zip";
    default:
      throw new Error('Invalid type code');
  }
}
}
