/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Email } from '../entities/email';
/** Data services **/
import { EmailDataService } from '../infrastructure/email.data.service';
import { CommunicationEvents } from '../enums/communication-event.enum';

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
  constructor(private readonly emailDataService: EmailDataService) {}

  /** Public methods **/
  loadEmails(): void {
    this.emailDataService.loadEmails().subscribe({
      next: (emailsResponse) => {
        this.emailsSubject.next(emailsResponse);
      },
      error: (err: any) => {
        console.error('err', err);
      },
    });
  }

  loadDdlLetterTemplates(): void {
    this.emailDataService.loadDdlLetterTemplates().subscribe({
      next: (ddlLetterTemplatesResponse) => {
        this.ddlLetterTemplatesSubject.next(ddlLetterTemplatesResponse);
      },
      error: (err: any) => {
        console.error('err', err);
      },
    });
  }

  loadDdlEmails() {
    this.emailDataService.loadDdlEmails().subscribe({
      next: (ddlEmailsResponse) => {
        this.ddlEmailsSubject.next(ddlEmailsResponse);
      },
      error: (err: any) => {
        console.error('err', err);
      },
    });
  }

  loadClientVariables() {
    this.emailDataService.loadClientVariables().subscribe({
      next: (clientVariablesResponse) => {
        this.clientVariablesSubject.next(clientVariablesResponse);
      },
      error: (err: any) => {
        console.error('err', err);
      },
    });
  }

  loadDdlEditorVariables() {
    this.emailDataService.loadDdlEditorVariables().subscribe({
      next: (ddlEditorVariablesResponse) => {
        this.ddlEditorVariablesSubject.next(ddlEditorVariablesResponse);
      },
      error: (err: any) => {
        console.error('err', err);
      },
    });
  }

  loadEmailTemplates(typeCode: string, channelTypeCode: string) {
    return this.emailDataService.loadEmailTemplates(
      typeCode, channelTypeCode
    );
  }

  loadCERAuthorizationEmailEditVariables(lovType: string) {
    return this.emailDataService.loadCERAuthorizationEmailVariables(lovType);
  }

  generateTextTemplate(clientId: number, clientCaseEligibilityId: string, selectedTemplate: any, requestType: string) {
    return this.emailDataService.replaceAndGenerateTextTemplate(clientId, clientCaseEligibilityId, selectedTemplate, requestType);
  }

  saveForLaterEmailTemplate(draftTemplate: any, isSaveFoLater: boolean){
    return this.emailDataService.saveEmailForLater(draftTemplate, isSaveFoLater);
  }

  getClientDocumentsViewDownload(clientDocumentId: string) {
    return this.emailDataService.getClientDocumentsViewDownload(clientDocumentId);
  }

  getClientDocuments(typeCode: string, subTypeCode: string, clientCaseEligibilityId: string) {
    return this.emailDataService.getClientDocuments(typeCode,subTypeCode,clientCaseEligibilityId);
  }

  loadCERAuthorizationTemplateAttachment(typeCode: string){
    return this.emailDataService.getTemplateAttachment(typeCode);
  }

  loadCERAuthorizationDraftAttachment(esignRequestId: string){
    return this.emailDataService.getDraftTemplateAttachment(esignRequestId);
  }

  initiateAdobeesignRequest(adobeEsignData: any) {
    return this.emailDataService.initiateAdobeEsignRequest(adobeEsignData);
  }

  saveDraftEsignRequest(formData: any) {
    return this.emailDataService.saveDraftEsignRequest(formData);
  }

  loadDraftEsignRequestByClinetId(clientId: number, clientCaseEligibilityId: string, loginUserId: string){
    return this.emailDataService.loadDraftEsignRequestByClinetId(clientId, clientCaseEligibilityId, loginUserId);
  }

  deleteAttachmentRequest(attachmentRequest: any){
    return this.emailDataService.deleteEsignRequestAttachment(attachmentRequest);
  }

  updateEmailTemplateForLater(formData: any){
    return this.emailDataService.updateEsignRequestTemplate(formData);
  }

  getCCList(clientId: number, loginUserId: string){
    return this.emailDataService.getCCEmailListForCER(clientId, loginUserId);
  }

  getEsignRequestInfo(clientCaseEligibilityId: string,){
    return this.emailDataService.getEsignRequest(clientCaseEligibilityId);
  }

  loadLetterAttachment(documentTemplateId: string, typeCode: string){
    return this.emailDataService.getLetterAttachment(documentTemplateId, typeCode);
}

