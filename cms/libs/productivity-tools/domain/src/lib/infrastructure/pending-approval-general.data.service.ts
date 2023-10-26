import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
/** External libraries **/

@Injectable({ providedIn: 'root' })
export class PendingApprovalGeneralService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  loadApprovalsGeneral() {
   return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/approvals/general`);
  }

  loadCasereassignmentExpandedInfo(approvalId : any)
  {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/approvals/general/case-reassignment?approvalId=${approvalId}`
    );
  }

  loadExceedMaxBenefitCard(exceptionId:string) {
    return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/approvals/general/exceptions?exceptionId=${exceptionId}`);
   }

   loadInvoiceListService(data:any){
    const invoiceRequestDto =
    {
      SortType : data.sortType,
      Sorting : data.sort,
      SkipCount : data.skipCount,
      MaxResultCount : data.pageSize,
      Filter : JSON.stringify(data.filter)
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/approvals/general/invoice-details?exceptionId=${data.exceptionId}`,invoiceRequestDto
    );
  }
}
