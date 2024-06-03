/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Document } from '../entities/document';
import { ClientDocumnetEntityType } from '../enums/client-document-entity-type.enum';

/** Data services **/
import { ConfigurationProvider } from '@cms/shared/util-core';

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


  saveDocument(doc: any) {
    let documentFormData = this.bindFormData(doc, ClientDocumnetEntityType.Save);
    return this.http.post(this.getUrl(), documentFormData, { reportProgress: true });
  }

  updateDocument(doc: any) {
    let documentFormData = this.bindFormData(doc, ClientDocumnetEntityType.Edit);
    return this.http.post(this.getUrl(), documentFormData, { reportProgress: true });
  }

  getDocumentsByClientCaseEligibilityId(payload:any) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clientdocuments/${payload.clientId}/documents?SortType=${payload.sortType}&Sorting=${payload.sort}&SkipCount=${payload.skipcount}&MaxResultCount=${payload.maxResultCount}&Filter=${payload.filter}&ColumnName=${payload.columnName}&TypeCode=${payload.typeCode}`
    );
  }

  getClientDocumentsViewDownload(clientDocumentId: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/${clientDocumentId}/content`
      , {
        responseType: 'blob'
      });
  }

  getDocumentByDocumentId(documentId: string) {
    return this.http.get<Document>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clientdocuments/clientDocumentId?clientDocumentId=${documentId}`
    );
  }

  /** private methods**/
  private getUrl() {
    return `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/upload`
  }

  private bindFormData(doc: any, event: any): FormData {
    const documentFormData = new FormData();
    documentFormData.append("clientId", `${doc?.clientId}`);
    documentFormData.append("clientCaseId", doc?.clientCaseId ?? '');
    documentFormData.append("clientCaseEligibilityId", doc?.clientCaseEligibilityId ?? '');
    documentFormData.append("documentTypeCode", doc?.documentTypeCode ?? '');
    documentFormData.append("clientDocumentDescription", doc?.clientDocumentDescription ?? '');
    documentFormData.append("documentName", doc?.documentName ?? '');
    documentFormData.append("documentSize", doc?.documentSize ?? '');

    if (event === ClientDocumnetEntityType.Save) {
      documentFormData.append("document", doc?.document ?? '');
    }
    else {
      documentFormData.append("clientDocumentId", doc?.clientDocumentId ?? '');
      if (doc?.document != null && doc?.document !== "") {
        documentFormData.append("document", doc?.document);
      }
    }

    return documentFormData;
  }
}


