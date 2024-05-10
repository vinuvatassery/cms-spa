/** Angular **/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core';


@Injectable({ providedIn: 'root' })
export class FormsAndDocumentDataService {
    /** Constructor **/
    constructor(private readonly http: HttpClient,
        private configurationProvider: ConfigurationProvider) { }

    /** Public methods **/
    loadfolderSort() {
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/folder-sort`);
    }
}