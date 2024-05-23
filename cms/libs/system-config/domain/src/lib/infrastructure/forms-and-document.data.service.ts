/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
@Injectable({ providedIn: 'root' })
export class FormsAndDocumentDataService 
{
  fileUploadUrl = `${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/files`
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
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/${payload.sort}/${payload.active}`);
    }

    getFolderName()
    {
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/folders`,);
    }

    uploadFiles(formData:any) {
        return this.http.post<any>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/files`,
          formData
        );
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


      uploadAttachments(uploadRequest:FormData, documentTemplateId:any){
       
        return this.http.post(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/files/${documentTemplateId}/new-version`,uploadRequest);
        }
        updateTemplate(payload:any){
          return this.http.put(
            `${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/template`,payload);
          }
       reOrder(reOrderRequest:FormData){
       
          return this.http.post(
            `${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/re-order`,reOrderRequest);
          }

        saveGridState(sortType:String){
          return this.http.post(
            `${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/grid-state?sortType=${sortType}`,null);
          
        }

        getGridState(){
          return this.http.get(
            `${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/grid-state`);
          
        }
          

          updateStatus(payload:any){
            return this.http.put(
              `${this.configurationProvider.appSettings.caseApiUrl}/case-management/forms-documents-config/template/status`,payload);
            }
    }
