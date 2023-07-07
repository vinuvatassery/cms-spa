/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Email } from '../entities/email';
/** Data services **/
import { EsignDataService } from '../infrastructure/esign-data.service';
import { CommunicationEvents } from '../enums/communication-event.enum';

@Injectable({ providedIn: 'root' })
export class EsignFacade {
  /** Constructor**/
  constructor(private readonly esignDataService: EsignDataService) {}

  /** Public methods **/
  initiateAdobeesignRequest(adobeEsignData: any) {
    return this.esignDataService.initiateAdobeEsignRequest(adobeEsignData);
  }

  saveDraftEsignRequest(formData: any) {
    return this.esignDataService.saveDraftEsignRequest(formData);
  }

  loadDraftEsignRequestByClinetId(clientId: number, clientCaseEligibilityId: string, loginUserId: string){
    return this.esignDataService.loadDraftEsignRequestByClinetId(clientId, clientCaseEligibilityId, loginUserId);
  }

  deleteAttachmentRequest(attachmentRequest: any){
    return this.esignDataService.deleteEsignRequestAttachment(attachmentRequest);
  }

  updateEmailTemplateForLater(formData: any){
    return this.esignDataService.updateEsignRequestTemplate(formData);
  }

  getEsignRequestInfo(clientCaseEligibilityId: string,){
    return this.esignDataService.getEsignRequest(clientCaseEligibilityId);
  }

prepareAdobeEsingData(emailData: any, selectedToEmail: any, clientCaseEligibilityId: any, clientId: any, emailSubject: string, loginUserId: any, selectedCCEmail: any, isSaveFoLater: boolean, cerEmailAttachedFiles: any[]) {
  const formData = new FormData();
    formData.append('documentTemplateId', emailData?.documentTemplateId ?? '');
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

}
