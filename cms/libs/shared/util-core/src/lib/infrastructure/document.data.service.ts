/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '../shared-util-core.module';




@Injectable({ providedIn: 'root' })
export class DocumentDataService {
    /** Constructor**/
    constructor(private readonly http: HttpClient,
        private configurationProvider: ConfigurationProvider) { }

    /** pubic methods**/

    getClientDocumentsViewDownload(clientDocumentId: string) {
        return this.http.get(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/documents/${clientDocumentId}/content`
         , {
            responseType: 'blob'} );
    }
}
