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

  private baseUrl = "/case-management";

  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) { }

  /** Public methods **/

  ///1load dependents for grid
  loadDependents(eligibilityId: string, clientId: number, skipcount: number, maxResultCount: number, sort: string, sortType: string, type: string = 'All') {
    return this.http.get<Dependent[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl +
      `/eligibility-periods/${eligibilityId}/dependents?ClientId=${clientId}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}&LovTypeCode=${LovType.RelationshipCode}&Type=${type}`
    );

  }

  loadPreviousRelations(previousEligibilityId: string, clientId: number) {
    return this.http.get<Dependent[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl +
      `/clients/${clientId}/eligibility-periods/${previousEligibilityId}/dependents`
    );
  }

  updateFamilyChangedStatus(previousEligibilityId: string, friendFamilyChangedFlag: string) {
    return this.http.patch(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl +
      `/eligibility-periods/${previousEligibilityId}/has-family-change?friendFamilyChangedFlag=${friendFamilyChangedFlag}`
      , null);
  }

  updateAdditionalFamilyStatus(previousEligibilityId: string, hasAdditionalFamilyFlag: string) {
    return this.http.patch(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl +
      `/eligibility-periods/${previousEligibilityId}/has-additional-family?hasAdditionalFamilyFlag=${hasAdditionalFamilyFlag}`
      , null);
  }

  ///2load dependent status  for checkbox
  loadDependentsStatus(eligibilityId: string) {
    return this.http.get<Dependent[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl +
      `/eligibility-periods/${eligibilityId}/dependent-status`
    );

  }

  ///3update dependent status  for checkbox
  updateDependentStatus(eligibilityId: string, hasDependentsStatus: string) {
    return this.http.patch(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl +
      `/eligibility-periods/${eligibilityId}/dependent-status?hasDependentsStatus=${hasDependentsStatus}`
      , null);
  }

  updateEligibilityStatusDetails(eligibilityId: string, request: any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl +
      `/eligibility-periods/${eligibilityId}/dependent-status`
      , request);
  }


  ///4add new dependent
  addNewDependent(eligibilityId: string, dependent: Dependent) {
    const data =
    {
      clientDependentId: "00000000-0000-0000-0000-000000000000",
      clientId: dependent.clientId,
      dependentTypeCode: DependentTypeCode.Dependent,
      relationshipCode: dependent?.relationshipTypeCode,
      firstName: dependent?.firstName,
      lastName: dependent?.lastName,
      ssn: dependent?.ssn,
      dob: dependent?.dob,
      enrolledInInsuranceFlag: dependent?.enrolledInInsuranceFlag,
      concurrencyStamp: "",
      clientCaseEligibilityId: dependent.clientCaseEligibilityId,
    }

    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl + `/eligibility-periods/${eligibilityId}/dependents`,
      data
    );
  }

  //5get new dependent for edit
  getNewDependent(eligibilityId: string, clientDependentId: string) {
    return this.http.get<Dependent>(
      `${this.configurationProvider.appSettings.caseApiUrl}${this.baseUrl}/eligibility-periods/${eligibilityId}/dependents/${clientDependentId}`
    );
  }

  ///6update new dependent
  updateNewDependent(eligibilityId: string, dependent: Dependent) {

    const data =
    {
      clientDependentId: dependent?.clientRelationshipId,
      clientId: dependent.clientId,
      dependentTypeCode: DependentTypeCode.Dependent,
      relationshipCode: dependent?.relationshipTypeCode,
      firstName: dependent?.firstName,
      lastName: dependent?.lastName,
      ssn: dependent?.ssn,
      dob: dependent?.dob,
      enrolledInInsuranceFlag: dependent?.enrolledInInsuranceFlag,
      concurrencyStamp: dependent?.concurrencyStamp
    }
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}${this.baseUrl}/eligibility-periods/${eligibilityId}/dependents/${dependent.clientRelationshipId}`,
      data
    );
  }


  //7 mark dependent as inactive
  deleteDependent(eligibilityId: string, clientDependentId: string, isCER: boolean = false, status?: string) {
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}${this.baseUrl}/eligibility-periods/${eligibilityId}/dependents/${clientDependentId}?IsCER=${isCER}&Status=${status}`
    );
  }

  ///8update client as dependent
  addExistingDependent(eligibilityId: string, data: any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}${this.baseUrl}/eligibility-periods/${eligibilityId}/dependents`,
      data
    );
  }

  //9get client dependent for edit (client)
  getExistingClientDependent(eligibilityId: string, clientDependentId: string, dependentType: string) {
    return this.http.get<Dependent>(
      `${this.configurationProvider.appSettings.caseApiUrl}${this.baseUrl}/eligibility-periods/${eligibilityId}/dependents/${clientDependentId}?dependentType=${dependentType}`
    );
  }

  //10search for autocomplete
  searchDependents(text: string, clientId: number) {
    const data =
    {
      text: text,
      clientId: clientId
    }

    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}${this.baseUrl}/clients/search`,
      data
    );
  }

  loadClientDependents(clientId: any,caseEligibilityId:any) {
    return this.http.get<Array<Dependent>>(
      `${this.configurationProvider.appSettings.caseApiUrl}${this.baseUrl}/clients/${clientId}/relationships/?eligibilityId=${caseEligibilityId}`
    );
  }

  uploadDependentProofOfSchool(eligibilityId: string, dependentId: string, dependentProof: any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}${this.baseUrl}/eligibility-periods/${eligibilityId}/dependents/${dependentId}/proofofschool`,
      dependentProof
    );
  }

  uploadDependentProofOfSchoolClientsAttachment(clientAttachmentDetail: any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}${this.baseUrl}/eligibility-periods/dependents/proof-of-school/upload`,
      clientAttachmentDetail
    );
  }

  saveAndContinueDependents(clientId: number, clientCaseEligibilityId: string, request: any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}${this.baseUrl}/clients/${clientId}/eligibility-periods/${clientCaseEligibilityId} `,
      request
    );
  }
}
