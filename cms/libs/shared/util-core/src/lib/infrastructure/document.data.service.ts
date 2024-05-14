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
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/${clientDocumentId}/content`
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
      case ApiType.SystemConfig: {
        apiUrl = this.configurationProvider.appSettings.sysConfigApiUrl;
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

  getExportFileForSelection(pageAndSortedRequest: any, path: string, selectedAllPaymentsList: any, batchId?: any, apiType: string = ApiType.CaseApi) {
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
      case ApiType.SystemConfig: {
        apiUrl = this.configurationProvider.appSettings.sysConfigApiUrl;
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
        'selectedIds': selectedIds,
        'UnSelectedIds': unselectedIds,
        'batchId': batchId,
        'selectAll': selectedAllPaymentsList.selectAll,
        'sortType': pageAndSortedRequest.SortType,
        'sorting': pageAndSortedRequest.Sorting,
        'filter': pageAndSortedRequest.Filter,
      };
      return this.http.post(
        `${apiUrl}/data-management/export/${path}`, exportData,
        { responseType: 'blob' }
      )
    }
  }

  getEventtDocumentsViewDownload(eventLogAttachmentId: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/event-logs/${eventLogAttachmentId}/content`
      , {
        responseType: 'blob'
      });
  }

  getOldDocumentsViewDownload(docuemntPath: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clientdocuments/${docuemntPath}/download`
      , {
        responseType: 'blob'
      });
  }
}
