/** Angular **/
import { Injectable } from '@angular/core';

/** Data services **/
import { EsignDataService } from '../infrastructure/esign-data.service';
import { EsignStatusCode } from '../enums/esign-status-code.enum';
import { ClientHivVerification } from '../entities/client-hiv-verification';
import { CommunicationEventTypeCode } from '../enums/communication-event-type-code.enum';

@Injectable({ providedIn: 'root' })
export class EsignFacade {
  /** Constructor**/
  constructor(private readonly esignDataService: EsignDataService) {}

  /** Public methods **/
  initiateAdobeesignRequest(adobeEsignData: any, emailData: any) {
    if(emailData?.esignRequestId == undefined || emailData?.esignRequestId === null){
      return this.esignDataService.initiateAdobeEsignRequest(adobeEsignData);
    }else{
      return this.esignDataService.updateEsignRequestTemplate(adobeEsignData);
    }
  }

  saveDraftEsignRequest(formData: any) {
    return this.esignDataService.saveDraftEsignRequest(formData);
  }

  loadDraftEsignRequestByClinetId(entityId: string, clientCaseEligibilityId: string, loginUserId: string){
    return this.esignDataService.loadDraftEsignRequestByClinetId(entityId, clientCaseEligibilityId, loginUserId);
  }

  deleteAttachmentRequest(attachmentRequest: any){
    return this.esignDataService.deleteEsignRequestAttachment(attachmentRequest);
  }

  updateEmailTemplateForLater(formData: any){
    return this.esignDataService.updateEsignRequestTemplate(formData);
  }

  getEsignRequestInfo(clientCaseEligibilityId: string, flowName: string){
    return this.esignDataService.getEsignRequest(clientCaseEligibilityId, flowName);
  }

prepareAdobeEsingData(formData:FormData, emailData: any, cerEmailAttachedFiles: any[]) {
    formData.append('notificationTemplateId', this.nullCheck(emailData?.documentTemplateId));
    formData.append('esignRequestId', this.nullCheck(emailData?.esignRequestId));
    formData.append('requestBody', this.nullCheck(emailData?.templateContent));
    formData.append('typeCode', this.nullCheck(emailData?.typeCode));
    this.prepareNotificationAttachment(cerEmailAttachedFiles, formData);
    return formData;
}

  prepareNotificationAttachment(cerEmailAttachedFiles: any[], formData: FormData) {
    if(cerEmailAttachedFiles?.length > 0){
      let i = 0;
      cerEmailAttachedFiles.forEach((file: any) => { 
        if(file.rawFile == undefined || file.rawFile == null){
          this.prepareAttachmentDetails(i, file, formData);
        }else{
          formData.append('attachments', file.rawFile); 
        }
      });
    }
  }