prepareAdobeEsingData(emailData: any, selectedToEmail: any, clientCaseEligibilityId: any, clientId: any, emailSubject: string, loginUserId: any, selectedCCEmail: any, isSaveFoLater: boolean, cerEmailAttachedFiles: any[]) {
  const formData = new FormData();
    formData.append('esignRequestId', emailData?.esignRequestId ?? '');
    formData.append('requestBody', emailData?.templateContent ?? '');
    formData.append('toEmailAddress', selectedToEmail ?? '');
    formData.append('clientCaseEligibilityId', clientCaseEligibilityId ?? '');
    formData.append('clientId', clientId ?? '');
    formData.append('requestSubject', emailSubject ?? ''); 
    formData.append('loginUserId', loginUserId ?? ''); 
    formData.append('cCEmail', selectedCCEmail ?? '');
    formData.append('isSaveFoLater', new Boolean(isSaveFoLater).toString());
    let i = 0;
    cerEmailAttachedFiles.forEach((file) => { 
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

prepareDraftAdobeEsignRequest(draftTemplate: any, selectedToEmail: any, clientCaseEligibilityId: any, clientId: any, emailSubject: string, loginUserId: any, selectedCCEmail: any, isSaveFoLater: boolean, cerEmailAttachedFiles: any[]) {
    const formData = new FormData();
      formData.append('documentTemplateId', draftTemplate?.documentTemplateId ?? '');
      formData.append('esignRequestId', draftTemplate?.esignRequestId ?? '');
      formData.append('systemCode', draftTemplate?.systemCode ?? '');
      formData.append('typeCode', draftTemplate?.typeCode ?? '');
      formData.append('subtypeCode', draftTemplate?.subtypeCode ?? '');
      formData.append('channelTypeCode', draftTemplate?.channelTypeCode ?? '');
      formData.append('languageCode', draftTemplate?.languageCode ?? '');
      formData.append('description', draftTemplate?.description ?? '');
      formData.append('requestBody', draftTemplate?.templateContent ?? '');
      formData.append('toEmailAddress', selectedToEmail ?? '');
      formData.append('clientCaseEligibilityId', clientCaseEligibilityId ?? '');
      formData.append('clientId', clientId ?? '');
      formData.append('requestSubject', emailSubject ?? ''); 
      formData.append('loginUserId', loginUserId ?? '');
      formData.append('esignRequestStatusCode', CommunicationEvents.EsignRequestStatusCode ?? '');
      formData.append('cCEmail', selectedCCEmail ?? ''); 
      formData.append('isSaveForLater', new Boolean(isSaveFoLater).toString()); 
      let i = 0;
      cerEmailAttachedFiles.forEach((file) => { 
        if(file.rawFile == undefined || file.rawFile == null){
        formData.append('AttachmentDetails['+i+'][fileName]', file.document.description);
        formData.append('AttachmentDetails['+i+'][filePath]', file.document.templatePath);
        formData.append('AttachmentDetails['+i+'][typeCode]', file.typeCode);
        i++;
        }else{
          formData.append('attachments', file.rawFile); 
        }
      });  
      return formData;
}

prepareSendLetterData(draftTemplate: any, cerEmailAttachedFiles: any[]) {
  const formData = new FormData();
  formData.append('documentTemplateId', draftTemplate?.documentTemplateId ?? '');
  formData.append('systemCode', draftTemplate?.systemCode ?? '');
  formData.append('typeCode', draftTemplate?.typeCode ?? '');
  formData.append('subtypeCode', draftTemplate?.subtypeCode ?? '');
  formData.append('channelTypeCode', draftTemplate?.channelTypeCode ?? '');
  formData.append('languageCode', draftTemplate?.languageCode ?? '');
  formData.append('description', draftTemplate?.description ?? '');
  formData.append('templateContent', draftTemplate?.templateContent ?? '');
  let i = 0;
  cerEmailAttachedFiles.forEach((file) => { 
  if(file.typeCode != CommunicationEvents.TemplateAttachmentTypeCode){
    if(file.rawFile == undefined || file.rawFile == null){
      formData.append('savedAttachmentId', file.document.documentTemplateId);
      i++;
    }else{
      formData.append('fileData', file.rawFile); 
    }
  }
});  
return formData;
}
}
