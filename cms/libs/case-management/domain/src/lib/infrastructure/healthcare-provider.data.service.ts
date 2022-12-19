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

  ///1
  removeHealthCareProvider(ClientCaseEligibilityId : string,ProviderId : string)
  {
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/${ClientCaseEligibilityId}/providers`+
      `/${ProviderId}`
    );
  }


  ///2
  loadProviderStatusStatus(clientCaseEligibilityId : string) {     
    return this.http.get<HealthcareProvider[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/${clientCaseEligibilityId}/provider-status`
    );
    
  }
  
  ///3
  updateHealthCareProvidersFlag(ClientCaseEligibilityId : string, nohealthCareProviderFlag : string)
  {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/${ClientCaseEligibilityId}/${nohealthCareProviderFlag}`     
    ,null);
  }



  ///4
  loadHealthCareProviders(ClientCaseEligibilityId : string  , skipcount : number,maxResultCount : number ,sort : string, sortType : string) {     
    return this.http.get<HealthcareProvider[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers?clientCaseEligibilityId=${ClientCaseEligibilityId}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );
    
  }


    ///1
    addExistingHealthCareProvider(ClientCaseEligibilityId : string,ProviderId : string)
    {
      return this.http.post(
        `${this.configurationProvider.appSettings.caseApiUrl}`+
        `/case-management/healthcare-providers/${ClientCaseEligibilityId}/providers`+
        `/${ProviderId}`,null
      );
    }
  
      //search for autocomplete
      searchProviders(text :  string , clientCaseEligibilityId : string) {
        return this.http.get<HealthcareProvider[]>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/healthcare-providers/search/text=${text}&clientCaseEligibilityId=${clientCaseEligibilityId}`  
        );
      }  
 
}
