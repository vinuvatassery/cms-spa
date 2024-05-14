/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Observable } from 'rxjs';
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
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/folder-sort`);
    }

    loadFolderFile() {
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config`);
    }

    getFolderName() 
    {
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/folders`,);
    }
    uploadFiles(files: File[], documentTemplateId: string) {
        const formData: FormData = new FormData();
        files.forEach(file => {
          formData.append('uploadFiles', file);
        });
        formData.append('documentTemplateId', documentTemplateId);
        return this.http.post<any>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/folder/files`,
          formData
        );
      }
    }