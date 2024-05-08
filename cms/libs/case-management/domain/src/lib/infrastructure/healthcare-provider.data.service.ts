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
  removeHealthCareProvider(clientProviderId : string, hardDelete : boolean)
  {
    const options = {
      body: {
        hardDelete: hardDelete,
      }
    }
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/healthcare-providers/${clientProviderId}`, options
    );
  }

  reActivateHealthCareProvider(clientProviderId : string)
  {   
    return this.http.patch(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/healthcare-providers/${clientProviderId}`,null
    );
  }


  ///2
  loadProviderStatus(clientId : number) {     
    return this.http.get<HealthcareProvider[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/${clientId}/provider-status`
    );
    
  } 


  ///3
  updateHealthCareProvidersFlag(clientId : number, nohealthCareProviderFlag : string, saveContinueFlag : string)
  {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers/${clientId}/${nohealthCareProviderFlag}/${saveContinueFlag}`     
    ,null);
  }


  loadProviderCerStatus(clientCaseEligibilityId : string) {     
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/healthcare-providers/cer/${clientCaseEligibilityId}/status`
    );    
  } 

  updateHealthCareProvidersCerFlag(clientCaseEligibilityId : string, healthCareProviderCerFlag : string)
  {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/healthcare-providers/cer/${clientCaseEligibilityId}/${healthCareProviderCerFlag}`,null);
  }


  ///4
  loadHealthCareProviders(clientId : number  , skipcount : number,maxResultCount : number ,sort : string, sortType : string, showDeactivated :boolean) {     
    return this.http.get<HealthcareProvider[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/healthcare-providers?showDeactivated=${showDeactivated}&clientId=${clientId}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );
    
  }

  loadExistingHealthCareProvider(clientProviderId :string) {   
      
    return this.http.get<HealthcareProvider[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/healthcare-providers/${clientProviderId}`
    );
    
  }


    ///1
    addExistingHealthCareProvider(existProviderData : any)
    {
      return this.http.post(
        `${this.configurationProvider.appSettings.caseApiUrl}`+
        `/case-management/healthcare-providers/?clientId=${existProviderData?.clientId}&selectedVendorAddressId=${existProviderData?.selectedVendorAddressId}&vendorAddressId=${existProviderData?.vendorAddressId}`,null
      );
    }
  
      //search for autocomplete
      searchProviders(text :  string , clientId : number) {
        return this.http.get<HealthcareProvider[]>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/healthcare-providers/search/?clientId=${clientId}&providerName=${text}`  
        );
      }  
 
}
