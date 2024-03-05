/** Angular **/
import { Injectable } from '@angular/core';

/** Data services **/
import { EsignDataService } from '../infrastructure/esign-data.service';
import { EsignStatusCode } from '../enums/esign-status-code.enum';

@Injectable({ providedIn: 'root' })
export class EsignFacade {
  /** Constructor**/
  constructor(private readonly esignDataService: EsignDataService) {}

  /** Public methods **/
  initiateAdobeesignRequest(adobeEsignData: any, emailData: any) {
    if(emailData.esignRequestId == undefined || emailData.esignRequestId === null){
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

  getEsignRequestInfo(clientCaseEligibilityId: string,){
    return this.esignDataService.getEsignRequest(clientCaseEligibilityId);
  }

prepareAdobeEsingData(formData:FormData, emailData: any, cerEmailAttachedFiles: any[]) {
    formData.append('documentTemplateId', emailData?.documentTemplateId ?? '');
    formData.append('esignRequestId', emailData?.esignRequestId ?? '');
    formData.append('requestBody', emailData?.templateContent ?? '');
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

prepareDraftAdobeEsignFormData(selectedToEmail: any, clientCaseEligibilityId: any, clientId: any, emailSubject: string, loginUserId: any, selectedCCEmail: any, isSaveFoLater: boolean) {
  const formData = new FormData();
    formData.append('toEmailAddress', selectedToEmail ?? '');
    formData.append('clientCaseEligibilityId', clientCaseEligibilityId ?? '');
    formData.append('clientId', clientId ?? '');
    formData.append('requestSubject', emailSubject ?? ''); 
    formData.append('loginUserId', loginUserId ?? '');
    if(isSaveFoLater){
      formData.append('esignRequestStatusCode', EsignStatusCode.Draft ?? '');
    }
    formData.append('cCEmail', selectedCCEmail ?? ''); 
    formData.append('isSaveForLater', Boolean(isSaveFoLater).toString()); 
    return formData;
}

}
