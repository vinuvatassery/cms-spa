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
      Filter: JSON.stringify(data.filter),
    };
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/approvals/imported-claims/`,
      importedClaimsRequestDto
    );
  }

  submitImportedClaimsServices(claims: any) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/approvals/imported-claims/submit`,
      claims
    );
  }

}
