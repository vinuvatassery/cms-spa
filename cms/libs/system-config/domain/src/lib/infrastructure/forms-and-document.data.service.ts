/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
@Injectable({ providedIn: 'root' })
export class FormsAndDocumentDataService 
{
    /** Constructor **/
    constructor(
    private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

    /** Public methods **/

   addFolder(payLoad:any) 
    {
        return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/folders`,payLoad);
    }

    loadfolderSort() {
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/`);
    }

    loadFolderFile(payload:any) {
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/${payload}`);
    }

    getFormsandDocumentsViewDownload(templateId: string) {
        let url = `/case-management/forms-documents-config/${templateId}/content`;
        return this.http.get(
          `${this.configurationProvider.appSettings.caseApiUrl}` +url,
          {
            responseType: 'blob',
          }
        );
      }
}