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
import { Router } from '@angular/router';

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
  @Input() confirmPopupHeader!:string;
  @Input() confirmationModelText!:string;
  @Input() saveForLaterHeadterText!:string;
  @Input() saveForLaterModelText!:string;

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
    private readonly userDataService: UserDataService,
    private readonly router: Router) { }

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
  selectedMailCodeId: any;
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
    this.addSubscriptions();
    if (this.communicationLetterTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter) {
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

  addSubscriptions() {
    this.vendorContactFacade.mailCodes$.subscribe((resp: any[]) => {
      this.ddlMailCodes = resp.filter((address: any) => address.activeFlag === "Y");
      if (this.selectedMailCodeId) {
        this.mailingAddress = this.selectedMailCode = this.ddlMailCodes.find((address: any) =>  address.vendorAddressId == this.selectedMailCodeId);
        this.selectedMailCodeId = null;
        this.ref.detectChanges();
      }
    });
  }

  getProfileName() {
    if (this.communicationLetterTypeCode?.includes('CLIENT')) return 'client';
    else if (this.communicationLetterTypeCode?.includes('VENDOR')) return 'vendor';
    else return this.communicationLetterTypeCode;
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
    this.communicationFacade.loadDraftNotificationRequest(this.entityId)
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

  private loadTemplate(){
    this.loadTemplate$.subscribe((response:any)=>{
      if(response){
        this.loadDropdownLetterTemplates();
      }
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
          this.navigateConditionally();
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
      this.isShowSaveForLaterPopupClicked = false;
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
    let formData = this.communicationFacade.prepareSendLetterData(draftTemplate, attachments, templateTypeCode, this.notificationGroup);
    formData.append('vendorAddressId', this.mailingAddress?.vendorAddressId ?? '');

    this.communicationFacade.sendLetterToPrint(entityId, clientCaseEligibilityId, formData ?? '', requestType.toString() ??'')
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.currentLetterPreviewData = data;
            const fileUrl = window.URL.createObjectURL(data);
            const documentName = this.getFileNameFromTypeCode(CommunicationEventTypeCode.ClientLetter);
            this.ref.detectChanges();
            const downloadLink = document.createElement('a');
            downloadLink.href = fileUrl;
            downloadLink.download = documentName;
            downloadLink.click();
            this.onCloseNewLetterClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Document has been sent to Print');
          }
          this.loaderService.hide();
          this.navigateConditionally();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        },
      });
  }

  navigateConditionally(){
    switch (this.communicationLetterTypeCode) {
      case CommunicationEventTypeCode.PendingNoticeLetter:
        this.router.navigate([`/case-management/cases/`]);
        break;
      case CommunicationEventTypeCode.RejectionNoticeLetter:
      case CommunicationEventTypeCode.ApprovalNoticeLetter:
      case CommunicationEventTypeCode.DisenrollmentNoticeLetter:
        this.router.navigate([`/case-management/cases/case360/${this.entityId}`]);
        break;
    }
  }

  getApiTemplateTypeCode(): string {
    let templateTypeCode = '';
    switch (this.communicationLetterTypeCode) {
      case CommunicationEventTypeCode.PendingNoticeLetter:
        if(this.triggerFrom === WorkflowTypeCode.CaseEligibilityReview){
          templateTypeCode = CommunicationEventTypeCode.CerPendingLetterGenerated;
        }
        else{
          templateTypeCode = CommunicationEventTypeCode.PendingLetterGenerated;
        }
        break;
      case CommunicationEventTypeCode.RejectionNoticeLetter:
        templateTypeCode = CommunicationEventTypeCode.RejectionLetterGenerated;
        break;
      case CommunicationEventTypeCode.ApprovalNoticeLetter:
        if(this.triggerFrom === WorkflowTypeCode.CaseEligibilityReview){
          templateTypeCode = CommunicationEventTypeCode.CerApprovalLetterGenerated;
        }
        else{
          templateTypeCode = CommunicationEventTypeCode.ApprovalLetterGenerated;
        }
        break;
      case CommunicationEventTypeCode.DisenrollmentNoticeLetter:
        templateTypeCode = CommunicationEventTypeCode.DisenrollmentLetterGenerated;
        break;
      case CommunicationEventTypeCode.VendorLetter:
        templateTypeCode = CommunicationEventTypeCode.VendorLetterCreated;
        break;
      case CommunicationEventTypeCode.LetterTypeCode:
        templateTypeCode = CommunicationEventTypeCode.ClientANdVendorLetterSent;
        break;
        case CommunicationEventTypeCode.ApplicationAuthorizationLetter || CommunicationEventTypeCode.ApplicationAuthorizationLetter:
        templateTypeCode = CommunicationEventTypeCode.ApplicationAndCERLetterSent;
        break;
    }
    return templateTypeCode;
  }

  openNewLetterClicked(){
    this.loaderService.show();
    this.communicationFacade.deleteNotificationDraft(this.notificationDraftId)
        .subscribe({
          next: (data: any) =>{
          if (!!data === true) {
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
      this.communicationFacade.loadLetterTemplates(this.notificationGroup, this.templateLoadType, this.communicationLetterTypeCode ?? '')
        .subscribe({
          next: (data: any) => {
            if (data) {
              this.ddlTemplates = data;
              const defaultOption = this.ddlTemplates.find((option: any) => option.description === 'Draft Custom Letter');
              const otherOptions = this.ddlTemplates.filter((option: any) => option.description !== 'Draft Custom Letter');
              this.currentTemplate = this.ddlTemplates.filter((x: any) => x.templateTypeCode === this.communicationLetterTypeCode)
              if (this.currentTemplate.length > 0) {
                this.documentTemplate = { 'description': this.currentTemplate[0].description, 'documentTemplateId': this.currentTemplate[0].documentTemplateId };
                this.handleDdlLetterValueChange(this.currentTemplate[0]);
              }
              if (this.communicationLetterTypeCode === CommunicationEventTypeCode.PendingNoticeLetter
                || this.communicationLetterTypeCode === CommunicationEventTypeCode.RejectionNoticeLetter
                || this.communicationLetterTypeCode === CommunicationEventTypeCode.ApprovalNoticeLetter
                || this.communicationLetterTypeCode === CommunicationEventTypeCode.DisenrollmentNoticeLetter) {
                this.templateDrpDisable = true;
                this.cancelDisplay = false;                
              }
            this.sortDropdownValues(defaultOption, otherOptions);
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

  sortDropdownValues(defaultOption: any, otherOptions: any) {
    // Sort the rest alphabetically and numerically
    const sortedOptions = otherOptions.sort((a: any, b: any) => {
      const isANumeric = !isNaN(Number(a.description.charAt(0))); // Check if option a starts with a number
      const isBNumeric = !isNaN(Number(b.description.charAt(0))); // Check if option b starts with a number

      // If both are alphabetic or both are numeric, sort them using localeCompare
      if ((isANumeric && isBNumeric) || (!isANumeric && !isBNumeric)) {
        return a.description?.localeCompare(b.description);
      }
      // If option a starts with a number and option b does not, put option b first
      else if (isANumeric && !isBNumeric) {
        return 1;
      }
      // If option b starts with a number and option a does not, put option a first
      else {
        return -1;
      }
    });
    // Combine lists
    this.ddlTemplates = [defaultOption, ...sortedOptions];
  }


  handleDdlLetterValueChange(event: any) {
    if ((this.communicationLetterTypeCode === CommunicationEventTypeCode.PendingNoticeLetter
      || this.communicationLetterTypeCode === CommunicationEventTypeCode.RejectionNoticeLetter
      || this.communicationLetterTypeCode === CommunicationEventTypeCode.ApprovalNoticeLetter
      || this.communicationLetterTypeCode === CommunicationEventTypeCode.DisenrollmentNoticeLetter)
      && (this.triggerFrom === WorkflowTypeCode.NewCase || this.triggerFrom === WorkflowTypeCode.CaseEligibilityReview)) {
        this.communicationFacade.loadDraftNotificationRequest(this.entityId).subscribe((response:any)=>{
          if(response.length>0){
            this.setDraftedTemplate(response[0]);
            this.ref.detectChanges();
          }
          else
          {
            this.loadNewTemplate(event);
          }
        });
    } 
    else{
      this.loadNewTemplate(event);
    }   

  }

  loadNewTemplate(event:any){
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
      this.setDraftedTemplate(event);
    }
  }

  private setDraftedTemplate(event: any) { 
    if (event.subTypeCode === this.communicationLetterTypeCode) {
      this.selectedTemplateId = event.notificationTemplateId;
      this.isOpenLetterTemplate = true;
      this.selectedTemplate = event;
      this.selectedMailCodeId = event.vendorAddressId;
      this.loadMailingAddress();
      this.selectedTemplateContent = event.requestBody;
      this.updatedTemplateContent = event.requestBody;
      this.documentTemplate = {
        'description': event.description,
        'documentTemplateId': event.notificationTemplateId
      };
    }
    else
    {
      if(this.selectedTemplate !== undefined)
      this.selectedTemplate.notificationDraftId = event.notificationDraftId;
    }
    this.ref.detectChanges();
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
  let isFileExists = false; 
  if (this.communicationLetterTypeCode == CommunicationEventTypeCode.ApplicationAuthorizationLetter || this.communicationLetterTypeCode == CommunicationEventTypeCode.CerAuthorizationLetter)
  {
    if(event.length > 0){
      this.cerEmailAttachedFiles = event;
    }else{
      if(event.documentTemplateId){
        isFileExists = this.cerEmailAttachedFiles?.some((item: any) => item.name === event?.description);
        if(!isFileExists || isFileExists === undefined){
          this.cerEmailAttachedFiles?.push(event);
        }
      }
      if(event.clientDocumentId){
        isFileExists = this.cerEmailAttachedFiles?.some((item: any) => item.name === event?.documentName);
        if(!isFileExists || isFileExists === undefined){
          this.cerEmailAttachedFiles?.push(event);
        }
      }
    }
    this.attachmentCount = this.cerEmailAttachedFiles?.length;
  }else{
    if(event.length > 0){
      this.clientAndVendorAttachedFiles = event;
    }else{
      if(event.documentTemplateId){
        isFileExists = this.clientAndVendorAttachedFiles?.some((item: any) => item.name === event?.description);
        if(!isFileExists || isFileExists === undefined){
          this.clientAndVendorAttachedFiles?.push(event);
        }
      }
      if(event.clientDocumentId){
        isFileExists = this.clientAndVendorAttachedFiles?.some((item: any) => item.name === event?.documentName);
        if(!isFileExists || isFileExists === undefined){
          this.clientAndVendorAttachedFiles?.push(event);
        }
      }
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
      case CommunicationEventTypeCode.DisenrollmentNoticeLetter:
        return "Disenrollment Notice Letter.zip";
      default:
        throw new Error('Invalid type code');
    }
  }

editorValueChange(event: any){
  this.updatedTemplateContent = event;
}

}
