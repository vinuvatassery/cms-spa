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
    formData.append('documentTemplateId', emailData?.documentTemplateId ?? '');
    formData.append('esignRequestId', emailData?.esignRequestId ?? '');
    formData.append('requestBody', emailData?.templateContent ?? '');
    formData.append('typeCode', emailData?.typeCode ?? '');
    if(cerEmailAttachedFiles?.length > 0){
    let i = 0;
    cerEmailAttachedFiles.forEach((file: any) => { 
      if(file.rawFile == undefined || file.rawFile == null){
        formData.append('AttachmentDetails['+i+'][fileName]', file.document.description == undefined ? file.document.attachmentName : file.document.description);
        formData.append('AttachmentDetails['+i+'][filePath]', file.document.templatePath == undefined ? file.document.path : file.document.templatePath);
        formData.append('AttachmentDetails['+i+'][typeCode]', file.document.typeCode == undefined ? file.document.attachmentTypeCode : file.document.typeCode);
        formData.append('AttachmentDetails['+i+'][clientDocumentId]', file?.document?.clientDocumentId ?? '');
        formData.append('AttachmentDetails['+i+'][documentTemplateId]', file.typeCode !== 'CLIENT_DEFAULT' ? file?.document?.documentTemplateId : '');
        formData.append('AttachmentDetails['+i+'][notificationAttachmentId]', file?.notificationAttachmentId ?? '');
      i++;
      }else{
        formData.append('attachments', file.rawFile); 
      }
    });
  }
    return formData;
}

prepareDraftAdobeEsignRequest(formData:FormData, draftTemplate: any, cerEmailAttachedFiles: any[]) {
      formData.append('documentTemplateId', draftTemplate?.documentTemplateId ?? '');
      formData.append('esignRequestId', draftTemplate?.esignRequestId ?? '');
      formData.append('systemCode', draftTemplate?.systemCode ?? '');
      formData.append('typeCode', draftTemplate?.typeCode ?? '');
      formData.append('subtypeCode', draftTemplate?.subtypeCode ?? '');
      formData.append('channelTypeCode', draftTemplate?.channelTypeCode ?? '');
      formData.append('languageCode', draftTemplate?.languageCode ?? '');
      formData.append('description', draftTemplate?.description ?? '');
      formData.append('requestBody', draftTemplate?.templateContent ?? '');
      if(cerEmailAttachedFiles?.length > 0){
      let i = 0;
      cerEmailAttachedFiles.forEach((file: any) => { 
        if(file.rawFile == undefined || file.rawFile == null){
        formData.append('AttachmentDetails['+i+'][fileName]', file.document.description);
        formData.append('AttachmentDetails['+i+'][filePath]', file.document.templatePath);
        formData.append('AttachmentDetails['+i+'][typeCode]', file.typeCode);
        i++;
        }else{
          formData.append('attachments', file.rawFile); 
        }
      });  
    }
      return formData;
}

prepareDraftAdobeEsignFormData(selectedToEmail: any, clientCaseEligibilityId: any, clientId: any, emailSubject: string, loginUserId: any, selectedCCEmail: any, selectedBccEmail: any, isSaveForLater: boolean) {
  const formData = new FormData();
    formData.append('to', selectedToEmail ?? '');
    formData.append('clientCaseEligibilityId', clientCaseEligibilityId ?? '');
    formData.append('clientId', clientId ?? '');
    formData.append('requestSubject', emailSubject ?? ''); 
    formData.append('loginUserId', loginUserId ?? '');
    if(isSaveForLater){
      formData.append('esignRequestStatusCode', EsignStatusCode.Draft ?? '');
    }
    formData.append('bcc',selectedBccEmail ?? ''); 
    if(selectedCCEmail?.length > 0){
      let i = 0;
      selectedCCEmail.forEach((item: any) =>{
        formData.append('cc[' + i + '][email]', item ?? '');
        formData.append('cc[' + i + '][isDefault]', item.isDefault ?? '');
        i++;
      });
    } 
    formData.append('isSaveForLater', Boolean(isSaveForLater).toString()); 
    return formData;
}

prepareEsignLetterDraftFormData(clientCaseEligibilityId: any, entityId: any, loginUserId: any, isSaveForLater: boolean) {
  const formData = new FormData();
    formData.append('clientCaseEligibilityId', clientCaseEligibilityId ?? '');
    formData.append('clientId', entityId ?? '');
    formData.append('loginUserId', loginUserId ?? '');
    if(isSaveForLater){
      formData.append('esignRequestStatusCode', EsignStatusCode.Draft ?? '');
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
    if(selectedAttachedFile?.length > 0){

    let i = 0;
    selectedAttachedFile.forEach((file: any) => { 
    if(!selectedAttachedFile.includes(file?.document?.attachmentName) || !selectedAttachedFile.includes(file.document.description)){
      if(file.rawFile == undefined || file.rawFile == null){
        formData.append('AttachmentDetails['+i+'][fileName]', file.document.description == undefined ? file.document.attachmentName : file.document.description);
        formData.append('AttachmentDetails['+i+'][filePath]', file.document.templatePath == undefined ? file.document.path : file.document.templatePath);
        formData.append('AttachmentDetails['+i+'][typeCode]', file.document.typeCode == undefined ? file.document.attachmentTypeCode : file.document.typeCode);
        formData.append('AttachmentDetails['+i+'][NotificationAttachmentId]', file.document.notificationAttachmentId == undefined ? file.document.notificationAttachmentId : file.document.notificationAttachmentId);
      i++;
      }
   }
    });
  }
    return formData;
}
}
