import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class PendingApprovalPaymentService {
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}



  getPendingApprovalPaymentGrid(gridSetupData: any, serviceSubType: string, level: number) {
    const paymentApprovalGridSetupDto = {
      SortType: gridSetupData.gridDataRefinerValue.sortType,
      Sorting: gridSetupData.gridDataRefinerValue.sortColumn,
      SkipCount: gridSetupData.gridDataRefinerValue.skipCount,
      MaxResultCount: gridSetupData.gridDataRefinerValue.pagesize,
      ColumnName : gridSetupData.gridDataRefinerValue.columnName,
      Filter:JSON.stringify(gridSetupData.gridDataRefinerValue.filter)
    };
    let url = `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/payments/batches?serviceSubType=${serviceSubType}&level=${level}`;
    return this.http.post<any>(url, paymentApprovalGridSetupDto);
  }

  getPendingApprovalPaymentMainList(gridSetupData: any, serviceSubType: string, level: number) {
    const paymentApprovalGridSetupDto = {
      SortType: gridSetupData.gridDataRefinerValue.sortType,
      Sorting: gridSetupData.gridDataRefinerValue.sortColumn,
      SkipCount: gridSetupData.gridDataRefinerValue.skipCount,
      MaxResultCount: gridSetupData.gridDataRefinerValue.pagesize,
      Filter: JSON.stringify(gridSetupData.gridDataRefinerValue.filter),
    };
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/payments/batches?serviceSubType=${serviceSubType}&level=${level}`,
        paymentApprovalGridSetupDto
    );
  }

  loadSubmittedSummary(paymentRequestBatchIds: string[]) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/payments/summary` ,
      paymentRequestBatchIds
    );
  }

  getPendingApprovalBatchDetailPaymentsGrid(gridSetupData: any, batchId: string, serviceSubType: string) {
    const batchDetailGridSetupDto = {
      SortType: gridSetupData.gridDataRefinerValue.sortType,
      Sorting: gridSetupData.gridDataRefinerValue.sort,
      SkipCount: gridSetupData.gridDataRefinerValue.skipCount,
      MaxResultCount: gridSetupData.gridDataRefinerValue.pageSize,
      Filter: JSON.stringify(gridSetupData.gridDataRefinerValue.filter),
    };
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/payments/batch-details?serviceSubType=${serviceSubType}&batchId=${batchId}`
    , batchDetailGridSetupDto);
  }
  submitForApproval(data:any) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/payments` ,
      data
    );
  }
}
