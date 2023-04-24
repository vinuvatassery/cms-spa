/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Subject } from 'rxjs/internal/Subject';
/** Entities **/
import { Document } from '../entities/document';
/** Data services **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
@Injectable({ providedIn: 'root' })
export class DocumentDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  loadDocuments(): Observable<Document[]> {
    return of([
      { id: 1, 
        name: 'Lorem ipsum', 
        description: 'Lorem ipsum dolor sit amet' ,
        filesize: '12 MB' ,
        attachmenttType: 'Proof of Income' , 
        attachmentnote: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli. Sed dignissim nec lorem' ,
        by: 'James' ,
      },
      { id: 1, name: 'Lorem ipsum', description: 'Lorem ipsum dolor sit amet' },
      {
        id: 2,
        name: 'At vero eos',
        description: 'At vero eos et accusam et justo duo dolores',
        filesize: '12 MB' ,
        attachmenttType: 'Proof of Income' , 
        attachmentnote: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli. Sed dignissim nec lorem' ,
        by: 'James' ,
      },
      {
        id: 3,
        name: 'Duis autem',
        description: 'Duis autem vel eum iriure dolor in hendrerit',
        filesize: '12 MB' ,
        attachmenttType: 'Proof of Income' , 
        attachmentnote: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli. Sed dignissim nec lorem' ,
        by: 'James' ,
      },
    ]);
  }
  
  uploadDocument(doc: any) {
    let documentFormData = new FormData();
    documentFormData = this.bindFormData(doc, 'SAVE');
    return this.http.post(this.getUrl(), documentFormData, { reportProgress: true });
  }

  updateDocument(doc: any) {
    let documentFormData = new FormData();
    documentFormData = this.bindFormData(doc, 'EDIT');
    return this.http.put(this.getUrl(), documentFormData, { reportProgress: true });
  }
  
  getDocumentsByClientCaseEligibilityId(clientCaseEligibilityId: string, skipcount: number, maxResultCount: number, sort: string, sortType: string, filter: any, columnName: any) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/client-document/${clientCaseEligibilityId}/attachments?SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}&Filter=${filter}&ColumnName=${columnName}`
    );
  }

  getClientDocumentsViewDownload(documentId: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/documents/${documentId}`
      , {
        responseType: 'blob'
      });
  }

  getDocumentByDocumentId(documentId: string) {
    return this.http.get<Document>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/client-document/clientDocumentId?clientDocumentId=${documentId}`
    );
  }

  /** private methods**/
  private getUrl() {
    return `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-document/`
  }

  private bindFormData(doc: any, event: any): FormData {
    let documentFormData = new FormData();
    if (event == "SAVE") {
      documentFormData.append("clientId", `${doc?.clientId}`);
      documentFormData.append("clientCaseId", doc?.clientCaseId ?? '');
      documentFormData.append("clientCaseEligibilityId", doc?.clientCaseEligibilityId ?? '');
      documentFormData.append("document", doc?.document ?? '');
      documentFormData.append("documentName", doc?.documentName ?? '');
      documentFormData.append("documentSize", doc?.documentSize ?? '');
      documentFormData.append("documentTypeCode", doc?.documentTypeCode ?? '');
      documentFormData.append("attachmentNote", doc?.attachmentNote ?? '');
    }
    else {
      documentFormData.append("clientDocumentId", doc?.clientDocumentId ?? '');
      documentFormData.append("clientId", `${doc?.clientId}`);
      documentFormData.append("clientCaseId", doc?.clientCaseId ?? '');
      documentFormData.append("clientCaseEligibilityId", doc?.clientCaseEligibilityId ?? '');
      documentFormData.append("documentTypeCode", doc?.documentTypeCode ?? '');
      documentFormData.append("attachmentNote", doc?.attachmentNote ?? '');
      documentFormData.append("document", doc?.document ?? '');
      documentFormData.append("documentName", doc?.documentName ?? '');
      documentFormData.append("documentSize", doc?.documentSize ?? '');
    }
    return documentFormData;
  }
}
