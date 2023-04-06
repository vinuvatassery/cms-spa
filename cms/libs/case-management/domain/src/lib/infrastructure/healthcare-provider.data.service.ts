/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  removeHealthCareProvider(clientId : number ,ProviderId : string, hardDelete : boolean)
  {
    const options = {
      body: {
        hardDelete: hardDelete,
      }
    }
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/${clientId}/providers`+
      `/${ProviderId}`, options
    );
  }

  reActivateHealthCareProvider(clientId : number ,ProviderId : string)
  {   
    return this.http.patch(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/healthcare-providers/${clientId}/providers/${ProviderId}`,null
    );
  }


  ///2
  loadProviderStatusStatus(clientId : number) {     
    return this.http.get<HealthcareProvider[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/${clientId}/provider-status`
    );
    
  }
  
  ///3
  updateHealthCareProvidersFlag(clientId : number, nohealthCareProviderFlag : string)
  {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/${clientId}/${nohealthCareProviderFlag}`     
    ,null);
  }



  ///4
  loadHealthCareProviders(clientId : number  , skipcount : number,maxResultCount : number ,sort : string, sortType : string, showDeactivated :boolean) {     
    return this.http.get<HealthcareProvider[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers?showDeactivated=${showDeactivated}&clientId=${clientId}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );
    
  }

  loadExistingHealthCareProvider(clientId : number  ,providerId :string) {   
      
    return this.http.get<HealthcareProvider[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/${clientId}/providers/${providerId}`
    );
    
  }


    ///1
    addExistingHealthCareProvider(existProviderData : any)
    {
      return this.http.post(
        `${this.configurationProvider.appSettings.caseApiUrl}`+
        `/case-management/healthcare-providers/${existProviderData?.clientId}/providers/${existProviderData?.providerId}/${existProviderData?.selectedProviderId}`,null
      );
    }
  
      //search for autocomplete
      searchProviders(text :  string , clientId : number) {
        return this.http.get<HealthcareProvider[]>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/healthcare-providers/${clientId}/providers/search/${text}`  
        );
      }  
 
}
