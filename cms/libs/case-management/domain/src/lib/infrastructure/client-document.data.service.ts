/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientDocument } from '../entities/client-document';


@Injectable({ providedIn: 'root' })
export class ClientDocumentDataService {
    /** Constructor**/
    constructor(private readonly http: HttpClient,
        private configurationProvider: ConfigurationProvider) { }

    /** pubic methods**/
    uploadDocument(doc: ClientDocument) {
        let documentFormData = new FormData();
        documentFormData.append("document", doc?.document ?? '');
        documentFormData.append("clientDocumentId", doc?.clientDocumentId ?? '');
        documentFormData.append("clientId", `${doc?.clientId}`);
        documentFormData.append("clientCaseId", doc?.clientCaseId ?? '');
        documentFormData.append("entityId", doc?.entityId ?? '');
        documentFormData.append("entityTypeCode", doc?.entityTypeCode ?? '');
        documentFormData.append("documentTypeCode", doc?.documentTypeCode ?? '');
        documentFormData.append("clientCaseEligibilityId", doc?.clientCaseEligibilityId ?? '');
        documentFormData.append("documentTemplateId", doc?.documentTemplateId ?? '');
        documentFormData.append("documentPath", doc?.documentPath ?? '');

        return this.http.post(this.getUrl(), documentFormData, { reportProgress: true });
    }

    removeDocument(documentId: string) {
        const url = `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/${documentId}`;
        return this.http.delete(url);
    }

    /** private methods**/
    private getUrl() {
        return `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/upload`
    }
    getClientDocumentsByClientCaseEligibilityId(clientCaseEligibilityId: string) {
        return this.http.get<ClientDocument>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/${clientCaseEligibilityId}`
        );
    }

    getClientDocumentsViewDownload(clientDocumentId: string) {
        return this.http.get(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/${clientDocumentId}/content`
         , {
            responseType: 'blob'} );
    }

    getAllClientDocumentsByClientCaseEligibilityId(clientCaseEligibilityId: string) {
        return this.http.get<ClientDocument>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/clientCaseEligibilityId=${clientCaseEligibilityId}`,
        );
    }

    getSignedDocumentInfo(typeCode: string, subTypeCode: string, clientCaseEligibilityId: string) {
        return this.http.get(
            `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/${typeCode}/${subTypeCode}/${clientCaseEligibilityId}`,
          );
    }
}
