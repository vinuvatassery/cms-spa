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
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommunicationFacade {
  /** Private properties **/
  private emailsSubject = new BehaviorSubject<Email[]>([]);
  private clientVariablesSubject = new BehaviorSubject<any>([]);
  private ddlEditorVariablesSubject = new BehaviorSubject<any>([]);
  private ddlLetterTemplatesSubject = new BehaviorSubject<any>([]);
  private ddlEmailsSubject = new BehaviorSubject<any>([]);
  loadTemplateSubject = new Subject<any>();

  /** Public properties **/
  clientVariables$ = this.clientVariablesSubject.asObservable();
  emails$ = this.emailsSubject.asObservable();
  ddlEditorVariables$ = this.ddlEditorVariablesSubject.asObservable();
  ddlLetterTemplates$ = this.ddlLetterTemplatesSubject.asObservable();
  ddlEmails$ = this.ddlEmailsSubject.asObservable();
  loadTemplate$ = this.loadTemplateSubject.asObservable();

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

  loadTemplates(groupCode: string, categoryCode: string, templateTypeCode: string) {
    return this.emailDataService.loadEmailTemplates(
      groupCode, categoryCode, templateTypeCode
    );
  }

  loadCERAuthorizationEmailEditVariables(lovType: string) {
    return this.emailDataService.loadCERAuthorizationEmailVariables(lovType);
  }

  generateTextTemplate(entityId: string, clientCaseEligibilityId: string, selectedTemplate: any, requestType: string) {
    return this.emailDataService.replaceAndGenerateTextTemplate(entityId, clientCaseEligibilityId, selectedTemplate, requestType);
  }

  loadAttachmentPreview(attachmentPreviewDto: FormData) {
    return this.emailDataService.loadAttachmentPreview(attachmentPreviewDto);
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

  preparePreviewModelData(emailData: any, entityType: string, mailCode: string) {
    const formData = new FormData();
    formData.append('notificationTemplateId', emailData?.notificationTemplateId ?? '');
    formData.append('typeCode', emailData?.subtypeCode);
    formData.append('subtypeCode', CommunicationEvents?.Email ?? '');
    formData.append('channelTypeCode', CommunicationEvents?.Email ?? '');
    formData.append('description', emailData?.description ?? '');
    formData.append('templateContent', emailData?.templateContent ?? '');
    formData.append('entityType', entityType ?? '');
    formData.append('mailCode', mailCode ?? '');
    return formData;
  }

  prepareSendLetterData(draftTemplate: any, clientAndVendorAttachedFiles: any[],templateTypeCode:any,eventGroupCode: string, notificationGroup:any,entityId: any, entityType: any) {
    const formData = new FormData();
    formData.append('templateTypeCode',this.nullCheck(templateTypeCode));
    formData.append('eventGroupCode',this.nullCheck(eventGroupCode));
    formData.append('entityTypeCode',this.nullCheck(notificationGroup));
    formData.append('notificationTemplateId', this.nullCheck(draftTemplate?.notificationTemplateId));
    formData.append('typeCode', this.nullCheck(draftTemplate?.subtypeCode));
    formData.append('languageCode',this.nullCheck( draftTemplate?.languageCode));
    formData.append('description',this.nullCheck(draftTemplate?.description));
    formData.append('templateContent', this.nullCheck(draftTemplate?.templateContent));
    formData.append('notifcationDraftId', this.nullCheck(draftTemplate?.notificationDraftId));
    formData.append('entityId', entityId);
    formData.append('entityType', entityType);
    this.prepareNotificationAttachment(clientAndVendorAttachedFiles, formData);
    this.prepareDraftNoticeAttachment(clientAndVendorAttachedFiles, draftTemplate, formData);
    return formData;
  }

  prepareDraftNoticeAttachment(clientAndVendorAttachedFiles: any[], draftTemplate: any, formData: FormData) {
    if(clientAndVendorAttachedFiles?.length <= 0 && draftTemplate?.notificationRequestAttachments?.length > 0){
      let i = 0;
      draftTemplate?.notificationRequestAttachments.forEach((file: any) => {
        if (file.rawFile == undefined || file.rawFile == null) {
          formData.append('systemAttachments[' + i + '][fileName]', file.fileName ?? '');
          formData.append('systemAttachments[' + i + '][filePath]', file.filePath ?? '');
          formData.append('systemAttachments[' + i + '][typeCode]', file.typeCode ?? file?.document?.documentTypeCode);
          i++;
        }
    });
  }
  }

  prepareNotificationAttachment(clientAndVendorAttachedFiles: any[], formData: FormData) {
    if (clientAndVendorAttachedFiles?.length > 0){
      let i = 0;
      clientAndVendorAttachedFiles.forEach((file: any) => {
        if (file.rawFile == undefined || file.rawFile == null) {
          formData.append('systemAttachments[' + i + '][fileSize]', file.size);
          formData.append('systemAttachments[' + i + '][fileName]', file.name ?? file?.document?.fileName);
          formData.append('systemAttachments[' + i + '][filePath]', this.getDocumentFilePath(file.document));
          let typeCode = this.getTypeCode(file);
          formData.append('systemAttachments[' + i + '][typeCode]',typeCode);
          formData.append('systemAttachments[' + i + '][clientDocumentId]', file?.document?.clientDocumentId ?? '');
          formData.append('systemAttachments[' + i + '][documentTemplateId]', file.typeCode !== 'CLIENT_DEFAULT' ? file?.document?.documentTemplateId : '');
          i++;
        } else {
          formData.append('uploadedAttachments', file.rawFile);
        }
      });
    }
  }

  getTypeCode(file: any) {
    let typeCode = '';
    if(file.typeCode == undefined){
    typeCode =  file?.document?.documentTypeCode
    }
    else if (file.typeCode != undefined && file?.document?.documentTypeCode != undefined){
      typeCode = file.typeCode
    }
    return typeCode;
  }

  createFormDataForEmail(data: {templateTypeCode:string, eventGroupCode: string, subject: string, toEmail: string, ccEmail: any[], bccEmail: any[], eligibilityId: string, entity: string, entityId: string, caseId: string, userId: string, emailData: any, clientAndVendorEmailAttachedFiles: any[]}) {
    const formData = new FormData();
    formData.append('templateTypeCode', this.nullCheck(data?.templateTypeCode));
    formData.append('eventGroupCode', this.nullCheck(data?.eventGroupCode));
    formData.append('requestSubject', this.nullCheck(data?.subject));
    formData.append('loginUserId',this.nullCheck(data?.userId));
    formData.append('clientCaseId', this.nullCheck(data?.caseId));
    formData.append('entity', this.nullCheck(data?.entity));
    formData.append('entityId', this.nullCheck(data?.entityId));
    formData.append('clientCaseEligibilityId',this.nullCheck(data?.eligibilityId));
    formData.append('documentTemplateId', this.nullCheck(data?.emailData?.documentTemplateId));
    this.addCommaSeperatedEmailToFormData(formData, data?.toEmail, 'to');
    if(data?.bccEmail){
      let i = 0;
      data?.bccEmail.forEach((item: any) =>{
        formData.append('bcc[' + i + '][email]', this.nullCheck(item.email));
        formData.append('bcc[' + i + '][isDefault]', this.nullCheck(item.isDefault));
        i++;
      });
    }
    if(data?.ccEmail){
      let i = 0;
      data?.ccEmail.forEach((item: any) =>{
        formData.append('cc[' + i + '][email]', this.nullCheck(item.email));
        formData.append('cc[' + i + '][isDefault]', this.nullCheck(item.isDefault));
        i++;
      });
    }
    if (data?.emailData) {
      let subTypeCode = data?.emailData?.subtypeCode?? data?.emailData?.subTypeCode
      formData.append('notificationTemplateId', this.nullCheck(data?.emailData?.notificationTemplateId));
      formData.append('typeCode', data?.emailData?.typeCode);
      formData.append('subTypeCode', this.nullCheck(subTypeCode));
      formData.append('requestBody', this.nullCheck(data?.emailData?.templateContent));
      formData.append('notificationDraftId',this.nullCheck(data?.emailData?.notificationDraftId));
    }
    if (data?.clientAndVendorEmailAttachedFiles?.length > 0) {
      let i = 0;
      data?.clientAndVendorEmailAttachedFiles.forEach((file: any) => {
        if (file.rawFile == undefined || file.rawFile == null) {
          formData.append('systemAttachments[' + i + '][fileName]', file.name ?? file?.document?.fileName);
          formData.append('systemAttachments[' + i + '][filePath]', this.getDocumentFilePath(file?.document));
          formData.append('systemAttachments[' + i + '][typeCode]',this.nullCheck(file.typeCode));
          formData.append('systemAttachments[' + i + '][clientDocumentId]',this.nullCheck(file?.document?.clientDocumentId ));
          formData.append('systemAttachments[' + i + '][documentTemplateId]', file?.typeCode !== 'CLIENT_DEFAULT' ? file?.document?.documentTemplateId : '');
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

  prepareClientAndVendorLetterData(formData: FormData, emailData: any, clientAndVendorEmailAttachedFiles: any[], entityType: string) {
    let subTypeCode = emailData?.subTypeCode ?? emailData?.subtypeCode;
    formData.append('notificationTemplateId', this.nullCheck(emailData?.notificationTemplateId));
    formData.append('documentTemplateId', this.nullCheck(emailData?.documentTemplateId));
    formData.append('description', this.nullCheck(emailData?.description));
    formData.append('typeCode', emailData?.typeCode);
    formData.append('subTypeCode',subTypeCode);
    formData.append('requestBody',this.nullCheck(emailData?.templateContent));
    formData.append('notificationDraftId', this.nullCheck(emailData?.notificationDraftId));
    formData.append('entity',this.nullCheck(entityType));
    if(clientAndVendorEmailAttachedFiles?.length > 0){
    let i = 0;
    clientAndVendorEmailAttachedFiles.forEach((file: any) => {
      if (file.rawFile == undefined || file.rawFile == null) {
        formData.append('systemAttachments[' + i + '][fileName]', file.name ?? file.document.fileName);
        formData.append('systemAttachments[' + i + '][filePath]', this.getDocumentFilePath(file.document));
        formData.append('systemAttachments[' + i + '][typeCode]', file.typeCode ?? file?.document?.documentTypeCode);
        formData.append('systemAttachments[' + i + '][clientDocumentId]', this.nullCheck(file.document.clientDocumentId));
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
    if(document?.templatePath){
      return document.templatePath;
    }else if(document?.filePath){
      return document.filePath;
    }else{
      return document?.documentPath;
    }
  }

  prepareClientAndVendorSmsData(formData: FormData, draftTemplate: any, messageRecipient: any, arg2: undefined[]) {
    let subTypeCode = draftTemplate?.subTypeCode ?? draftTemplate?.subtypeCode;
    formData.append('notificationTemplateId', draftTemplate?.notificationTemplateId ?? '');
    formData.append('description', draftTemplate?.description ?? '');
    formData.append('typeCode', draftTemplate?.typeCode ?? '');
    formData.append('subTypeCode', subTypeCode ?? '');
    formData.append('notifcationDraftId', draftTemplate?.notifcationDraftId ?? '');
    formData.append('recepients', messageRecipient?.phoneNbr ?? ''); 
    formData.append('formattedPhoneNbr',messageRecipient?.formattedPhoneNbr ?? '')
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

  loadDraftNotificationRequest(entityId: string,entityType:string,typeCode:string, subTypeCode: string | null) {
    return this.emailDataService.getDraftNotification(entityId,entityType,typeCode, subTypeCode);
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

  loadClientAttachments(clientId: any, typeCode: any) {
    const payload ={
      clientId : clientId,
      skipcount : 0,
      maxResultCount: 1000,
      sort : '',
      sortType : 'asc',
      filter :null,
      columnName : null,
      typeCode : typeCode
    }

    return this.documentDataService.getDocumentsByClientCaseEligibilityId(
      payload
    );
  }

  loadFormsAndDocuments(typeCode: string) {
    return this.emailDataService.loadFormsAndDocuments(typeCode);
  }

  saveEsignLetterForLater(formData: FormData) {
    return this.emailDataService.saveEmailNotificationForLater(formData);
  }

  prepareEsignLetterData(draftTemplate: any, entityId: any, loginUserId: string, cerEmailAttachedFiles: any[], entityType: string) {
    const formData = new FormData();
    let subTypeCode = draftTemplate?.subTypeCode ?? draftTemplate?.subtypeCode;
    formData.append('documentTemplateId', this.nullCheck(draftTemplate?.documentTemplateId ));
    formData.append('typeCode',this.nullCheck(draftTemplate?.typeCode));
    formData.append('entityId',this.nullCheck(entityId));
    formData.append('entity', this.nullCheck(entityType));
    formData.append('subTypeCode',subTypeCode)
    formData.append('loginUserId', this.nullCheck(loginUserId));
    formData.append('description', this.nullCheck(draftTemplate?.description));
    formData.append('requestBody', this.nullCheck(draftTemplate?.templateContent));
    formData.append('notifcationDraftId',this.nullCheck(draftTemplate?.notifcationDraftId));
    if (cerEmailAttachedFiles?.length > 0){
    let i = 0;
    cerEmailAttachedFiles.forEach((file: any) => {
      if (file.rawFile == undefined || file.rawFile == null) {
        formData.append('systemAttachments[' + i + '][fileName]', file.name ?? file?.document?.fileName);
        formData.append('systemAttachments[' + i + '][filePath]', this.getDocumentFilePath(file.document));
        formData.append('systemAttachments[' + i + '][typeCode]', file.typeCode ?? file?.document?.documentTypeCode);
        formData.append('systemAttachments[' + i + '][clientDocumentId]', this.nullCheck(file?.document?.clientDocumentId));
        formData.append('systemAttachments[' + i + '][documentTemplateId]', file.typeCode !== 'CLIENT_DEFAULT' ? file?.document?.documentTemplateId : '');
        i++;
      } else {
        formData.append('uploadedAttachments', file.rawFile);
      }
    });
  }
    return formData;
 }

 nullCheck(value:any){
  if(value){
    return value;
  }
  else{
    return '';
  }

 }
}
