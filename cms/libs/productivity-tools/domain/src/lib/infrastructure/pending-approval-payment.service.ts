import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class PendingApprovalPaymentService {
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}

  getAllPendingApprovalPaymentCount() {
    return this.http.get(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/pending-approvals/payments/count`
    );
  }

  getPendingApprovalPaymentGrid(gridSetupData: any, serviceSubType: string) {
    const paymentApprovalGridSetupDto = {
      SortType: gridSetupData.sortType,
      Sorting: gridSetupData.sort,
      SkipCount: gridSetupData.skipcount,
      MaxResultCount: gridSetupData.maxResultCount,
      Filter: gridSetupData.filter,
    };
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/pending-approvals/payments/serviceSubType=` +
        serviceSubType,
        paymentApprovalGridSetupDto
    );
  }

  loadBatchPaymentGrid(gridSetupData: any, batchId: string) {
    const paymentGridSetupDto = {
      SortType: gridSetupData.sortType,
      Sorting: gridSetupData.sort,
      SkipCount: gridSetupData.skipcount,
      MaxResultCount: gridSetupData.maxResultCount,
      Filter: gridSetupData.filter,
    };
    return this.http.post(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/pending-approvals/payments/payment-batches/${batchId}/payments`
    , paymentGridSetupDto);
  }
}