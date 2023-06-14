/** Angular **/
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthorizationDataService {

    /** Constructor**/
    constructor(private readonly http: HttpClient,
        private configurationProvider: ConfigurationProvider) { }

    loadAuthorization(eligibilityId: string) {
        return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/authorization/application-signature?clientCaseEligibilityId=${eligibilityId}`);
    }

    updateAuthorization(data: any){
        const formData: any = new FormData();
        formData.append('ClientCaseEligibilityId', data?.clientCaseEligibilityId);
        formData.append('ApplicantSignedDate', data?.applicantSignedDate);
        formData.append('SignatureNotedDate', data?.signatureNotedDate);
        formData.append('SignedApplicationDocument', data?.signedApplicationDocument);
        formData.append('SignedApplication[DocumentId]', data?.signedApplication?.documentId);
        formData.append('SignedApplication[DocumentName]', data?.signedApplication?.documentName);
        formData.append('SignedApplication[DocumentSize]', data?.signedApplication?.documentSize);
        formData.append('SignedApplication[DocumentTypeCode]', data?.signedApplication?.documentTypeCode);
        return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/authorization/application-signature`, formData);
    }

}
