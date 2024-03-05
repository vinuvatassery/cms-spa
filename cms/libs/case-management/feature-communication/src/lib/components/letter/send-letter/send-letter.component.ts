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
  @Input() mailingAddress$!: Observable<any>;
  @Input() communicationLetterTypeCode!:any;
  @Input() clientCaseEligibilityId!: any;
  @Input() entityId!: any;
  @Input() isCerForm!: any;
  @Input() notificationGroup!: any;
  @Input() isContinueDraftClicked!: boolean;
  @Input() isNewNotificationClicked!: boolean;
  @Input() notificationDraftId!: string;

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
  dataValue: Array<any> = [
    {
      text: '',
    },
  ];
  popupClass = 'app-c-split-button';
  ddlTemplates: any;
  isButtonVisible: boolean = true;
  loginUserId!: any;
  selectedTemplateId!: string;

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.getLoggedInUserProfile();
    if (this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter) {
      this.loadMailCodes();
      if(this.isContinueDraftClicked){
      this.loadClientAndVendorDraftLetterTemplates();
      }else if(this.isNewNotificationClicked){
        this.openNewLetterClicked();
      }else{
        this.loadDropdownLetterTemplates();
      }
    }
    else {
      this.vendorContactFacade.loadMailCodes(this.entityId);
    }
    this.isNewLetterClicked =  this.notificationGroup ? true : false;
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
    this.loaderService.show();
    this.communicationFacade.loadDraftNotificationRequest(this.entityId, this.communicationLetterTypeCode)
    .subscribe({
      next: (data: any) =>{
        if (data?.length > 0) {
          this.ddlTemplates = data;
          // for (let template of this.ddlTemplates){
          //   template.description = template.templateTypeCode;
          //   template.documentTemplateId = template.notificationDraftId;
          //  }
           this.handleDdlLetterValueChange(data[0]);
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
    this.contactFacade.getClientAddress(this.entityId);
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
    let letterRequestFormdata = this.communicationFacade.prepareClientAndVendorLetterFormData(this.entityId, this.loginUserId);
    let draftEsignRequest = this.communicationFacade.prepareClientAndVendorEmailData(letterRequestFormdata, draftTemplate, this.clientAndVendorAttachedFiles);
      if(draftTemplate?.notifcationDraftId == undefined || draftTemplate?.notifcationDraftId == null){
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
    this.entityId = this.workflowFacade.clientId ?? 0;
    this.clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
    }
  }

  private generateClientTextTemplate(letterData: any, requestType: CommunicationEvents){
    let formData = this.communicationFacade.preparePreviewModelData(letterData);
    this.communicationFacade.generateTextTemplate(this.entityId ?? '', this.clientCaseEligibilityId ?? '', formData ?? '', requestType.toString() ??'')
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
      this.entityId = this.workflowFacade.clientId ?? 0;
      this.clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
    }
  }

  private sendClientAndVendorLetterToPrint(draftTemplate: any, requestType: CommunicationEvents){
    let formData = this.communicationFacade.prepareSendLetterData(draftTemplate, this.clientAndVendorAttachedFiles);
    this.communicationFacade.sendLetterToPrint(this.entityId, this.clientCaseEligibilityId, formData ?? '', requestType.toString() ??'')
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
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Document has been sent to Print');
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

  openNewLetterClicked(){
    this.loaderService.show();
    this.communicationFacade.deleteNotificationDraft(this.notificationDraftId)
        .subscribe({
          next: (data: any) =>{
          if (data === true) {
            this.loadDropdownLetterTemplates();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
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
    this.communicationFacade.loadLetterTemplates(this.notificationGroup, channelTypeCode)
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
        this.openDdlLetterEvent.emit();
        this.loadMailingAddress();
        this.emailEditorValueEvent.emit(data);
        this.ref.detectChanges();
      }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
    },
  });
}else{
  this.selectedTemplateId = event.notificationTemplateId;
  this.isOpenLetterTemplate=true;
  this.selectedTemplate = event;
  this.handleLetterEditor(event);
  this.openDdlLetterEvent.emit();
  this.loadMailingAddress();
  this.ref.detectChanges();
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
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Letter Saved As Draft');
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
    if(this.notificationGroup == ScreenType.ClientProfile){
      this.loadClientMailingAddress();
    }else{
    this.vendorContactFacade.loadMailCodes(this.entityId);
    }
  }
  else{
     this.contactFacade.loadMailingAddress(this.entityId);
  }
}

getFileNameFromTypeCode(typeCode: string): string {
  switch (typeCode) {
    case CommunicationEventTypeCode.ClientLetter:
      return "Client Letter_"+ this.entityId +".zip";
    case CommunicationEventTypeCode.VendorLetter:
      return "Vendor Letter+"+ this.entityId +".zip"; 
    case CommunicationEventTypeCode.CerAuthorizationLetter:
      return "CER Authorization Letter.zip";
    default:
      throw new Error('Invalid type code');
  }
}
}
