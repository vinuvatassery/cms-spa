/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Email } from '../entities/email';
/** Data services **/
import { EmailDataService } from '../infrastructure/email.data.service';
import { CommunicationEvents } from '../enums/communication-event.enum';
import { LoggingService } from '@cms/shared/util-core';
import { SmsNotification } from '../entities/sms-notification';
import { DocumentDataService } from '../infrastructure/document.data.service';

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
  constructor(private readonly emailDataService: EmailDataService, private readonly loggingService: LoggingService,
    private readonly documentDataService: DocumentDataService) { }

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

  generateTextTemplate(entityId: string, clientCaseEligibilityId: string, selectedTemplate: any, requestType: string) {
    return this.emailDataService.replaceAndGenerateTextTemplate(entityId, clientCaseEligibilityId, selectedTemplate, requestType);
  }

  loadAttachmentPreview(clientId: number, clientCaseEligibilityId: string, templateId: any) {
    return this.emailDataService.loadAttachmentPreview(clientId, clientCaseEligibilityId, templateId);
  }

  sendLetterToPrint(entityId: string, clientCaseEligibilityId: string, selectedTemplate: any, requestType: string) {
    return this.emailDataService.sendLetterToPrint(entityId, clientCaseEligibilityId, selectedTemplate, requestType);
  }

  saveForLaterEmailTemplate(draftTemplate: any) {
    return this.emailDataService.saveEmailForLater(draftTemplate);
  }

  getClientDocumentsViewDownload(clientDocumentId: string) {
    return this.emailDataService.getClientDocumentsViewDownload(clientDocumentId);
  }

  loadCERAuthorizationTemplateAttachment(typeCode: string) {
    return this.emailDataService.getTemplateAttachment(typeCode);
  }

  loadCERAuthorizationDraftAttachment(esignRequestId: string) {
    return this.emailDataService.getDraftTemplateAttachment(esignRequestId);
  }

  getCCList(clientId: number, loginUserId: string) {
    return this.emailDataService.getCCEmailListForCER(clientId, loginUserId);
  }

  loadLetterAttachment(documentTemplateId: string, typeCode: string) {
    return this.emailDataService.getLetterAttachment(documentTemplateId, typeCode);
  }

  prepareClientAndVendorLetterFormData(entityId: string, loginUserId: any) {
    const formData = new FormData();
    formData.append('entityId', entityId ?? '');
    formData.append('loginUserId', loginUserId ?? '');
    return formData;
  }

  preparePreviewModelData(emailData: any) {
    const formData = new FormData();
    formData.append('notificationTemplateId', emailData?.notificationTemplateId ?? '');
    formData.append('typeCode', emailData?.typeCode ?? '');
    formData.append('subtypeCode', CommunicationEvents?.Email ?? '');
    formData.append('channelTypeCode', CommunicationEvents?.Email ?? '');
    formData.append('description', emailData?.description ?? '');
    formData.append('templateContent', emailData?.templateContent ?? '');
    return formData;
  }

  prepareSendLetterData(draftTemplate: any, clientAndVendorAttachedFiles: any[]) {
    const formData = new FormData();
    formData.append('notificationTemplateId', draftTemplate?.notificationTemplateId ?? '');
    formData.append('typeCode', draftTemplate?.typeCode ?? '');
    formData.append('languageCode', draftTemplate?.languageCode ?? '');
    formData.append('description', draftTemplate?.description ?? '');
    formData.append('templateContent', draftTemplate?.templateContent ?? '');
    formData.append('notifcationDraftId', draftTemplate?.notifcationDraftId ?? '');
    if (clientAndVendorAttachedFiles[0]?.length > 0){
    let i = 0;
    clientAndVendorAttachedFiles[0].forEach((file: any) => {
      if (file.rawFile == undefined || file.rawFile == null) {
        formData.append('systemAttachments[' + i + '][fileName]', file.name ?? file?.document?.fileName);
        formData.append('systemAttachments[' + i + '][filePath]', this.getDocumentFilePath(file.document));
        formData.append('systemAttachments[' + i + '][typeCode]', file.typeCode ?? file?.document?.documentTypeCode);
        formData.append('systemAttachments[' + i + '][clientDocumentId]', file?.document?.clientDocumentId ?? '');
        formData.append('systemAttachments[' + i + '][documentTemplateId]', file.typeCode !== 'CLIENT_DEFAULT' ? file?.document?.documentTemplateId : '');
        i++;
      } else {
        formData.append('uploadedAttachments', file.rawFile);
      }
    });
  }
    return formData;
  }

  createFormDataForEmail(data: { subject: string, toEmail: string, ccEmail: any[], bccEmail: string, eligibilityId: string, entity: string, entityId: string, caseId: string, userId: string, emailData: any, clientAndVendorEmailAttachedFiles: any[] }) {
    const formData = new FormData();
    formData.append('requestSubject', data?.subject ?? '');
    formData.append('loginUserId', data?.userId ?? '');
    formData.append('clientCaseId', data?.caseId ?? '');
    formData.append('entity', data?.entity ?? '');
    formData.append('entityId', data?.entityId ?? '');
    formData.append('clientCaseEligibilityId', data?.eligibilityId ?? '');
    formData.append('documentTemplateId', data?.emailData?.documentTemplateId ?? '');
    this.addCommaSeperatedEmailToFormData(formData, data?.toEmail, 'to');
    formData.append('bcc',JSON.stringify(data?.bccEmail) ?? JSON.stringify('')); 
    if(data?.ccEmail){
      let i = 0;
      data?.ccEmail.forEach((item: any) =>{
        formData.append('cc[' + i + '][email]', item.email ?? '');
        formData.append('cc[' + i + '][isDefault]', item.isDefault ?? '');
        i++;
      });
    }
    if (data?.emailData) {
      formData.append('notificationTemplateId', data?.emailData?.notificationTemplateId ?? '');
      formData.append('description', data?.emailData?.description ?? '');
      formData.append('typeCode', data?.emailData?.typeCode ?? '');
      formData.append('requestBody', data?.emailData?.templateContent ?? '');
      formData.append('notifcationDraftId', data?.emailData?.notifcationDraftId ?? '');
    }
    if (data?.clientAndVendorEmailAttachedFiles[0]?.length > 0) {
      let i = 0;
      data?.clientAndVendorEmailAttachedFiles[0].forEach((file: any) => {
        if (file.rawFile == undefined || file.rawFile == null) {
          formData.append('systemAttachments[' + i + '][fileName]', file.name ?? file.document.fileName);
          formData.append('systemAttachments[' + i + '][filePath]', this.getDocumentFilePath(file.document));
          formData.append('systemAttachments[' + i + '][typeCode]', file.typeCode ?? file?.document?.documentTypeCode);
          formData.append('systemAttachments[' + i + '][clientDocumentId]', file.document.clientDocumentId ?? '');
          formData.append('systemAttachments[' + i + '][documentTemplateId]', file.typeCode !== 'CLIENT_DEFAULT' ? file.document.documentTemplateId : '');
          i++;
        } else {
          formData.append('uploadedAttachments', file.rawFile);
        }
      });
    }
    return formData;
  }

  addCommaSeperatedEmailToFormData(formData: FormData, emailAddress: any, fieldName: string) {
    if (emailAddress?.length > 0) {
      for (let email of emailAddress) {
        formData.append(fieldName, email);
      }
    }
  }

  prepareClientAndVendorFormData(selectedToEmail: any, clientCaseEligibilityId: any, entityId: any, clientCaseId: string, emailSubject: string, loginUserId: any, selectedCCEmail: any) {
    const formData = new FormData();
    formData.append('toEmailAddress', selectedToEmail ?? '');
    formData.append('clientCaseEligibilityId', clientCaseEligibilityId ?? '');
    formData.append('entityId', entityId ?? '');
    formData.append('requestSubject', emailSubject ?? '');
    formData.append('loginUserId', loginUserId ?? '');
    formData.append('cCEmail', selectedCCEmail ?? '');
    formData.append('clientCaseId', clientCaseId ?? '');
    return formData;
  }

  prepareClientAndVendorEmailData(formData: FormData, emailData: any, clientAndVendorEmailAttachedFiles: any[]) {
    formData.append('notificationTemplateId', emailData?.notificationTemplateId ?? '');
    formData.append('documentTemplateId', emailData?.documentTemplateId ?? '');
    formData.append('description', emailData?.description ?? '');
    formData.append('typeCode', emailData?.typeCode ?? '');
    formData.append('entity', emailData?.typeCode ?? '');
    formData.append('requestBody', emailData?.templateContent ?? '');
    formData.append('notifcationDraftId', emailData?.notifcationDraftId ?? '');
    if(clientAndVendorEmailAttachedFiles[0]?.length > 0){
    let i = 0;
    clientAndVendorEmailAttachedFiles[0].forEach((file: any) => {
      if (file.rawFile == undefined || file.rawFile == null) {
        formData.append('systemAttachments[' + i + '][fileName]', file.name ?? file.document.fileName);
        formData.append('systemAttachments[' + i + '][filePath]', this.getDocumentFilePath(file.document));
        formData.append('systemAttachments[' + i + '][typeCode]', file.typeCode ?? file?.document?.documentTypeCode);
        formData.append('systemAttachments[' + i + '][clientDocumentId]', file.document.clientDocumentId ?? '');
        formData.append('systemAttachments[' + i + '][documentTemplateId]', file.typeCode !== 'CLIENT_DEFAULT' ? file.document.documentTemplateId : '');
        i++;
      } else {
        formData.append('uploadedAttachments', file.rawFile);
      }
    });
  }
    return formData;
  }

  getDocumentFilePath(document: any){
    if(document.templatePath){
      return document.templatePath;
    }else if(document.filePath){
      return document.filePath;
    }else{
      return document.documentPath;
    }
  }

  prepareClientAndVendorSmsData(formData: FormData, draftTemplate: any, messageRecipient: any, arg2: undefined[]) {
    formData.append('notificationTemplateId', draftTemplate?.notificationTemplateId ?? '');
    formData.append('description', draftTemplate?.description ?? '');
    formData.append('typeCode', draftTemplate?.typeCode ?? '');
    formData.append('notifcationDraftId', draftTemplate?.notifcationDraftId ?? '');
    formData.append('recepients', messageRecipient?.phoneNbr ?? '');
    formData.append('entity', draftTemplate?.typeCode ?? '');
    let i = 0;
    draftTemplate.messages.forEach((msg: any) => {
      formData.append('messages[' + i + ']', msg);
      i++;
    });
    return formData;
  }

  initiateSendEmailRequest(formData: FormData) {
    return this.emailDataService.sendClientAndVendorEmail(formData);
  }

  saveClientAndVendorNotificationForLater(formData: FormData) {
    return this.emailDataService.saveEmailNotificationForLater(formData);
  }

  updateSavedClientandVendorEmailTemplate(formData: FormData) {
    return this.emailDataService.saveEmailNotificationForLater(formData);
  }

  loadDraftNotificationRequest(entityId: string, typeCode: string) {
    return this.emailDataService.getDraftNotification(entityId, typeCode);
  }

  loadTemplateById(notificationTemplateId: string) {
    return this.emailDataService.loadEmailTemplateById(notificationTemplateId);
  }

  loadClientAndVendorDefaultAttachments(templateId: string) {
    return this.emailDataService.loadClientVendorDefaultAttachmentById(templateId);
  }

  deleteNotificationDraft(notificationDraftId: any) {
    return this.emailDataService.deleteNotificationDraft(notificationDraftId);
  }

  sendSms(smsNotification: SmsNotification) {
    return this.emailDataService.sendSms(smsNotification);
  }

  loadNotificationTemplates(groupCode: string, categoryCode: string) {
    return this.emailDataService.loadEmailTemplates(
      groupCode, categoryCode
    );
  }

  loadClientAttachments(clientId: any) {
    return this.documentDataService.getDocumentsByClientCaseEligibilityId(
      clientId, 0, 1000, '', 'asc', null, null
    );
  }

  loadFormsAndDocuments(typeCode: string) {
    return this.emailDataService.loadFormsAndDocuments(typeCode);
  }
}
