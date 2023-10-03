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
      SortType: gridSetupData.sortType,
      Sorting: gridSetupData.sort,
      SkipCount: gridSetupData.skipcount,
      MaxResultCount: gridSetupData.maxResultCount,
      Filter: gridSetupData.filter,
    };
    let url = `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/pending-approvals/payments/serviceSubType=${serviceSubType}/level=${level}`;
    return this.http.post<any>(url, paymentApprovalGridSetupDto);
  }

  getPendingApprovalPaymentMainList(gridSetupData: any, serviceSubType: string, level: number) {
    const paymentApprovalGridSetupDto = {
      SortType: gridSetupData.sortType,
      Sorting: gridSetupData.sort,
      SkipCount: gridSetupData.skipCount,
      MaxResultCount: gridSetupData.pagesize,
      Filter: gridSetupData.filter,
    };
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/pending-approvals/payments/serviceSubType=${serviceSubType}/level=${level}`,
        paymentApprovalGridSetupDto
    );
  }

  loadSubmittedSummary(paymentRequestBatchIds: string[]) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/pending-approvals/payments/summary` ,
      paymentRequestBatchIds
    );
  }
}