  prepareAttachmentDetails(i: number, file: any, formData: FormData) {
    formData.append('AttachmentDetails['+i+'][fileName]', file.document.description == undefined ? file.document.attachmentName : file.document.description);
    formData.append('AttachmentDetails['+i+'][filePath]', file.document.templatePath == undefined ? file.document.path : file.document.templatePath);
    formData.append('AttachmentDetails['+i+'][typeCode]', file.document.typeCode == undefined ? file.document.attachmentTypeCode : file.document.typeCode);
    formData.append('AttachmentDetails['+i+'][clientDocumentId]', this.nullCheck(file?.document?.clientDocumentId));
    formData.append('AttachmentDetails['+i+'][documentTemplateId]', file.typeCode !== 'CLIENT_DEFAULT' ? file?.document?.documentTemplateId : '');
    formData.append('AttachmentDetails['+i+'][notificationAttachmentId]', this.nullCheck(file?.notificationAttachmentId));
    i++;
  }

prepareDraftAdobeEsignRequest(formData:FormData, draftTemplate: any, cerEmailAttachedFiles: any[]) {
      formData.append('notificationTemplateId', this.nullCheck(draftTemplate?.documentTemplateId));
      formData.append('esignRequestId', this.nullCheck(draftTemplate?.esignRequestId));
      formData.append('systemCode', this.nullCheck(draftTemplate?.systemCode));
      formData.append('typeCode',this.nullCheck(draftTemplate?.typeCode));
      formData.append('subtypeCode', this.nullCheck(draftTemplate?.subtypeCode));
      formData.append('channelTypeCode', this.nullCheck(draftTemplate?.channelTypeCode));
      formData.append('languageCode', this.nullCheck(draftTemplate?.languageCode));
      formData.append('description', this.nullCheck(draftTemplate?.description ));
      formData.append('requestBody',this.nullCheck(draftTemplate?.templateContent));
      if(cerEmailAttachedFiles?.length > 0){
      let i = 0;
      cerEmailAttachedFiles.forEach((file: any) => { 
        if(file.rawFile == undefined || file.rawFile == null){
        formData.append('AttachmentDetails['+i+'][fileName]', file.document.description);
        formData.append('AttachmentDetails['+i+'][filePath]', file.document.templatePath);
        formData.append('AttachmentDetails['+i+'][typeCode]', file.typeCode);
        formData.append('AttachmentDetails['+i+'][clientDocumentId]',this.nullCheck(file?.document?.clientDocumentId));
        formData.append('AttachmentDetails['+i+'][documentTemplateId]', file.typeCode !== 'CLIENT_DEFAULT' ? file?.document?.documentTemplateId : '');
        formData.append('AttachmentDetails['+i+'][notificationAttachmentId]',this.nullCheck(file?.notificationAttachmentId));
        i++;
        }else{
          formData.append('attachments', file.rawFile); 
        }
      });  
    }
      return formData;
}

prepareDraftAdobeEsignFormData(selectedCCEmail: any, selectedBccEmail: any, isSaveForLater: boolean, templateTypeCode: string, eventGroupCode: string, formData: FormData) {
    formData.append('templateTypeCode', this.nullCheck(templateTypeCode));
    formData.append('eventGroupCode', this.nullCheck(eventGroupCode));
    if(isSaveForLater){
      formData.append('esignRequestStatusCode', this.nullCheck(EsignStatusCode.Draft));
    }
    formData.append('bcc',this.nullCheck(selectedBccEmail)); 
    if(selectedCCEmail?.length > 0){
      let i = 0;
      selectedCCEmail.forEach((item: any) =>{
        formData.append('cc[' + i + '][email]',this.nullCheck(item));
        formData.append('cc[' + i + '][isDefault]',this.nullCheck(item.isDefault));
        i++;
      });
    } 
    formData.append('isSaveForLater', Boolean(isSaveForLater).toString()); 
    return formData;
}

prepareEsignLetterDraftFormData(clientCaseEligibilityId: any, entityId: any, loginUserId: any, isSaveForLater: boolean) {
  const formData = new FormData();
    formData.append('clientCaseEligibilityId',this.nullCheck( clientCaseEligibilityId));
    formData.append('clientId',this.nullCheck(entityId));
    formData.append('loginUserId',this.nullCheck(loginUserId));
    if(isSaveForLater){
      formData.append('esignRequestStatusCode',this.nullCheck(EsignStatusCode.Draft));
    }
    formData.append('isSaveForLater', Boolean(isSaveForLater).toString()); 
    return formData;
}

prepareHivVerificationdobeEsignFormData(clientHivVerification: ClientHivVerification, clientCaseEligibilityId: any, emailSubject: string, selectedAttachedFile: any[], notificationTemplateId: string) {
    const formData = new FormData();
    formData.append('to', clientHivVerification?.verificationToEmail ?? '');
    formData.append('clientCaseEligibilityId', clientCaseEligibilityId ?? '');
    formData.append('clientId', clientHivVerification?.clientId.toString() ?? '');
    formData.append('notificationTemplateId', notificationTemplateId ?? '');
    formData.append('requestSubject', emailSubject ?? '');
    formData.append('typeCode', CommunicationEventTypeCode.HIVVerificationEmail ?? '');
    formData.append('requestBody', "");
    this.prepareHivVerificationAttachment(selectedAttachedFile, formData);
    return formData;
}

  prepareHivVerificationAttachment(selectedAttachedFile: any[], formData: FormData) {
    if(selectedAttachedFile?.length > 0){
      let i = 0;
      selectedAttachedFile.forEach((file: any) => { 
      if(!selectedAttachedFile.includes(file?.document?.attachmentName) || !selectedAttachedFile.includes(file.document.description)){
        if(file.rawFile == undefined || file.rawFile == null){
          this.prepareHivAttachment(i, file, formData);
        }
      }
      });
    }
  }
  prepareHivAttachment(i: number, file: any, formData: FormData) {
    formData.append('AttachmentDetails['+i+'][fileName]', file.document.description == undefined ? file.document.attachmentName : file.document.description);
    formData.append('AttachmentDetails['+i+'][filePath]', file.document.templatePath == undefined ? file.document.path : file.document.templatePath);
    formData.append('AttachmentDetails['+i+'][typeCode]', file.document.typeCode == undefined ? file.document.attachmentTypeCode : file.document.typeCode);
    formData.append('AttachmentDetails['+i+'][NotificationAttachmentId]', file.document.notificationAttachmentId);
    i++;
  }

nullCheck(value:any){
  if(value){
    return value;
  }
  else{
    return '';
  }

 }

 prepareEsignData(selectedToEmail: any, clientCaseEligibilityId: any, clientId: any, emailSubject: string, loginUserId: any, ) {
    const formData = new FormData();
    formData.append('to', this.nullCheck(selectedToEmail));
    formData.append('clientCaseEligibilityId', this.nullCheck(clientCaseEligibilityId));
    formData.append('clientId', this.nullCheck(clientId));
    formData.append('requestSubject', this.nullCheck(emailSubject)); 
    formData.append('loginUserId', this.nullCheck(loginUserId));
    return formData;
}
}
