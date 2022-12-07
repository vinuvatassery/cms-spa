/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';

/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';

/**Models */
import { Dependent } from '../entities/dependent';
import { DependentTypeCode } from '../enums/dependent-type.enum';
import { LovType } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class DependentDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/

   ///1load dependents for grid
  loadDependents(clientId : number , skipcount : number,maxResultCount : number ,sort : string, sortType : string) {     
    return this.http.get<Dependent[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-dependents?ClientId=${clientId}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}&LovTypeCode=${LovType.RelationshipCode}`
    );
    
  }

     ///2load dependent status  for checkbox
  loadDependentsStatus(clientCaseEligibilityId : string) {     
    return this.http.get<Dependent[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-dependents/${clientCaseEligibilityId}/dependent-status`
    );
    
  }
 
     ///3update dependent status  for checkbox
  updateDependentStatus(clientCaseEligibilityId : string ,hasDependentsStatus : string)
  {
    return this.http.patch(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-dependents/${clientCaseEligibilityId}/${hasDependentsStatus}`
      ,null);
  }  


     ///4add new dependent
     AddNewDependent(dependent: Dependent) {    
      return this.http.post(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents`,
        dependent
      );
    }
     
  //5get new dependent for edit 
  GetNewDependent(clientDependentId: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents?dependentId=${clientDependentId}`      
    );
  }

  ///6update new dependent
  UpdateNewDependent(dependent: Dependent) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents`,
      dependent
    );
  } 

 
    //7 mark dependent as inactive
  DeleteDependent(clientDependentId: string) {
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/${clientDependentId}`      
    );
  }

     ///8update client as dependent
     AddExistngDependent(clientId: string ,clientDependentId : string , dependentType: string) {
      return this.http.patch(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/client?clientId=${clientId}`,
        null
      );
    }

  //9get client dependent for edit (client)
  GetExistingClientDependent(clientId: string , dependentType :  string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/client?clientId=${clientId}`  
    );
  }
   
  //12search for autocomplete
  SearchDependents(text :  string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/search?text=${text}`  
    );
  }
   
   

  loadDependentSearch() {
    return of([
      {
        firstName: 'Donna',
        lastName: 'Summer',       
        dob: '08-11-1995',
        ssn: '956-08-9876',
        dependentTypeCode: 'D',      
        clientId: 0,
        memberType: '',
        fullName:'',fullCustomName : ''
      },
      {
        firstName: 'Donna',
        lastName: 'Summer',       
        dob: '08-11-1995',
        ssn: '956-08-9876',
        dependentTypeCode: 'C',       
        clientId: 3,
        memberType: '',
        fullName:'',fullCustomName : ''
      },
      {
        firstName: 'Donna',
        lastName: 'Summer',       
        dob: '08-11-1995',
        ssn: '956-08-9876',
        dependentTypeCode: 'C',        
        clientId: 5
        ,
        memberType: '',
        fullName:'',fullCustomName : ''
      }
      ,
      {
        firstName: 'Donna',
        lastName: 'Summer',       
        dob: '08-11-1995',
        ssn: '956-08-9876',
        dependentTypeCode: 'D',        
        clientId: 0,
        memberType: '',  fullName:'',fullCustomName : ''
      }
      ,
      {
        firstName: 'Donna',
        lastName: 'Summer',       
        dob: '08-11-1995',
        ssn: '956-08-9876',
        dependentTypeCode: 'D',       
        clientId: 0,
        memberType: '',  fullName:'',fullCustomName : ''
      }
    ]);
  }

}
