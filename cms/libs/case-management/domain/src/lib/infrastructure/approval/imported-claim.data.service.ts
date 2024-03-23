import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
/** External libraries **/

@Injectable({ providedIn: 'root' })
export class ImportedClaimService {
  /** Constructor **/
  constructor(
    private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider
  ) {}

  /** Public methods **/
  loadImportedClaimsListServices(data: any) {
    const importedClaimsRequestDto = {
      SortType: data.sortType,
      Sorting: data.sort,
      SkipCount: data.skipCount,
      MaxResultCount: data.pageSize,
      ColumnName : data.columnName,
      Filter: JSON.stringify(data.filter),
    };
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/imported-claims/claims-data`,
      importedClaimsRequestDto
    );
  }

  submitImportedClaimsServices(claims: any) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/imported-claims/submit`,
      claims
    );
  }


  loadPossibleMatch(event:any) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/imported-claims/possible-match`,event
    );
  }

  savePossibleMatch(requests : any)
  {
    const savePossibleMatchDto = {
      ClientId : requests.clientId,
      PolicyId : requests.policyId,
      InvoiceExceptionId : requests.invoiceExceptionId,
      ClaimId : requests.claimId,
      ServiceDate : requests.serviceDate,
      IsPossibleMatch : requests.isPossibleMatch,
      EntityTypeCode : requests.entityTypeCode
    };
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/imported-claims/possible-match/`,savePossibleMatchDto
    );
  }

  makeExceptionForExceedBenefits(exceptionObject: any){
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/imported-claims/make-exception/`,
      exceptionObject
    );
  }

  updateClientPolicy(importedclaimDto : any){
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/imported-claims/client-policy`,
      importedclaimDto
    );
  }

  loadClientBySearchText(text: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/imported-claims/SearchText=${text}`
    );
  }
}
