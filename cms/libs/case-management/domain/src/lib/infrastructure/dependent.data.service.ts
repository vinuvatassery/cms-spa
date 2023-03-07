/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';


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
  addNewDependent(dependent: Dependent) {
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
  getNewDependent(clientDependentId: string) {
    return this.http.get<Dependent>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/${clientDependentId}`
    );
  }

  ///6update new dependent
  updateNewDependent(dependent: Dependent) {

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
  deleteDependent(clientDependentId: string) {
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/${clientDependentId}`
    );
  }

  ///8update client as dependent
     addExistingDependent(data : any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/client`,
      data
    );
  }

  //9get client dependent for edit (client)
  getExistingClientDependent(clientDependentId: string , dependentType :  string) {
    return this.http.get<Dependent>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/client/clientDependentId=${clientDependentId}&dependentType=${dependentType}`
    );
  }

  //10search for autocomplete
  searchDependents(text :  string , clientId : number) {
    const data =
    {
      text: text,
      clientId:clientId
    }

    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/search`,
      data
    );
  }

  loadClientDependents(clientId: any) {
    return this.http.get<Array<Dependent>>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/client/${clientId}`
    );
  }

  uploadDependentProofOfSchool(dependentProof:any){
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/proofofschool`,
      dependentProof
    );
  }

  saveAndContinueDependents(clientId:number, clientCaseEligibilityId : string, hasDependentsStatus : string){
    return this.http.patch(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-dependents/${clientId}/${clientCaseEligibilityId}/${hasDependentsStatus}`,null
    );
  }
}
