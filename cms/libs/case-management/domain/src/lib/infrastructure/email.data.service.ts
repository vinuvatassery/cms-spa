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
      { key: 4, value: 'Draft Custom Letter', screenName: 'Case360Page' },
      { key: 5, value: 'Draft Name 1', screenName: 'Case360Page' },
      { key: 6, value: 'Draft Name 2', screenName: 'Case360Page' },
      { key: 7, value: 'Draft Custom Letter', screenName: 'case-detail' },
      { key: 8, value: 'Draft Name 1', screenName: 'case-detail' },
      { key: 9, value: 'Draft Name 2', screenName: 'case-detail' },
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
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/generatetext/${clientId}/${clientCaseEligibilityId}?requestType=${requestType}`,selectedTemplate
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

    getClientDocument(typeCode: string, subTypeCode: string, clientCaseEligibilityId: string) {
      return this.http.get(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/${typeCode}/${subTypeCode}/${clientCaseEligibilityId}`);
    }

    getTemplateAttachment(typeCode: string){
      return this.http.get(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/templates/${typeCode}/forms`
      );
    } 
}
 