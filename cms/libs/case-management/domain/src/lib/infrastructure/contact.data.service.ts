/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ContactInfo } from '../entities/contact';

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

  loadIncomes(clientId: string, clientCaseEligibilityId: string,skip:any,pageSize:any, sortBy:any, sortType:any) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/income/?clientCaseEligibilityId=${clientCaseEligibilityId}&SkipCount=${skip}&MaxResultCount=${pageSize}&Sorting=${sortBy}&SortType=${sortType}`);
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

  loadPhoneNumbers(): Observable<any[]> {
    return of([
      {
        id: 1,
        type: 'Home',
        phoneNumber: '(000)-000-0000',
        detailedMessages: 'Yes',
        smsText: 'Yes',
        note: 'Lorem ipsum note for the phone',
        effectiveDate: 'XX-XX-XXXX',
      },
      {
        id: 2,
        type: 'Office',
        phoneNumber: '(000)-000-0000',
        detailedMessages: 'No',
        smsText: 'No',
        note: 'Lorem ipsum note for the phone',
        effectiveDate: 'XX-XX-XXXX',
      },
    ]);
  }

  loadDdlPhoneTypes() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadEmailAddresses(): Observable<any[]> {
    return of([
      {
        id: 1,
        emailAddress: 'example@email.com',
        detailedMessages: 'Yes',
        goPaperless: 'Yes',
        effectiveDate: 'XX-XX-XXXX',
      },
    ]);
  }

  loadDdlRelationshipToClient() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadFriendsorFamily() {
    return of([
      {
        name: 'David Nainan',
        relationship: 'Spouse',
        phoneNumber: '(000)-000-0000',
        effectiveDate: 'XX-XX-XXXX',
      },
    ]);
  }



  loadContactInfo(clientId: number, clientCaseEligibilityId: string) {
    return this.http.get<ContactInfo>(this.getUrl(clientId, clientCaseEligibilityId));
  }

  createContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfo: ContactInfo) {
    const fd = new FormData();
    if (contactInfo?.homeAddressProof?.document) {
      fd.append('AddressProofDocument', contactInfo?.homeAddressProof?.document ?? '', contactInfo?.homeAddressProof?.document?.name);
    }
    this.formDataAppendObject(fd, contactInfo);

    return this.http.post(this.getUrl(clientId, clientCaseEligibilityId)
      , fd, { reportProgress: true, });
  }

  updateContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfo: ContactInfo) {
    const fd = new FormData();
    if (contactInfo?.homeAddressProof?.document) {
      fd.append('AddressProofDocument', contactInfo?.homeAddressProof?.document ?? '', contactInfo?.homeAddressProof?.document?.name);
    }
    this.formDataAppendObject(fd, contactInfo);

    return this.http.put(this.getUrl(clientId, clientCaseEligibilityId)
      , fd, { reportProgress: true, });
  }

  /** Private methods **/
  private getUrl(clientId: number, clientCaseEligibilityId: string) {

    return `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/contact-info?clientElgbltyId=${clientCaseEligibilityId}`
  }

  saveIncome(clientId : any, clientIncome: any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/income`, clientIncome);
  }

  updateNoIncomeData(clientCaseEligibilityId : any, noIncomeData: any) {
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

  editIncome(clientId : any, clientIncomeId : any, clientIncome: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/income/${clientIncomeId}`, clientIncome);

  }

  deleteIncome(clientIncomeId : string, clientId : any){
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/income/${clientIncomeId}`,);
  }

  loadIncomeDetailsService(clientId : any, clientIncomeId:any){
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/income/${clientIncomeId}`,);

  }


  loadClientPhones(clientId : number  , skipcount : number,maxResultCount : number ,sort : string, sortType : string,showDeactivated : boolean) {     
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/clients/${clientId}/phones?showDeactivated=${showDeactivated}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );
    
  }

  loadClientPhone(clientId : number  , clientPhoneId : string) {     
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/clients/${clientId}/phones/${clientPhoneId}`
    );
    
  }
  
  savePhone(phoneData: any) {  
      if(phoneData?.clientPhoneId)
      {
          return this.http.put(
            `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${phoneData?.clientId}/phones`,
            phoneData
          )
      }
      else
      {        
        phoneData.clientPhoneId ='00000000-0000-0000-0000-000000000000'
          return this.http.post(
            `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${phoneData?.clientId}/phones`,
            phoneData
          )
      }
  }

  updateClientPhonePreferred(clientId : number  , clientPhoneId : string) {     
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/phones/${clientPhoneId}/preferred`,null
    );
    
  }

  deactivateClientPhone(clientId : number  , clientPhoneId : string) {     
    return this.http.delete<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/phones/${clientPhoneId}/deactivate`
    );
    
  }

  removeClientPhone(clientId : number  , clientPhoneId : string) {     
    return this.http.delete<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/phones/${clientPhoneId}/remove`
    );
    
  }

}
