/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';

/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';

/**Models */
import { HealthcareProvider } from '../entities/healthcare-provider';

@Injectable({ providedIn: 'root' })
export class HealthcareProviderDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,
              private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/
  loadHealthCareProviders(ClientCaseEligibilityId : string) {     
    return this.http.get<HealthcareProvider[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/${ClientCaseEligibilityId}`
    );
    
  }

  removeHealthCareProvider(ClientCaseEligibilityId : string,ProviderId : string)
  {
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/${ClientCaseEligibilityId}/providers`+
      `/${ProviderId}`
    );
  }

  UpdateHealthCareProvidersFlag(ClientCaseEligibilityId : string, nohealthCareProviderFlag : string)
  {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/clientCaseEligibilityId=${ClientCaseEligibilityId}`+
      `&nohealthCareProviderFlag=${nohealthCareProviderFlag}`     
    ,null);
  }

  loadDdlStates() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }
}
