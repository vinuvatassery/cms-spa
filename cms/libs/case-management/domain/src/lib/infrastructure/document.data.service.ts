/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Document } from '../entities/document';
import { ConfigurationProvider } from '@cms/shared/util-core';
@Injectable({ providedIn: 'root' })
export class DocumentDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) { }

  /** Public methods **/
  loadDocuments(): Observable<Document[]> {
    return of([
      {
        id: 1,
        name: 'Lorem ipsum',
        description: 'Lorem ipsum dolor sit amet',
        filesize: '12 MB',
        attachmenttType: 'Proof of Income',
        attachmentnote: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli. Sed dignissim nec lorem',
        by: 'James',
      },
      { id: 1, name: 'Lorem ipsum', description: 'Lorem ipsum dolor sit amet' },
      {
        id: 2,
        name: 'At vero eos',
        description: 'At vero eos et accusam et justo duo dolores',
        filesize: '12 MB',
        attachmenttType: 'Proof of Income',
        attachmentnote: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli. Sed dignissim nec lorem',
        by: 'James',
      },
      {
        id: 3,
        name: 'Duis autem',
        description: 'Duis autem vel eum iriure dolor in hendrerit',
        filesize: '12 MB',
        attachmenttType: 'Proof of Income',
        attachmentnote: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli. Sed dignissim nec lorem',
        by: 'James',
      },
    ]);
  }

  uploadDocument(doc: any) {
    let documentFormData = new FormData();
    documentFormData.append("clientId", `${doc?.clientId}`);
    documentFormData.append("clientCaseId", doc?.clientCaseId ?? '');
    documentFormData.append("clientCaseEligibilityId", doc?.clientCaseEligibilityId ?? '');
    documentFormData.append("entityId", doc?.entityId ?? '');
    documentFormData.append("document", doc?.document ?? '');
    documentFormData.append("documentName", doc?.documentName ?? '');
    documentFormData.append("documentSize", doc?.documentSize ?? '');
    documentFormData.append("clientDocumentId", doc?.clientDocumentId ?? '');
    documentFormData.append("entityId", doc?.entityId ?? '');
    documentFormData.append("entityTypeCode", doc?.entityTypeCode ?? '');
    documentFormData.append("documentTypeCode", doc?.documentTypeCode ?? '');
    documentFormData.append("documentTemplateId", doc?.documentTemplateId ?? '');
    documentFormData.append("documentPath", doc?.documentPath ?? '');
    documentFormData.append("attachmentNote", doc?.attachmentNote ?? '');
    documentFormData.append("attachmentType", doc?.attachmentType ?? '');
    documentFormData.append("otherAttachmentType", doc?.otherAttachmentType ?? '');
    return this.http.post(this.getUrl(), documentFormData, { reportProgress: true });
  }
  updateDocument(doc: any) {
    let documentFormData = new FormData();
    documentFormData.append("clientId", `${doc?.clientId}`);
    documentFormData.append("clientCaseId", doc?.clientCaseId ?? '');
    documentFormData.append("clientCaseEligibilityId", doc?.clientCaseEligibilityId ?? '');
    documentFormData.append("entityId", doc?.entityId ?? '');
    documentFormData.append("document", doc?.document ?? '');
    documentFormData.append("documentName", doc?.documentName ?? '');
    documentFormData.append("documentSize", doc?.documentSize ?? '');
    documentFormData.append("clientDocumentId", doc?.clientDocumentId ?? '');
    documentFormData.append("entityId", doc?.entityId ?? '');
    documentFormData.append("entityTypeCode", doc?.entityTypeCode ?? '');
    documentFormData.append("documentTypeCode", doc?.documentTypeCode ?? '');
    documentFormData.append("documentTemplateId", doc?.documentTemplateId ?? '');
    documentFormData.append("documentPath", doc?.documentPath ?? '');
    documentFormData.append("attachmentNote", doc?.attachmentNote ?? '');
    documentFormData.append("attachmentType", doc?.attachmentType ?? '');
    documentFormData.append("otherAttachmentType", doc?.otherAttachmentType ?? '');
    return this.http.put(this.getUrl(), doc, { reportProgress: true });
  }
  /** private methods**/
  private getUrl() {
    return `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-document/uploadAttachment`
  }
  getDocumentsByClientCaseEligibilityId(clientCaseEligibilityId: string) {
    return this.http.get<Document[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/client-document/attachments/clientCaseEligibilityId?clientCaseEligibilityId=${clientCaseEligibilityId}`
    );
  }
  getClientDocumentsViewDownload(DocumentId: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/documents/${DocumentId}`
      , {
        responseType: 'blob'
      });
  }
  getDocumentByDocumentId(DocumentId: string) {
    return this.http.get<Document>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/client-document/attachments/id?ClientDocumentId=${DocumentId}`      
    ); 
  }
}
