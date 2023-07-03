/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
/** Entities **/
import { Email } from '../entities/email';

@Injectable({ providedIn: 'root' })
export class EmailDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  loadEmails(): Observable<Email[]> {
    return of([
      { id: 1, name: 'Lorem ipsum', description: 'Lorem ipsum dolor sit amet' },
      {
        id: 2,
        name: 'At vero eos',
        description: 'At vero eos et accusam et justo duo dolores',
      },
      {
        id: 3,
        name: 'Duis autem',
        description: 'Duis autem vel eum iriure dolor in hendrerit',
      },
    ]);
  }

  loadDdlLetterTemplates() {
    return of([
      { key: 1, value: 'Draft Custom Letter', screenName: 'Authorization' },
      { key: 2, value: 'Template Name 1', screenName: 'Authorization' },
      { key: 3, value: 'Template Name 2', screenName: 'Authorization' },
      { key: 4, value: 'Draft Custom Email', screenName: 'Case360PageEmail' },
      { key: 5, value: 'Draft Name 1', screenName: 'Case360PageEmail' },
      { key: 6, value: 'Draft Name 2', screenName: 'Case360PageEmail' },
      { key: 7, value: 'Draft Custom Letter', screenName: 'Case360PageLetter' },
      { key: 8, value: 'Draft Name 1', screenName: 'Case360PageLetter' },
      { key: 9, value: 'Draft Name 2', screenName: 'Case360PageLetter' },
      { key: 10, value: 'Draft Custom SMS', screenName: 'Case360PageSMS' },
      { key: 11, value: 'Draft Name 1', screenName: 'Case360PageSMS' },
      { key: 12, value: 'Draft Name 2', screenName: 'Case360PageSMS' },
      { key: 13, value: 'Draft Custom Email', screenName: 'case-detail' },
      { key: 14, value: 'Draft Name 1', screenName: 'case-detail' },
      { key: 15, value: 'Draft Name 2', screenName: 'case-detail' },
    ]);
  }

  loadDdlEmails() {
    return of([
      'john.cc@email.com',
      'clara.ben@example.com',
      'bellstro@example.com',
      'David.bessi@email.com',
      'father-cool@email.com',
    ]);
  }

  loadClientVariables() {
    return of([
      'Variable 1',
      'Variable 2',
      'Variable 3',
      'Variable 4',
      'Variable 5',
    ]);
  }

  loadDdlEditorVariables() {
    return of([
      {
        text: 'Attach from System',
      },
      {
        text: 'Attach from Computer',
      },
      {
        text: "Attach from Client's Attachments",
      },
    ]);
  }

  loadEmailTemplates(typeCode: string, channelTypeCode: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/templates/${typeCode}/forms?channelTypeCode=${channelTypeCode}`
    );
  }

  loadCERAuthorizationEmailVariables(lovType:string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/templates/${lovType}/variables`
    );
  }

  replaceAndGenerateTextTemplate(clientId: number, clientCaseEligibilityId: string, selectedTemplate: any, requestType: string) {
      return this.http.post<string>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/templates/generate/${clientId}/${clientCaseEligibilityId}?requestType=${requestType}`,selectedTemplate
      );
    }

    saveEmailForLater(draftTemplate: any, isSaveForLater: boolean){
      return this.http.post<any>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/templates?isSaveForLater=${isSaveForLater}`,draftTemplate
      );
    }
    getClientDocumentsViewDownload(documentId: string) {
      return this.http.get(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/documents/${documentId}`
        , {
          responseType: 'blob'
        });
    }

    getClientDocuments(typeCode: string, subTypeCode: string, clientCaseEligibilityId: string) {
      return this.http.get(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/${typeCode}/${subTypeCode}/${clientCaseEligibilityId}`);
    }

    getTemplateAttachment(typeCode: string){
      return this.http.get(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/templates/${typeCode}/forms`
      );
    }

    getDraftTemplateAttachment(esignRequestId: string){
      return this.http.get(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign?esignRequestId=${esignRequestId}`,
      );
    }

    initiateAdobeEsignRequest(adobeEsignData: any){
      return this.http.post<any>(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign`,adobeEsignData
      );
    }
    
    saveDraftEsignRequest(formData: any){
      return this.http.post<any>(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign`,formData
      );
    }

    loadDraftEsignRequestByClinetId(clientId: number, clientCaseEligibilityId: string, loggedInUserId: string){
      return this.http.get(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign/${clientId}/${clientCaseEligibilityId}/${loggedInUserId}`,
      );
    }

    deleteEsignRequestAttachment(esignRequestAttachmentId:any){
      return this.http.delete(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign?esignRequestAttachmentId=${esignRequestAttachmentId}`,
      );
    }

    updateEsignRequestTemplate(formData: any){
      return this.http.put(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign`,formData
      );
    }

    getCCEmailListForCER(clientId: number, loginUserId: string){
      return this.http.get(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/templates/${clientId}/${loginUserId}`,
      );
    }

    getEsignRequest(clientCaseEligibilityId: string){
      return this.http.get(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign/${clientCaseEligibilityId}`,
      );
    }

    getLetterAttachment(templateId: string, typeCode: string){
      return this.http.get(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/templates/${typeCode}/forms?templateId=${templateId}`
      );
    }
}
 