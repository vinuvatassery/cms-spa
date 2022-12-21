/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ContactInfo } from '../entities/contact';
import { Income } from '../entities/income';
import { urlToHttpOptions } from 'url';

@Injectable({ providedIn: 'root' })
export class ContactDataService {


  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) { }

  /** Public methods **/
  loadMedicalHealthPlans(clientId:any,clientCaseEligibilityId:any) {
    let params = new HttpParams();
    params = params.append('clientId',clientId);
    params = params.append('clientCaseEligibilityId',clientCaseEligibilityId);
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/health-insurance-policy`,{params:params});
  }

  loadDdlMedicalHealthPlanMetalLevel() {
    return of(['Silver', 'Gold']);
  }

  loadDdlMedicalHealthPalnPremiumFrequecy() {
    return of(['Monthly', 'Quarterly', 'Yearly']);
  }

  loadDdlMedicalHealthInsurancePlans() {
    return of([
      'Oregon Health Plan (OHP)',
      'Qualified Health Plan',
      'Off Exchange Plan',
      'Group Insurance Plan',
      'COBRA',
      'Veterans Amdministration',
      'Medicare',
    ]);
  }

  loadDdlMedicalHealthPlanPriority() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

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

  loadIncomes(clientId: string, clientCaseEligibilityId: string) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-incomes/${clientId}/${clientCaseEligibilityId}`);
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

  loadMedicalPremiumPayments() {
    return of([
      {
        id: 1,
        providerName: 'David Morgan',
        serviceDescription: 'Lorem ipsum description',
        amount: '$350.00',
        reversal: 'Lorem ipsum',
        coverageStartDate: 'XX-XX-XXXX',
        coverageEndDate: 'XX-XX-XXXX',
        entryDate: 'XX-XX-XXXX',
        checkMailDate: 'XX-XX-XXXX',
        warrant: 'XXXXXXXXXXX',
        comment: 'Lorem comment',
        type: 'Payment',
      },
      {
        id: 2,
        providerName: 'David Morgan',
        serviceDescription: 'Lorem ipsum description',
        amount: '$350.00',
        reversal: 'Lorem ipsum',
        coverageStartDate: 'XX-XX-XXXX',
        coverageEndDate: 'XX-XX-XXXX',
        entryDate: 'XX-XX-XXXX',
        checkMailDate: 'XX-XX-XXXX',
        warrant: 'XXXXXXXXXXX',
        comment: 'Lorem comment',
        type: 'Payment',
      },
      {
        id: 3,
        providerName: 'David Morgan',
        serviceDescription: 'Lorem ipsum description',
        amount: '$350.00',
        reversal: 'Lorem ipsum',
        coverageStartDate: 'XX-XX-XXXX',
        coverageEndDate: 'XX-XX-XXXX',
        entryDate: 'XX-XX-XXXX',
        checkMailDate: 'XX-XX-XXXX',
        warrant: 'XXXXXXXXXXX',
        comment: 'Lorem comment',
        type: 'Payment',
      },
      {
        id: 4,
        providerName: 'David Morgan',
        serviceDescription: 'Lorem ipsum description',
        amount: '$350.00',
        reversal: 'Lorem ipsum',
        coverageStartDate: 'XX-XX-XXXX',
        coverageEndDate: 'XX-XX-XXXX',
        entryDate: 'XX-XX-XXXX',
        checkMailDate: 'XX-XX-XXXX',
        warrant: 'XXXXXXXXXXX',
        comment: 'Lorem comment',
        type: 'Payment',
      },
    ]);
  }

  loadHealthInsuranceStatus() {
    return of([
      {
        type: 'Off Exchange Plan',
        planName: 'platinum Plan',
        priority: 'Primary',
        insuranceID: '1200900',
        vendor: 'Star Moon',
        insuranceCarrier: 'Star Health',
        startDate: 'XX-XX-XXXX',
        endDate: 'XX-XX-XXXX',
        helpPay: 'Yes',
        otherPeople: 'John Kennedy',
        premiumAmount: '$250.00',
        premiumFrequency: 'Monthly',
        paymentID: 'GH0090P45',
        policyHolder: 'Client',
        aptc: '',
        monthlyAptc: '$350.00',
      },
      {
        type: 'Off Exchange Plan',
        planName: 'platinum Plan',
        priority: 'Primary',
        insuranceID: '1200900',
        vendor: 'Star Moon',
        insuranceCarrier: 'Star Health',
        startDate: 'XX-XX-XXXX',
        endDate: 'XX-XX-XXXX',
        helpPay: 'Yes',
        otherPeople: 'David Miller',
        premiumAmount: '$1250.00',
        premiumFrequency: 'Monthly',
        paymentID: 'GH0090P46',
        policyHolder: 'Client',
        aptc: '',
        monthlyAptc: '$670.00',
      },
      {
        type: 'Off Exchange Plan',
        planName: 'platinum Plan',
        priority: 'Primary',
        insuranceID: '1200900',
        vendor: 'Star Moon',
        insuranceCarrier: 'Star Health',
        startDate: 'XX-XX-XXXX',
        endDate: 'XX-XX-XXXX',
        helpPay: 'Yes',
        otherPeople: 'John Kennedy',
        premiumAmount: '$250.00',
        premiumFrequency: 'Monthly',
        paymentID: 'GH0090P45',
        policyHolder: 'Client',
        aptc: '',
        monthlyAptc: '$350.00',
      },
      {
        type: 'Off Exchange Plan',
        planName: 'platinum Plan',
        priority: 'Primary',
        insuranceID: '1200900',
        vendor: 'Star Moon',
        insuranceCarrier: 'Star Health',
        startDate: 'XX-XX-XXXX',
        endDate: 'XX-XX-XXXX',
        helpPay: 'Yes',
        otherPeople: 'David Miller',
        premiumAmount: '$1250.00',
        premiumFrequency: 'Monthly',
        paymentID: 'GH0090P46',
        policyHolder: 'Client',
        aptc: '',
        monthlyAptc: '$670.00',
      },
    ]);
  }

  loadCoPaysAndDeductibles() {
    return of([
      {
        id: 1,
        serviceProvider: 'Provider Name',
        amount: '$350.00',
        reversal: 'Lorem ipsum',
        coverageStartDate: 'XX-XX-XXXX',
        coverageEndDate: 'XX-XX-XXXX',
        entryDate: 'XX-XX-XXXX',
        warrant: 'XXXXXXXXXXX',
        comment: 'Lorem comment',
        type: 'Payment',
        serviceDescription: 'Lorem ipsum description',
      },
      {
        id: 2,
        serviceProvider: 'Provider Name',
        amount: '$350.00',
        reversal: 'Lorem ipsum',
        coverageStartDate: 'XX-XX-XXXX',
        coverageEndDate: 'XX-XX-XXXX',
        entryDate: 'XX-XX-XXXX',
        warrant: 'XXXXXXXXXXX',
        comment: 'Lorem comment',
        type: 'Payment',
        serviceDescription: 'Lorem ipsum description',
      },
      {
        id: 3,
        serviceProvider: 'Provider Name',
        amount: '$350.00',
        reversal: 'Lorem ipsum',
        coverageStartDate: 'XX-XX-XXXX',
        coverageEndDate: 'XX-XX-XXXX',
        entryDate: 'XX-XX-XXXX',
        warrant: 'XXXXXXXXXXX',
        comment: 'Lorem comment',
        type: 'Payment',
        serviceDescription: 'Lorem ipsum description',
      },
      {
        id: 4,
        serviceProvider: 'Provider Name',
        amount: '$350.00',
        reversal: 'Lorem ipsum',
        coverageStartDate: 'XX-XX-XXXX',
        coverageEndDate: 'XX-XX-XXXX',
        entryDate: 'XX-XX-XXXX',
        warrant: 'XXXXXXXXXXX',
        comment: 'Lorem comment',
        type: 'Payment',
        serviceDescription: 'Lorem ipsum description',
      },
      {
        id: 5,
        serviceProvider: 'Provider Name',
        amount: '$350.00',
        reversal: 'Lorem ipsum',
        coverageStartDate: 'XX-XX-XXXX',
        coverageEndDate: 'XX-XX-XXXX',
        entryDate: 'XX-XX-XXXX',
        warrant: 'XXXXXXXXXXX',
        comment: 'Lorem comment',
        type: 'Payment',
        serviceDescription: 'Lorem ipsum description',
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
    this.FormData_append_object(fd, contactInfo);

    return this.http.post(this.getUrl(clientId, clientCaseEligibilityId)
      , fd, { reportProgress: true, });
  }

  updateContactInfo(clientId: number, clientCaseEligibilityId: string, contactInfo: ContactInfo) {
    const fd = new FormData();
    if (contactInfo?.homeAddressProof?.document) {
      fd.append('AddressProofDocument', contactInfo?.homeAddressProof?.document ?? '', contactInfo?.homeAddressProof?.document?.name);
    }
    this.FormData_append_object(fd, contactInfo);

    return this.http.put(this.getUrl(clientId, clientCaseEligibilityId)
      , fd, { reportProgress: true, });
  }

  /** Private methods **/
  private getUrl(clientId: number, clientCaseEligibilityId: string) {
 
    return `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/contact-info?clientElgbltyId=${clientCaseEligibilityId}`
  }

  saveIncome(clientIncome: any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-incomes`, clientIncome);
  }

  updateNoIncomeData(noIncomeData: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-incomes/no-income`, noIncomeData);
  }

  FormData_append_object(fd: FormData, obj: any, key?: any) {
    var i, k;
    for (i in obj) {
      k = key ? key + '[' + i + ']' : i;
      if (obj[i] instanceof File) {
        continue;
      }
      else if (typeof obj[i] == 'object') {
        this.FormData_append_object(fd, obj[i], k);
      }
      else {
        fd.append(k, obj[i]);
        console.log(obj[i])
      }
    }
  }

  editIncome(clientIncome: any) { 
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-incomes`, clientIncome);

  }

  deleteIncome(clientIncomeId : string, clientId : any, clientCaseEligibilityId : string){
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-incomes/${clientIncomeId}/${clientId}/${clientCaseEligibilityId}`,);
  }

  loadIncomeDetailsService(clientIncomeId:any){
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-incomes/${clientIncomeId}`,);

  }
  updateInsuranceFlags(insuranceFlagsData: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-flags`, insuranceFlagsData);
  }
}
