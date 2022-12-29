/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Case } from '../entities/case';
import { Program } from '../entities/program';

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
}
