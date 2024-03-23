import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { PendingApprovalGeneralTypeCode } from '../../enums/pending-approval-general-type-code.enum';
import { of } from 'rxjs';
/** External libraries **/

@Injectable({ providedIn: 'root' })
export class PendingApprovalGeneralService {
  /** Constructor **/
  constructor(
    private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider
  ) {}

  /** Public methods **/
  loadApprovalsGeneral() {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/general`
    );
  }

  loadCasereassignmentExpandedInfo(approvalId: any) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/general/case-reassignment?approvalId=${approvalId}`
    );
  }

  loadExceptionCard(exceptionId:string) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/general/exceptions?exceptionId=${exceptionId}`);
   }

  loadInvoiceListService(data: any) {
    const invoiceRequestDto = {
      SortType: data.sortType,
      Sorting: data.sort,
      SkipCount: data.skipCount,
      MaxResultCount: data.pageSize,
      Filter: JSON.stringify(data.filter),
    };
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/general/invoice-details?exceptionId=${data.exceptionId}`,
      invoiceRequestDto
    );
  }
  submitGeneralRequests(requests : any)
  {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/general/`,requests
    );
  }
  
  getMasterDetails(masterDetailId: string, subTypeCode: string) {
    if (subTypeCode == PendingApprovalGeneralTypeCode.Drug) {
      return this.http.get<any>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/drugs?drugId=${masterDetailId}`);
    } else if (subTypeCode == PendingApprovalGeneralTypeCode.InsurancePlan) {
      return this.http.get<any>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/insurance-plans?insurancePlanId=${masterDetailId}`);
    }
    return of();
  }
}
