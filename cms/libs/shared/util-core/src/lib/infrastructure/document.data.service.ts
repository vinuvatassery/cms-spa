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

  getExportFile(pageAndSortedRequest: any, path: string, apiType: string = ApiType.CaseApi) {
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
    return this.http.post(
      `${apiUrl}/data-management/export/${path}`, pageAndSortedRequest,
      { responseType: 'blob' }
    )
  }

  getExportFileForSelection(pageAndSortedRequest: any, path: string, apiType: string = ApiType.CaseApi, selectedAllPaymentsList: any, batchId?: any) {
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

    if (!selectedAllPaymentsList) {
      return this.http.post(
        `${apiUrl}/data-management/export/${path}`, pageAndSortedRequest,
        { responseType: 'blob' }
      )
    } else {

      const selectedIds: string[] = selectedAllPaymentsList.paymentsSelected?.map((item: any) => item.paymentRequestId) ?? [];
      const unselectedIds: string[] = selectedAllPaymentsList.paymentsUnSelected?.map((item: any) => item.paymentRequestId) ?? [];

      const exportData = {
        'gridData': pageAndSortedRequest,
        'selectedIds': selectedIds,
        'UnSelectedIds': unselectedIds,
        'batchId': batchId,
        'selectAll': selectedAllPaymentsList.selectAll,
      };
      return this.http.post(
        `${apiUrl}/data-management/export/${path}`, exportData,
        { responseType: 'blob' }
      )
    }
  }
}
