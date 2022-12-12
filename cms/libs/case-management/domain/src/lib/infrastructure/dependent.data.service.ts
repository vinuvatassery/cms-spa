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
      const data =
      {
        clientDependentId:"00000000-0000-0000-0000-000000000000",
        clientId: dependent.clientId,
        dependentTypeCode: DependentTypeCode.Dependent,
        relationshipCode:  dependent?.relationshipCode,
        firstName:  dependent?.firstName,
        lastName:  dependent?.lastName,
        ssn:  dependent?.ssn,
        dob:  dependent?.dob,
        enrolledInInsuranceFlag:  dependent?.enrolledInInsuranceFlag,
        concurrencyStamp: ""
      }
      
      return this.http.post(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents`,
        data
      );
    }
     
  //5get new dependent for edit 
  GetNewDependent(clientDependentId: string) {
    return this.http.get<Dependent>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/${clientDependentId}`      
    );
  }

  ///6update new dependent
  UpdateNewDependent(dependent: Dependent) {

    const data =
    {
      clientDependentId:dependent?.clientDependentId,
      clientId: dependent.clientId,
      dependentTypeCode: DependentTypeCode.Dependent,
      relationshipCode:  dependent?.relationshipCode,
      firstName:  dependent?.firstName,
      lastName:  dependent?.lastName,
      ssn:  dependent?.ssn,
      dob:  dependent?.dob,
      enrolledInInsuranceFlag:  dependent?.enrolledInInsuranceFlag,
      concurrencyStamp: dependent?.concurrencyStamp
    }
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents`,
      data
    );
  } 

 
    //7 mark dependent as inactive
  DeleteDependent(clientDependentId: string) {
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/${clientDependentId}`      
    );
  }

     ///8update client as dependent
     AddExistingDependent(data : any) {      
      return this.http.put(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/client/${data?.clientId}
        &dependentClientId=${data?.dependentClientId}&dependentType=${data?.dependentType}&relationshipCode=${data?.relationshipCode}&
        clientDependentId=${data?.clientDependentId}&deletedClientDependentId=${data.selectedClientDependentId}`,
        null
      );
    }

  //9get client dependent for edit (client)
  GetExistingClientDependent(clientDependentId: string , dependentType :  string) {
    return this.http.get<Dependent>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/client/clientDependentId=${clientDependentId}&dependentType=${dependentType}`  
    );
  }
   
  //10search for autocomplete
  SearchDependents(text :  string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/search/text=${text}`  
    );
  }
   
   

  loadDependentSearch() {
    return of([
      {
        firstName: 'Donna',
        lastName: 'Summer',       
        dob: '08-11-1995',
        ssn: '956-08-9876',  
        clientDependentId:'',
        clientId : 1,
        memberType: '',
        fullName:'',fullCustomName : ''
      },
      {
        firstName: 'Donna',
        lastName: 'Summer',       
        dob: '08-11-1995',
        ssn: '956-08-9876',        
        clientDependentId:'',
        clientId :2,
        memberType: '',
        fullName:'',fullCustomName : ''
      },
      {
        firstName: 'Donna',
        lastName: 'Summer',       
        dob: '08-11-1995',
        ssn: '956-08-9876',    
        clientDependentId:'',
        clientId : 3,
        memberType: '',
        fullName:'',fullCustomName : ''
      }
      ,
      {
        firstName: 'Donna',
        lastName: 'Summer',       
        dob: '08-11-1995',
        ssn: '956-08-9876',       
        clientDependentId:'a702f4b2-9032-4544-8998-029643760fad',
        clientId : 0,
        memberType: '',  fullName:'',fullCustomName : ''
      }
      ,
      {
        firstName: 'Donna',
        lastName: 'Summer',       
        dob: '08-11-1995',
        ssn: '956-08-9876',   
        clientDependentId:'f523d0e1-6229-4d86-b50a-01d6675ac337',
        clientId : 0,
        memberType: '',  fullName:'',fullCustomName : ''
      }
    ]);
  }

}
