/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** External libraries **/

/** Entities **/
import { LoginUser } from '@cms/system-config/domain';

/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientCase } from '../entities/client-case';




@Injectable({ providedIn: 'root' })
export class CaseManagerDataService {
      /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}


    loadCaseManagers(clientCaseId : string) {     
        return this.http.get<ClientCase[]>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/case-manager?ClientCaseId=${clientCaseId}`
        );   
    
    }

    removeCaseManager(clientCaseId : string)
    {
      return this.http.delete(
        `${this.configurationProvider.appSettings.caseApiUrl}`+
        `/case-management/case-manager/${clientCaseId}`
      );
    }

    assignCaseManager(clientCaseId : string ,  userId : string)
    {
      return this.http.patch(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/case-manager/${clientCaseId}/${userId}`,null
      );
    }

    updateCaseManagerStatus(clientCaseId : string ,  hasManager :string, needManager : string)
    {
      return this.http.put(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/case-manager/${clientCaseId}?hasManager=${hasManager}&needManager=${needManager}`,null
      );
    }

    getCaseManagerStatus(clientCaseId : string)
    {
      return this.http.get(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/case-manager/${clientCaseId}/manager-status`
      );
    }

    loadSelectedCaseManagerData(assignedCaseManagerId: string , clientCaseId : string) {     
      return this.http.get<LoginUser[]>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/case-manager/${clientCaseId}/manager-data/${assignedCaseManagerId}`
      );   
  
  }
  
}
