/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '../shared-util-core.module';
import { ApiType } from '../enums/api-type.enum';

@Injectable({ providedIn: 'root' })
export class DocumentDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider
  ) { }

  /** pubic methods**/

  getClientDocumentsViewDownload(clientDocumentId: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/documents/${clientDocumentId}/content`
      , {
        responseType: 'blob'
      });
  }

  getExportFile(pageAndSortedRequest: any, path: string, apiType: string = ApiType.CaseApi, selectedIds?: any[]) {
    let apiUrl: any;
    switch (apiType) {
      case ApiType.CaseApi: {
        apiUrl = this.configurationProvider.appSettings.caseApiUrl;
        break;
      }
      case ApiType.ProductivityToolsApi: {
        apiUrl = this.configurationProvider.appSettings.productivityToolsApiUrl;
        break;
      }
      default: {
        apiUrl = this.configurationProvider.appSettings.caseApiUrl;
        break;
      }
    }
    if (!selectedIds) {
      return this.http.post(
        `${apiUrl}/data-management/export/${path}`, pageAndSortedRequest,
        { responseType: 'blob' }
      )
    } else {
      const exportData = {
        gridData: pageAndSortedRequest,
        selectedIds: selectedIds
      };

      return this.http.post(
        `${apiUrl}/data-management/export/${path}`, exportData,
        { responseType: 'blob' }
      )
    }

  }
}
