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
    private readonly vendorContactFacade: VendorContactsFacade) { }

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

  /** Lifecycle hooks **/
  ngOnInit(): void {
    if (this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter) {
      this.loadMailCodes();
    }
    else {
      this.vendorContactFacade.loadMailCodes(this.vendorId);
    }
    this.isNewLetterClicked =  this.data ? true : false;
    this.loadDropdownLetterTemplates();
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
    this.onCloseNewLetterClicked();
    this.saveDraftLetterTemplate(this.selectedTemplate);
  }

  onSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = true;
    this.isShowSaveForLaterPopupClicked = true;
    this.emailEditorValueEvent.emit(this.currentLetterData);
    this.selectedTemplate.templateContent = this.currentLetterData.templateContent;
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
    this.communicationFacade.loadEmailTemplates(this.communicationLetterTypeCode, channelTypeCode)
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
    this.isOpenLetterTemplate=true;
    this.selectedTemplate = event;
    this.handleLetterEditor(event);
    this.ref.detectChanges();
    this.openDdlLetterEvent.emit();
    this.loadMailingAddress();
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
    if(this.screenName == ScreenType.Case360PageLetter){
      this.loadClientMailingAddress();
    }else{
    this.vendorContactFacade.loadMailCodes(this.vendorId);
    }
  }
  else
     this.contactFacade.loadMailingAddress(this.clientId);
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
