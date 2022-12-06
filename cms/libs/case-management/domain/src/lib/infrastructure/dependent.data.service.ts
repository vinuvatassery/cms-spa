/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';

/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';

/**Models */
import { Dependent } from '../entities/dependent';

@Injectable({ providedIn: 'root' })
export class DependentDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/

  loadDependents(clientId : number , skipcount : number,maxResultCount : number ,sort : string, sortType : string) {     
    return this.http.get<Dependent[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-dependents?ClientId=${clientId}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );
    
  }

  loadDependentsStatus(clientCaseEligibilityId : string) {     
    return this.http.get<Dependent[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-dependents/${clientCaseEligibilityId}/dependent-status`
    );
    
  }

  updateDependentStatus(clientCaseEligibilityId : string ,hasDependentsStatus : string)
  {
    return this.http.patch(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-dependents/${clientCaseEligibilityId}/${hasDependentsStatus}`
      ,null);
  }

  AddExistngDependent(dependentId: string , dependentType: string) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents?dependentId=${dependentId}&dependentType=${dependentType}`,
      null
    );
  }

  UpdateNewDependent(dependent: Dependent) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents`,
      dependent
    );
  }

  AddNewDependent(dependent: Dependent) {    
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents`,
      dependent
    );
  }

  GetNewDependent(dependentId: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents?dependentId=${dependentId}`      
    );
  }

  DeleteDependent(dependentId: string) {
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/${dependentId}`      
    );
  }

  loadDependentSearch() {
    return of([
      {
        name: 'Donna Summer',
        id: 'XXXX',
        dob: '08-11-1995',
        ssn: '956-08-9876',
        memberType: 'CA/OHOP Family/Household Members',
      },
      {
        name: 'David Miller',
        id: 'XXXX',
        dob: '06-18-1992',
        ssn: '406-90-3456',
        memberType: 'CA/OHOP Family/Household Members',
      },
      {
        name: 'Philip David',
        id: 'XXXX',
        dob: '08-21-1991',
        ssn: '136-63-8736',
        memberType: 'CA/OHOP Family/Household Members',
      },
      {
        name: 'Mike Flex',
        id: 'XXXX',
        dob: '02-24-1990',
        ssn: '890-75-9876',
        memberType: 'CA/OHOP Family/Household Members',
      },
      {
        name: 'Donna Summer',
        id: 'XXXX',
        dob: '08-11-1995',
        ssn: '956-08-9876',
        memberType: 'Clients',
      },
      {
        name: 'David Miller',
        id: 'XXXX',
        dob: '06-18-1992',
        ssn: '406-90-3456',
        memberType: 'Clients',
      },
      {
        name: 'Philip David',
        id: 'XXXX',
        dob: '08-21-1991',
        ssn: '136-63-8736',
        memberType: 'Clients',
      },
      {
        name: 'Mike Flex',
        id: 'XXXX',
        dob: '02-24-1990',
        ssn: '890-75-9876',
        memberType: 'Clients',
      },
    ]);
  }



  loadDdlRelationships() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadFamilyDependents() {
    return of([
      {
        name: 'Donna Summer',
        id: 'XXXX',
        dob: '10-10-1995',
        ssn: '001-01-0001',
      },
      {
        name: 'David Miller',
        id: 'XXXX',
        dob: '10-10-1995',
        ssn: '002-02-0002',
      },
      {
        name: 'Philip David',
        id: 'XXXX',
        dob: '10-10-1995',
        ssn: '003-03-0003',
      },
      { name: 'Mike Flex', id: 'XXXX', dob: '10-10-1995', ssn: '004-04-0004' },
    ]);
  }
}
