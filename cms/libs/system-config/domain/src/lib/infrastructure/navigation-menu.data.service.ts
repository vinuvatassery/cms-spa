/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Internal libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { NavigationMenu } from '../entities/navigation-menu';

@Injectable({ providedIn: 'root' })
export class NavigationMenuService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/
  getNavigationMenu() {
    return this.http.get<NavigationMenu[]>(
        `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
        `/system-config/menu`
    );
  }

  pcaReassignmentCount(){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-reassignments/count`
    )
  }

  getPendingApprovalPaymentCount(data:any) {
    const request =
    {
      PaymentRequests : data
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/payments/count`,request);
  }

  getPendingApprovalGeneralCount() {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/general/count`
    );
  }

  getPendingApprovalImportedClaimCount() {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/imported-claims/count`
    );
  }
}
