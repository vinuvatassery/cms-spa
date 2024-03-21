/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  OnDestroy,
  } from '@angular/core';


/** Internal Libraries **/
import { CommunicationEvents, CommunicationFacade, WorkflowFacade, ContactFacade, CommunicationEventTypeCode, VendorContactsFacade, ScreenType, AddressTypeCode, WorkflowTypeCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
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
export class SendLetterComponent implements OnInit, OnDestroy {
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
  @Input() templateLoadType!: string;
  @Input() informationalText!:string
  @Input() templateHeader !:string;
  @Input() triggerFrom !: string;

  /** Output properties  **/
  @Output() closeSendLetterEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();

   /** Constructor **/
   constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly ref: ChangeDetectorRef,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly workflowFacade: WorkflowFacade,
    private readonly contactFacade: ContactFacade,
    private readonly vendorContactFacade: VendorContactsFacade,
    private readonly userDataService: UserDataService,) { }

  /** Public properties **/

  public formUiStyle : UIFormStyle = new UIFormStyle();
  letterContentValue!: any;
  isNewLetterClicked!: any;
  isOpenLetterTemplate = false;
  isShowPreviewLetterPopupClicked = false;
  isShowSaveForLaterPopupClicked = false;
  isShowSendLetterToPrintPopupClicked = false;
  currentLetterData:any;
  currentLetterPreviewData:any;
  prevClientCaseEligibilityId!: string;
  selectedTemplateContent !:any;
  updatedTemplateContent !:any;
  selectedTemplate!: any;
  cerEmailAttachedFiles: any[] = [];
  clientAndVendorAttachedFiles: any[] = [];
  mailingAddress: any;
  mailingAddressSubscription= new Subscription();
  clientAddressSubscription = new Subscription();
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
  documentTemplate!: any;
  currentTemplate!:any;
  templateDrpDisable: boolean = false;
  cancelDisplay:boolean = true;
  loadTemplate$ = this.communicationFacade.loadTemplate$;
  draftedTemplate:any='';
  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadTemplate();
    this.getLoggedInUserProfile();
    this.getClientAddressSubscription();
    if (this.communicationLetterTypeCode === CommunicationEventTypeCode.ApplicationAuthorizationLetter || this.communicationLetterTypeCode === CommunicationEventTypeCode.CerAuthorizationLetter) {
      this.vendorContactFacade.loadMailCodes(this.entityId);
      this.loadClientAndVendorDraftLetterTemplates();
    }else {
      this.vendorContactFacade.loadMailCodes(this.entityId);
      if(this.isContinueDraftClicked){
      this.loadClientAndVendorDraftLetterTemplates();
      }else if(this.isNewNotificationClicked){
        this.openNewLetterClicked();
      }else{
        this.loadDropdownLetterTemplates();
      }      
    }
    this.isNewLetterClicked =  this.notificationGroup ? true : false;
  }

  ngOnDestroy(): void {
    this.clientAddressSubscription.unsubscribe();
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

  private loadTemplate(){
    this.loadTemplate$.subscribe((response:any)=>{
      if(response){
        this.loadDropdownLetterTemplates();
      }
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
    this.loadInitialData.emit();
    this.ref.detectChanges();
  }

  private getClientAddressSubscription() {
    this.clientAddressSubscription = this.contactFacade.address$.subscribe((address: any) => {
      let selectedAddress = address.filter((x: any) => x.activeFlag == StatusFlag.Yes && x.addressTypeCode === AddressTypeCode.Mail)[0];
      this.mailingAddress = selectedAddress;
      this.ref.detectChanges();
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
    let draftLetterRequest = this.communicationFacade.prepareClientAndVendorEmailData(letterRequestFormdata, draftTemplate, this.clientAndVendorAttachedFiles);
        this.communicationFacade.saveClientAndVendorNotificationForLater(draftLetterRequest)
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
          this.isOpenLetterTemplate = true;
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
  }

  onSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = true;
  }

  onSaveForLaterTemplateClicked() {
    this.isShowSaveForLaterPopupClicked = true;
    this.selectedTemplate.templateContent = this.updatedTemplateContent;
    if (this.communicationLetterTypeCode === CommunicationEventTypeCode.ApplicationAuthorizationLetter || this.communicationLetterTypeCode === CommunicationEventTypeCode.CerAuthorizationLetter)
    {
      this.saveDraftEsignLetterRequest(this.selectedTemplate);
    }else{
      this.saveClientAndVendorNotificationForLater(this.selectedTemplate);
    }
  }

  onSendLetterToPrintDialogClicked(event: any) { 
    this.isShowSendLetterToPrintPopupClicked = false;
    if (event === CommunicationEvents.Print) {
    this.selectedTemplate.templateContent = this.updatedTemplateContent;
    this.sendLetterToPrint(this.selectedTemplate, CommunicationEvents.SendLetter);
    this.closeSendLetterEvent.emit(CommunicationEvents.Print);
    } else if (event === CommunicationEvents.Close) {
      this.isShowSendLetterToPrintPopupClicked = false;
    }
  }

  onPreviewLetterClicked() {
    this.isShowPreviewLetterPopupClicked = true;
    this.selectedTemplate.templateContent = this.updatedTemplateContent;
    this.generateText(this.selectedTemplate, CommunicationEvents.Preview);
  }

  private generateText(letterData: any, requestType: CommunicationEvents){
    if(this.communicationLetterTypeCode != CommunicationEventTypeCode.ApplicationAuthorizationLetter || this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter){
      this.generateClientTextTemplate(letterData, requestType);
    }else{
    this.entityId = this.workflowFacade.clientId ?? 0;
    this.clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
    }
  }

  private generateClientTextTemplate(letterData: any, requestType: CommunicationEvents){
    this.loaderService.show();
    let formData = this.communicationFacade.preparePreviewModelData(letterData);
    this.communicationFacade.generateTextTemplate(this.entityId ?? '', this.clientCaseEligibilityId ?? '', formData ?? '', requestType.toString() ??'')
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.currentLetterPreviewData = data;
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
    if(this.communicationLetterTypeCode == CommunicationEventTypeCode.ApplicationAuthorizationLetter || this.communicationLetterTypeCode === CommunicationEventTypeCode.CerAuthorizationLetter){
      this.entityId = this.workflowFacade.clientId ?? 0;
      this.clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
      this.sendClientAndVendorLetterToPrint(this.entityId, this.clientCaseEligibilityId, draftTemplate, requestType, this.cerEmailAttachedFiles);
    }else{
      this.sendClientAndVendorLetterToPrint(this.entityId, this.clientCaseEligibilityId, draftTemplate, requestType, this.clientAndVendorAttachedFiles);
    }
  }

  private sendClientAndVendorLetterToPrint(entityId: any, clientCaseEligibilityId: any, draftTemplate: any, requestType: CommunicationEvents, attachments: any[]){
    let templateTypeCode = this.getApiTemplateTypeCode();
    let formData = this.communicationFacade.prepareSendLetterData(draftTemplate, this.clientAndVendorAttachedFiles, templateTypeCode);
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

  getApiTemplateTypeCode(): string {
    let templateTypeCode = '';
    switch (this.communicationLetterTypeCode) {
      case CommunicationEventTypeCode.PendingNoticeLetter:
        templateTypeCode = CommunicationEventTypeCode.PendingLetterSent;
        break;
      case CommunicationEventTypeCode.RejectionNoticeLetter:
        templateTypeCode = CommunicationEventTypeCode.RejectionLetterSent;
        break;
      case CommunicationEventTypeCode.ApprovalNoticeLetter:
        templateTypeCode = CommunicationEventTypeCode.ApprovalLetterSent;
        break;
    }
    return templateTypeCode;
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
    if (this.notificationGroup !== undefined && this.templateLoadType !== undefined) {
      this.loaderService.show();
      this.communicationFacade.loadLetterTemplates(this.notificationGroup, this.templateLoadType)
        .subscribe({
          next: (data: any) => {
            if (data) {
              this.ddlTemplates = data;
              this.currentTemplate = this.ddlTemplates.filter((x: any) => x.templateTypeCode === this.communicationLetterTypeCode)
              if (this.currentTemplate.length > 0) {
                this.documentTemplate = { 'description': this.currentTemplate[0].description, 'documentTemplateId': this.currentTemplate[0].documentTemplateId };
                this.handleDdlLetterValueChange(this.currentTemplate[0]);
              }
              if (this.communicationLetterTypeCode === CommunicationEventTypeCode.PendingNoticeLetter
                || this.communicationLetterTypeCode === CommunicationEventTypeCode.RejectionNoticeLetter
                || this.communicationLetterTypeCode === CommunicationEventTypeCode.ApprovalNoticeLetter) {
                this.templateDrpDisable = true;
                this.cancelDisplay = false;                
              }
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
  }

  getDraftedTemplate(){
    this.communicationFacade.loadDraftNotificationRequest(this.entityId, this.communicationLetterTypeCode).subscribe((response:any)=>{
      if(response.length>0){
        this.selectedTemplateContent =response[0].requestBody;
        this.updatedTemplateContent = response[0].requestBody; 
        this.ref.detectChanges();
      }
    });
  }

  handleDdlLetterValueChange(event: any) {
    if (event.documentTemplateId) {
      this.loaderService.show();
      this.communicationFacade.loadTemplateById(event.documentTemplateId)
        .subscribe({
          next: (data: any) => {
            if (data) {
              this.selectedTemplate = data;
              this.selectedTemplateContent = data.templateContent;
              this.updatedTemplateContent = data.templateContent;
              this.isOpenLetterTemplate = true;
              this.loadMailingAddress();
              if ((this.communicationLetterTypeCode === CommunicationEventTypeCode.PendingNoticeLetter
                || this.communicationLetterTypeCode === CommunicationEventTypeCode.RejectionNoticeLetter)
                && this.triggerFrom === WorkflowTypeCode.NewCase) {
                this.getDraftedTemplate();
              }
              this.ref.detectChanges();
            }
            this.loaderService.hide();
          },
          error: (err: any) => {
            this.loaderService.hide();
            this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          },
        });
    } 
    else {
      this.selectedTemplateId = event.notificationTemplateId;
      this.isOpenLetterTemplate = true;
      this.selectedTemplate = event;
      this.selectedTemplateContent = event.requestBody;
      this.updatedTemplateContent = event.requestBody;
      this.documentTemplate = {
        'description': event.description,
        'documentTemplateId': event.notificationTemplateId
      };
      this.loadMailingAddress();
      this.ref.detectChanges();
    }
  }

  private saveDraftEsignLetterRequest(draftTemplate: any) {
    this.loaderService.show();
    draftTemplate.entity = this.communicationLetterTypeCode;
    let formData = this.communicationFacade.prepareEsignLetterData(draftTemplate, this.entityId,this.loginUserId, this.cerEmailAttachedFiles);
    this.communicationFacade.saveEsignLetterForLater(formData)
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
  if (this.communicationLetterTypeCode == CommunicationEventTypeCode.ApplicationAuthorizationLetter || this.communicationLetterTypeCode == CommunicationEventTypeCode.CerAuthorizationLetter)
  {
    const isFileExists = this.cerEmailAttachedFiles?.some((item: any) => item.name === event?.document?.documentName)
    if(!isFileExists)
    {
    this.cerEmailAttachedFiles?.push(event);
    }
    this.attachmentCount = this.cerEmailAttachedFiles?.length;
  }else{
    const isFileExists = this.clientAndVendorAttachedFiles?.some((item: any) => item.name === event?.document?.documentName)
    if(!isFileExists)
    {
    this.clientAndVendorAttachedFiles?.push(event);
    }
    this.attachmentCount = this.clientAndVendorAttachedFiles?.length;
  }
}

loadMailingAddress() {
  if (this.communicationLetterTypeCode != CommunicationEventTypeCode.ApplicationAuthorizationLetter || this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter)
  {
    if(this.notificationGroup == ScreenType.ClientProfile){
      this.loadClientMailingAddress();
    }else{
    this.vendorContactFacade.loadMailCodes(this.entityId);
    }
  }
  else{
     this.contactFacade.loadMailingAddress(this.entityId);
     this.loadInitialData.emit();
  }
}

  getFileNameFromTypeCode(typeCode: string): string {
    switch (typeCode) {
      case CommunicationEventTypeCode.ClientLetter:
        return "Client Letter_" + this.entityId + ".zip";
      case CommunicationEventTypeCode.VendorLetter:
        return "Vendor Letter+" + this.entityId + ".zip";
      case CommunicationEventTypeCode.ApplicationAuthorizationLetter:
        return "Application Authorization Letter.zip";
      case CommunicationEventTypeCode.CerAuthorizationLetter:
        return "CER Authorization Letter.zip";
      case CommunicationEventTypeCode.PendingNoticeLetter:
        return "Pending Notice Letter.zip";
      case CommunicationEventTypeCode.RejectionNoticeLetter:
        return "Rejection Notice Letter.zip";
      case CommunicationEventTypeCode.ApprovalNoticeLetter:
        return "Approval Notice Letter.zip";
      default:
        throw new Error('Invalid type code');
    }
}

editorValueChange(event: any){
  this.updatedTemplateContent = event;
}

}
