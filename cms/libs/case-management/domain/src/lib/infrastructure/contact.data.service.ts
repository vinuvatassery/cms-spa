/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientEmployer } from '../entities/client-employer';

@Injectable({ providedIn: 'root' })
export class ContactDataService {

  clientCaseEligibilityId  = '2FC20F89-460B-4BED-8321-681A21DA912D';
  /** Constructor**/
  constructor(private readonly http: HttpClient, private readonly configurationProvider: ConfigurationProvider) { }

  /** Public methods **/
  loadEmployers() {
    return this.http.get<ClientEmployer>(`${this.configurationProvider.appSettings.caseApiUrl}case-management/client-employers/${this.clientCaseEligibilityId}`);
  }
  loadEmployersDetails(clientCaseEligibilityId : string, clientEmployerId: string) {
    return this.http.get<ClientEmployer>(`${this.configurationProvider.appSettings.caseApiUrl}case-management/client-employers/${clientCaseEligibilityId}/${clientEmployerId}`);
  }
  createClientEmployer(clientEmployer: ClientEmployer) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}case-management/client-employers`, clientEmployer)
  }

  updateClientEmployer(clientEmployer: ClientEmployer) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}case-management/client-employers`, clientEmployer)
  }

  deleteClientEmployer(clientCaseEligibilityId : string, clientEmployerId: string) {
 
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}case-management/client-employers/${clientCaseEligibilityId}/${clientEmployerId}`)
  }

  loadMedicalHealthPlans() {
    return of([
      {
        InsuranceType: 'Qualified Health Plan',
        Priority: 'Primary',
        CarrierName: 'Uma Health',
        PlanName: 'Super Great Plan',
        PremiumPaid: '$500.00',
        Frequency: 'Monthly',
        StartDate: '10-10-2021',
        EndDate: '10-10-2021',
        SmsTextOk: 'Yes',
      },
    ]);
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
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlIncomeSources() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlFrequencies() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlProofOfIncomeTypes() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadIncomes() {
    return of([
      {
        IncomeSource: 'Income Source',
        IncomeType: 'Income Type',
        Amount: '$1000.00',
        Frequency: 'Bi-Weekly',
        IncomeStart: '01-01-2022',
        IncomeEnd: '01-01-2022',
        ProofofIncome: 'document.pdf',
        FinancialJustification: 'Lorem Ipsum',
        MonthlyIncome: '$1000.00',
      },
      {
        IncomeSource: 'Income Source',
        IncomeType: 'Income Type',
        Amount: '$1000.00',
        Frequency: 'Bi-Weekly',
        IncomeStart: '01-01-2022',
        IncomeEnd: '01-01-2022',
        ProofofIncome: 'document.pdf',
        FinancialJustification: 'Lorem Ipsum',
        MonthlyIncome: '$1000.00',
      },
      {
        IncomeSource: 'Income Source',
        IncomeType: 'Income Type',
        Amount: '$1000.00',
        Frequency: 'Bi-Weekly',
        IncomeStart: '01-01-2022',
        IncomeEnd: '01-01-2022',
        ProofofIncome: 'document.pdf',
        FinancialJustification: 'Lorem Ipsum',
        MonthlyIncome: '$1000.00',
      },
      {
        IncomeSource: 'Income Source',
        IncomeType: 'Income Type',
        Amount: '$1000.00',
        Frequency: 'Bi-Weekly',
        IncomeStart: '01-01-2022',
        IncomeEnd: '01-01-2022',
        ProofofIncome: 'document.pdf',
        FinancialJustification: 'Lorem Ipsum',
        MonthlyIncome: '$1000.00',
      },
      {
        IncomeSource: 'Income Source',
        IncomeType: 'Income Type',
        Amount: '$1000.00',
        Frequency: 'Bi-Weekly',
        IncomeStart: '01-01-2022',
        IncomeEnd: '01-01-2022',
        ProofofIncome: 'document.pdf',
        FinancialJustification: 'Lorem Ipsum',
        MonthlyIncome: '$1000.00',
      },
    ]);
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
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
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
}
