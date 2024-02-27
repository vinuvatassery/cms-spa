/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Email } from '../entities/email';
/** Data services **/
import { EmailDataService } from '../infrastructure/email.data.service';
import { CommunicationEvents } from '../enums/communication-event.enum';
import { LoggingService} from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class CommunicationFacade {
  /** Private properties **/
  private emailsSubject = new BehaviorSubject<Email[]>([]);
  private clientVariablesSubject = new BehaviorSubject<any>([]);
  private ddlEditorVariablesSubject = new BehaviorSubject<any>([]);
  private ddlLetterTemplatesSubject = new BehaviorSubject<any>([]);
  private ddlEmailsSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  clientVariables$ = this.clientVariablesSubject.asObservable();
  emails$ = this.emailsSubject.asObservable();
  ddlEditorVariables$ = this.ddlEditorVariablesSubject.asObservable();
  ddlLetterTemplates$ = this.ddlLetterTemplatesSubject.asObservable();
  ddlEmails$ = this.ddlEmailsSubject.asObservable();

  /** Constructor**/
  constructor(private readonly emailDataService: EmailDataService, private readonly loggingService: LoggingService,) {}

  /** Public methods **/
  loadEmails(): void {
    this.emailDataService.loadEmails().subscribe({
      next: (emailsResponse) => {
        this.emailsSubject.next(emailsResponse);
      },
      error: (err: any) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadDdlLetterTemplates(): void {
    this.emailDataService.loadDdlLetterTemplates().subscribe({
      next: (ddlLetterTemplatesResponse) => {
        this.ddlLetterTemplatesSubject.next(ddlLetterTemplatesResponse);
      },
      error: (err: any) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadDdlEmails() {
    this.emailDataService.loadDdlEmails().subscribe({
      next: (ddlEmailsResponse) => {
        this.ddlEmailsSubject.next(ddlEmailsResponse);
      },
      error: (err: any) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadClientVariables() {
    this.emailDataService.loadClientVariables().subscribe({
      next: (clientVariablesResponse) => {
        this.clientVariablesSubject.next(clientVariablesResponse);
      },
      error: (err: any) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadDdlEditorVariables() {
    this.emailDataService.loadDdlEditorVariables().subscribe({
      next: (ddlEditorVariablesResponse) => {
        this.ddlEditorVariablesSubject.next(ddlEditorVariablesResponse);
      },
      error: (err: any) => {
        this.loggingService.logException(err);
      },
    });
  }

  loadEmailTemplates(groupCode: string, categoryCode: string) {
    return this.emailDataService.loadEmailTemplates(
      groupCode, categoryCode
    );
  }

  loadLetterTemplates(groupCode: string, categoryCode: string) {
    return this.emailDataService.loadEmailTemplates(
      groupCode, categoryCode
    );
  }

  loadCERAuthorizationEmailEditVariables(lovType: string) {
    return this.emailDataService.loadCERAuthorizationEmailVariables(lovType);
  }

  generateTextTemplate(clientId: number, clientCaseEligibilityId: string, selectedTemplate: any, requestType: string, vendorId: string) {
    return this.emailDataService.replaceAndGenerateTextTemplate(clientId, clientCaseEligibilityId, selectedTemplate, requestType, vendorId);
  }

  loadAttachmentPreview(clientId: number, clientCaseEligibilityId: string, templateId: any) {
    return this.emailDataService.loadAttachmentPreview(clientId, clientCaseEligibilityId, templateId);
  }

  sendLetterToPrint(clientId: number, clientCaseEligibilityId: string, selectedTemplate: any, requestType: string, vendorId: string) {
    return this.emailDataService.sendLetterToPrint(clientId, clientCaseEligibilityId, selectedTemplate, requestType, vendorId);
  }

  saveForLaterEmailTemplate(draftTemplate: any){
    return this.emailDataService.saveEmailForLater(draftTemplate);
  }

  getClientDocumentsViewDownload(clientDocumentId: string) {
    return this.emailDataService.getClientDocumentsViewDownload(clientDocumentId);
  }

  loadCERAuthorizationTemplateAttachment(typeCode: string){
    return this.emailDataService.getTemplateAttachment(typeCode);
  }

  loadCERAuthorizationDraftAttachment(esignRequestId: string){
    return this.emailDataService.getDraftTemplateAttachment(esignRequestId);
  }

  getCCList(clientId: number, loginUserId: string){
    return this.emailDataService.getCCEmailListForCER(clientId, loginUserId);
  }

  loadLetterAttachment(documentTemplateId: string, typeCode: string){
    return this.emailDataService.getLetterAttachment(documentTemplateId, typeCode);
}

preparePreviewModelData(emailData: any) {
  const formData = new FormData();
      formData.append('documentTemplateId', emailData?.documentTemplateId ?? '');
      formData.append('typeCode', emailData?.typeCode ?? '');
      formData.append('subtypeCode', CommunicationEvents?.Email ?? '');
      formData.append('channelTypeCode', CommunicationEvents?.Email ?? '');
      formData.append('description', emailData?.description ?? '');
      formData.append('templateContent', emailData?.templateContent ?? '');
      return formData;
}

prepareSendLetterData(draftTemplate: any, clientAndVendorAttachedFiles: any[]) {
  const isSaveForLater = "true";
  const formData = new FormData();
  formData.append('documentTemplateId', draftTemplate?.documentTemplateId ?? '');
  formData.append('systemCode', draftTemplate?.systemCode ?? '');
  formData.append('typeCode', draftTemplate?.typeCode ?? '');
  formData.append('subtypeCode', draftTemplate?.subtypeCode ?? '');
  formData.append('channelTypeCode', draftTemplate?.channelTypeCode ?? '');
  formData.append('languageCode', draftTemplate?.languageCode ?? '');
  formData.append('description', draftTemplate?.description ?? '');
  formData.append('templateContent', draftTemplate?.templateContent ?? '');
  formData.append('isSaveForLater', isSaveForLater??'');
  let i = 0;
  clientAndVendorAttachedFiles.forEach((file) => { 
    if(file.rawFile == undefined || file.rawFile == null){
      formData.append('savedAttachmentId', file.document.documentTemplateId);
      i++;
    }else{
      formData.append('fileData', file.rawFile); 
    }
});  
return formData;
}

prepareClientAndVendorFormData(selectedToEmail: any, clientCaseEligibilityId: any, clientId: any, emailSubject: string, loginUserId: any, selectedCCEmail: any) {
  const formData = new FormData();
    formData.append('toEmailAddress', selectedToEmail ?? '');
    formData.append('clientCaseEligibilityId', clientCaseEligibilityId ?? '');
    formData.append('clientId', clientId ?? '');
    formData.append('requestSubject', emailSubject ?? ''); 
    formData.append('loginUserId', loginUserId ?? '');
    formData.append('cCEmail', selectedCCEmail ?? '');  
    return formData;
}

prepareClientAndVendorEmailData(formData: FormData, emailData: any, clientAndVendorEmailAttachedFiles: any[], vendorId: string) {
    formData.append('documentTemplateId', emailData?.documentTemplateId ?? '');
    formData.append('vendorId', vendorId ?? '');
    formData.append('description', emailData?.description ?? '');
    formData.append('typeCode', emailData?.typeCode ?? '');
    formData.append('requestBody', emailData?.templateContent ?? '');
    let i = 0;
    clientAndVendorEmailAttachedFiles.forEach((file) => { 
      if(file.rawFile == undefined || file.rawFile == null){
        formData.append('AttachmentDetails['+i+'][fileName]', file.document.description == undefined ? file.document.attachmentName : file.document.description);
        formData.append('AttachmentDetails['+i+'][filePath]', file.document.templatePath == undefined ? file.document.path : file.document.templatePath);
        formData.append('AttachmentDetails['+i+'][typeCode]', file.document.typeCode == undefined ? file.document.attachmentTypeCode : file.document.typeCode);
      i++;
      }else{
        formData.append('attachments', file.rawFile); 
      }
    });
    return formData;
}

initiateSendemailRequest(formData: FormData, selectedTemplate: any) {
    return this.emailDataService.sendClientAndVendorEmail(formData);
}

saveClientAndVendorNotificationForLater(formData: FormData) {
  return this.emailDataService.saveEmailNotificationForLater(formData);
}

updateSavedClientandVendorEmailTemplate(formData: FormData) {
  return this.emailDataService.updateEmailNotificationForLater(formData);
}

loadDraftNotificationRequest(entityId: string) {
  return this.emailDataService.getDraftNotification(entityId);
}

loadTemplateById(notificationTemplateId: string) {
  return this.emailDataService.loadEmailTemplateById(notificationTemplateId);
}
}
