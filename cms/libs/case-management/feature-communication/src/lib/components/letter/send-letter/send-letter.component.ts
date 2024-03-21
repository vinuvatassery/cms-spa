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
import { CommunicationEvents, CommunicationFacade, WorkflowFacade, ContactFacade, CommunicationEventTypeCode, VendorContactsFacade, ScreenType, AddressTypeCode } from '@cms/case-management/domain';
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
  ddlMailCodes: any[] = [];
  selectedMailCode: any;
  isButtonVisible: boolean = true;
  loginUserId!: any;
  selectedTemplateId!: string;
  documentTemplate!: any;

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.getLoggedInUserProfile();
    this.getClientAddressSubscription();
    this.vendorContactFacade.mailCodes$.subscribe((resp: any[]) => {
      this.ddlMailCodes = resp.filter((address: any) => address.activeFlag === "Y");
      if (this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter) {
        if(this.isContinueDraftClicked){
          this.loadClientAndVendorDraftLetterTemplates();
        }else if(this.isNewNotificationClicked){
          this.openNewLetterClicked();
        }else{
          this.loadDropdownLetterTemplates();
        }
      }
    });
    this.vendorContactFacade.loadMailCodes(this.entityId);
    this.isNewLetterClicked =  this.notificationGroup ? true : false;
  }

  getProfileName(): any {
    if (this.communicationLetterTypeCode.includes('VENDOR'))
      return 'Vendor';
    else if (this.communicationLetterTypeCode.includes('CLIENT'))
      return 'Client';
    else
      return this.communicationLetterTypeCode;
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

  handleDdlMailCodesChange(mailCode: any) {
    this.mailingAddress = mailCode;
  }

  private loadClientMailingAddress() {
    this.contactFacade.getClientAddress(this.entityId);
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

    letterRequestFormdata.append('vendorAddressId', this.mailingAddress?.vendorAddressId ?? '');
    letterRequestFormdata.append('documentTemplateId', this.documentTemplate?.documentTemplateId ?? '');

    let draftEsignRequest = this.communicationFacade.prepareClientAndVendorEmailData(letterRequestFormdata, draftTemplate, this.clientAndVendorAttachedFiles);
        this.communicationFacade.saveClientAndVendorNotificationForLater(draftEsignRequest)
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
    if(this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter){
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
    if(this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter){
      this.sendClientAndVendorLetterToPrint(draftTemplate, requestType);
    }else{
      this.entityId = this.workflowFacade.clientId ?? 0;
      this.clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
    }
  }

  private sendClientAndVendorLetterToPrint(draftTemplate: any, requestType: CommunicationEvents){
    let formData = this.communicationFacade.prepareSendLetterData(draftTemplate, this.clientAndVendorAttachedFiles);

    formData.append('vendorAddressId', this.mailingAddress?.vendorAddressId ?? '');

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
    this.communicationFacade.loadLetterTemplates(this.notificationGroup, this.communicationLetterTypeCode)
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
      this.mailingAddress = this.selectedMailCode = this.ddlMailCodes.find((address: any) =>  address.vendorAddressId == event.vendorAddressId);
      this.selectedTemplateContent = event.requestBody;
      this.updatedTemplateContent = event.requestBody;
      this.documentTemplate = {
        'description': event.description,
        'documentTemplateId': event.notificationTemplateId
      };
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
    const isFileExists = this.clientAndVendorAttachedFiles?.some((item: any) => item.name === event?.document?.documentName)
    if(!isFileExists)
    {
    this.clientAndVendorAttachedFiles?.push(event);
    }
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

editorValueChange(event: any){
  this.updatedTemplateContent = event;
}

}
