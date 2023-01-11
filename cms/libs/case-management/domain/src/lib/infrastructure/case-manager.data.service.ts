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


    loadCaseManagers(caseId : string) {     
        return this.http.get<ClientCase[]>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/case-managers?caseId=${caseId}`
        );   
    
    }

    removeCaseManager(caseId : string)
    {
      return this.http.delete(
        `${this.configurationProvider.appSettings.caseApiUrl}`+
        `/case-management/case-managers/${caseId}`
      );
    }

    assignCaseManager(caseId : string ,  userId : string)
    {
      return this.http.patch(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/case-managers/${caseId}/${userId}`,null
      );
    }

    updateCaseManagerStatus(caseId : string ,  hasManager :string, needManager : string)
    {
      return this.http.put(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/case-managers/${caseId}?hasManager=${hasManager}&needManager=${needManager}`,null
      );
    }

    getCaseManagerStatus(caseId : string)
    {
      return this.http.get(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/case-managers/${caseId}/manager-status`
      );
    }

    loadSelectedCaseManagerData(assignedCaseManagerId: string , caseId : string) {     
      return this.http.get<LoginUser[]>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/case-managers/${caseId}/${assignedCaseManagerId}`
      );   
  
  }
  
}
