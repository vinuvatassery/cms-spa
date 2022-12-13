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
        var postData = JSON.stringify(doc);
        var formData = new FormData();
        formData.append("postData", postData);

        return this.http.post(this.getUrl()
            , formData);
    }

    /** private methods**/
    private getUrl() {
        return `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/document`
    }
}