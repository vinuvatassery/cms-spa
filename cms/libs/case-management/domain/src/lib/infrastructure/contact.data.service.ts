/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientAddress, ContactInfo, FriendsOrFamilyContactClientProfile } from '../entities/contact';
import { GridFilterParam } from '../entities/grid-filter-param';

@Injectable({ providedIn: 'root' })
export class ContactDataService {


  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) { }

  /** Public methods **/

  loadDdlIncomeTypes() {
    return of(['Work', 'Self-employment', 'Unemployment Insurance', 'Supplemental Security Income (SSI)',
      'Social Security Disability Insurance (SSDI)',
      ' Pension/Retirement/Veterans Benefits',
      'Short/Long-term Disability',
      'Alimony/Child Support',
      'Rental Income',
      'Other Income',

    ]);
  }

  loadDdlIncomeSources() {
    return of([
      'Client',
      'Other Family member'
    ]);
  }

  loadDdlFrequencies() {
    return of(['Once',
      'Daily',
      'Weekly',
      'Bi-weekly',
      'Semi-monthly',
      'Monthly',
      'Quarterly',
      'Annually',
      'YTD']);
  }

  loadDdlProofOfIncomeTypes() {
    return of(['Value 1', 'Value 2', 'Value 3', 'other']);
  }

  loadIncomes(clientId: string, clientCaseEligibilityId: string,gridFilterParam:GridFilterParam, isCerForm: boolean = false) {  
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/eligibilities/${clientCaseEligibilityId}/income?isCerForm=${isCerForm}`,gridFilterParam);
  }

  loadDependentsProofofSchools() {
    return of([
      {
        Name: 'John Wick',
        Age: '32',
        Relationship: '$1000.00',
      },
    ]);
  }

  loadDdlStates() {
    return of(['AL', 'AK', 'AZ', 'AR', 'NM']);
  }

  loadDdlCountries() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlRelationships() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlPreferredContactMethods() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadAddresses(): Observable<any[]> {
    return of([
      {
        id: 1,
        type: 'Home',
        address1: '1700 Boulevard Blvd',
        address2: 'Box 703',
        city: 'Portland',
        state: 'OR',
        zip: '000000',
        county: 'Washington',
        effectiveDate: 'XX-XX-XXXX',
      },
      {
        id: 2,
        type: 'Office',
        address1: '2400 Boulevard Blvd',
        address2: 'Box 450',
        city: 'Portland',
        state: 'OR',
        zip: '000000',
        county: 'Washington',
        effectiveDate: 'XX-XX-XXXX',
      },
    ]);
  }

  loadDdlAddressTypes() {
    return of(['Home', 'UnHoused']);
  }

  loadDdlPhoneTypes() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlRelationshipToClient() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadFriendsorFamily(clientId: any, eligibilityId:any) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/eligibility-periods/${eligibilityId}/contacts`);
  }

  loadContactInfo(clientId: number, clientCaseEligibilityId: string, prevClientCaseEligibilityId:string) {
    return this.http.get<ContactInfo>(`${this.getUrl(clientId, clientCaseEligibilityId)}&prvEligibilityId=${prevClientCaseEligibilityId}`);
  }

  createContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfo: ContactInfo) {
    const fd = new FormData();
    if (contactInfo?.homeAddressProof?.document) {
      fd.append('AddressProofDocument', contactInfo?.homeAddressProof?.document ?? null, contactInfo?.homeAddressProof?.document?.name);
    }
    this.formDataAppendObject(fd, contactInfo);

    return this.http.post(this.getUrl(clientId, clientCaseEligibilityId)
      , fd, { reportProgress: true, });
  }

  createAddress(clientId: number, clientCaseEligibilityId: string, clientAddress: ClientAddress) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/addresses?clientEligibilityId=${clientCaseEligibilityId}`,
      clientAddress);
  }

  updateAddress(clientId: number, clientCaseEligibilityId: string, clientAddress: ClientAddress) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/addresses?clientEligibilityId=${clientCaseEligibilityId}`,
      clientAddress);
  }

  updateContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfo: ContactInfo) {
    const fd = new FormData();
    if (contactInfo?.homeAddressProof?.document) {
      fd.append('AddressProofDocument', contactInfo?.homeAddressProof?.document ?? null, contactInfo?.homeAddressProof?.document?.name);
    }
    this.formDataAppendObject(fd, contactInfo);

    return this.http.put(this.getUrl(clientId, clientCaseEligibilityId)
      , fd, { reportProgress: true, });
  }

  /** Private methods **/
  private getUrl(clientId: number, clientCaseEligibilityId: string) {

    return `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/contact-info?clientElgbltyId=${clientCaseEligibilityId}`
  }

  saveIncome(clientId: any, clientIncome: any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/income`, clientIncome);
  }

  updateNoIncomeData(clientCaseEligibilityId: any, noIncomeData: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/eligibility-periods/${clientCaseEligibilityId}/income`, noIncomeData);
  }

  formDataAppendObject(fd: FormData, obj: any, key?: any) {
    let i, k;
    for (i in obj) {
      k = key ? key + '[' + i + ']' : i;
      if (obj[i] instanceof File) {
        continue;
      }
      else if (typeof obj[i] == 'object') {
        this.formDataAppendObject(fd, obj[i], k);
      }
      else {
        fd.append(k, obj[i]);

      }
    }
  }

  editIncome(clientId: any, clientIncomeId: any, clientIncome: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/income/${clientIncomeId}`, clientIncome);

  }

  deleteIncome(clientIncomeId: string, clientId: any) {
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/income/${clientIncomeId}`,);
  }

  loadIncomeDetailsService(clientId: any, clientIncomeId: any) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/income/${clientIncomeId}`,);

  }

  getClientAddress(clientId: any) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/addresses`);
  }

  deleteClientAddress(clientId: any, clientAddressId: any) {
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/addresses/${clientAddressId}`);
  }

  deactivateClientAddress(clientId: any, clientAddressId: any) {
    let clientAddress = {
      ClientId: clientId,
      ClientAddressId: clientAddressId
    }
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/client-address/deactivate`, clientAddress);
  }

  /////email services NOSONAR
  loadClientEmails(clientId: number, clientCaseEligibilityId: string, skipcount: number, maxResultCount: number, sort: string, sortType: string, showDeactivated: boolean) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/${clientId}/emails?clientCaseEligibilityId=${clientCaseEligibilityId}&showDeactivated=${showDeactivated}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );

  }

  loadClientEmail(clientId: number, clientEmailId: string, clientCaseEligibilityId: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/${clientId}/emails/${clientEmailId}/${clientCaseEligibilityId}`
    );

  }

  loadClientPaperLessStatus(clientId: number | undefined, clientCaseEligibilityId: string | undefined) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/${clientId}/emails/${clientCaseEligibilityId}`
    );

  }

  saveEmail(emailData: any) {
    if (emailData?.clientEmailId) {
      return this.http.put(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${emailData?.clientId}/emails`,
        emailData
      )
    }
    else {
      emailData.clientEmailId = '00000000-0000-0000-0000-000000000000'
      return this.http.post(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${emailData?.clientId}/emails`,
        emailData
      )
    }
  }

  updateClientEmailPreferred(clientId: number, clientEmailId: string) {
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/emails/${clientEmailId}`, null
    );

  }

  removeClientEmail(clientId: number, clientEmailId: string, hardDelete: boolean) {
    const options = {
      body: {
        hardDelete: hardDelete,
      }
    }
    return this.http.delete<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/emails/${clientEmailId}`, options
    );
  }
  /////email services NOSONAR

  loadClientPhones(clientId: number, skipcount: number, maxResultCount: number, sort: string, sortType: string, showDeactivated: boolean) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/${clientId}/phones?showDeactivated=${showDeactivated}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );

  }

  loadClientPhone(clientId: number, clientPhoneId: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/${clientId}/phones/${clientPhoneId}`
    );

  }

  savePhone(phoneData: any) {
    if (phoneData?.clientPhoneId) {
      return this.http.put(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${phoneData?.clientId}/phones`,
        phoneData
      )
    }
    else {
      phoneData.clientPhoneId = '00000000-0000-0000-0000-000000000000'
      return this.http.post(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${phoneData?.clientId}/phones`,
        phoneData
      )
    }
  }

  updateClientPhonePreferred(clientId: number, clientPhoneId: string) {
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/phones/${clientPhoneId}`, null
    );

  }

  removeClientPhone(clientId: number, clientPhoneId: string, hardDelete: boolean) {
    const options = {
      body: {
        hardDelete: hardDelete,
      }
    }
    return this.http.delete<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/phones/${clientPhoneId}`, options
    );

  }

  createContact(clientId: number, clientContact: FriendsOrFamilyContactClientProfile) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/contacts`, clientContact);
  }
  updateContact(clientId: number, clientContact: FriendsOrFamilyContactClientProfile) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/contacts`, clientContact);
  }
  deleteClientContact(clientId: any, clientRelationshipId: any) {
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/contacts/${clientRelationshipId}`);
  }

  deactivateAndAddClientPhone(phoneData: any) {
    phoneData.clientPhoneId = '00000000-0000-0000-0000-000000000000'
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${phoneData?.clientId}/phones/deactivate-and-add`,
      phoneData
    )
  }

  loadEmployers(employerName : string) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/employers/employerName=${employerName}`);
  }

  addEmployer(employerName : string) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/employer/${employerName}`, employerName);
  }

  loadEmployerIncomes(clientId: string, eligibilityId: string){
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/eligibilities/${eligibilityId}/employer-income`);
  }
}
