import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { HealthInsurancePolicy } from '../entities/health-insurance-policy';
import { CarrierContactInfo } from '../entities/carrier-contact-info';
import { Observable, of } from 'rxjs';
import { ServiceSubTypeCode } from '../enums/service-sub-type-code';

@Injectable({ providedIn: 'root' })
export class HealthInsurancePolicyDataService {
  constructor(
    private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider
  ) { }

  saveHealthInsurancePolicy(healthInsurancePolicy: any) {
    return this.http.post<HealthInsurancePolicy>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-policy`,
      healthInsurancePolicy
    );
  }
  updateHealthInsurancePolicy(healthInsurancePolicy: any) {
    return this.http.put<HealthInsurancePolicy>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-policy`,
      healthInsurancePolicy
    );
  }

  getHealthInsurancePolicyById(clientInsurancePolicyId: string) {
    return this.http.get<HealthInsurancePolicy>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-policy/${clientInsurancePolicyId}`
    );
  }
  getMedicalClaimMaxbalance(clientId: number,eligibilityId:string) {
    
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/medical/balance?ClientId=${clientId}&eligibilityId=${eligibilityId}`
    );
  }
  getCarrierContactInfo(carrierId: any) {
    return this.http.get<CarrierContactInfo>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/carrier/contact-info/${carrierId}`
    );
  }
  setHealthInsurancePolicyPriority(healthInsurancePolicies: any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/priority`,
      healthInsurancePolicies
    );
  }
  getHealthInsurancePolicyPriorities(clientId:any,clientCaseEligibilityId:any,insuranceStatus:string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/clients/${clientId}/eligibility/${clientCaseEligibilityId}/priority?type=${insuranceStatus}`);
  }
  deleteInsurancePolicyByEligibiltyId(clientCaseEligibilityId:any){
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/${clientCaseEligibilityId}/policies`);
  }
  deleteInsurancePolicy(insurancePolicyId:any , endDate? : Date , isCerForm = false){
    const options = {
      body: {
        endDate: endDate,
        isCerForm : isCerForm
      }
    }
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-policy?clientInsurancePolicyId=${insurancePolicyId}`,options);
  }

  copyHealthInsurancePolicy(insurancePolicyId:any, insurancePolicy: any = {}){
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-policies/${insurancePolicyId}`
      ,insurancePolicy
    );
  }
  updateInsuranceFlags(insuranceFlagsData: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-flags`, insuranceFlagsData);
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
  loadMedicalHealthPlans(clientId:any,clientCaseEligibilityId:any,typeParam:any,loadHistoricalData:any, gridFilterParam:any) {
    let type =typeParam['type'];
    let insuranceStatusType = typeParam['insuranceStatusType'];
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/health-insurance-policy?type=${type}&insuranceStatusType=${insuranceStatusType}
    &clientId=${clientId}&clientCaseEligibilityId=${clientCaseEligibilityId}&loadHistoricalData=${loadHistoricalData}`,gridFilterParam);
  }

  loadPaymentRequest(clientId: any, clientCaseId: any,clientCaseEligibilityId: any,gridDataRefinerValue: any) {

    let params = new HttpParams();
    params = params.append('sorting',gridDataRefinerValue.sortColumn);
    params = params.append('sortType',gridDataRefinerValue.sortType);
    if(gridDataRefinerValue.type==ServiceSubTypeCode.medicalPremium)
    {
      return this.http.get(    
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/payments/get-permium-payment?statusType=${gridDataRefinerValue.type}&clientId=${clientId}&eligibilityId=${clientCaseEligibilityId}&skipCount=
        ${gridDataRefinerValue.skipCount}&maxResultCount=${gridDataRefinerValue.maxResultCount}&dentalPlanFlag=${gridDataRefinerValue.dentalPlanFlag}&showTwelveMonthRecord=${gridDataRefinerValue.twelveMonthsRecords}`,{params:params});
       
    }else{
      return this.http.get(    
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/payments?statusType=${gridDataRefinerValue.type}&clientId=${clientId}&eligibilityId=${clientCaseEligibilityId}&skipCount=
        ${gridDataRefinerValue.skipCount}&maxResultCount=${gridDataRefinerValue.maxResultCount}&dentalPlanFlag=${gridDataRefinerValue.dentalPlanFlag}&showTwelveMonthRecord=${gridDataRefinerValue.twelveMonthsRecords}`,{params:params});
       
    }
    }
  savePaymentRequest(paymentRequest:any){    
    if(paymentRequest.serviceTypeCode==ServiceSubTypeCode.insurnacePremium)
    {
 return this.http.post<PaymentRequest>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/payments`,
      paymentRequest
    );
    }else{
      return this.http.put<any>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/payments`,
        paymentRequest
      );
    }  
  }

  loadInsurancePoliciesByProviderId(providerId: any, clientId: any, clientCaseEligibilityId: any, isDental: any) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/vendors/${providerId}/insurance-policies?clientId=${clientId}&clientCaseEligibilityId=${clientCaseEligibilityId}&dentalPlan=${isDental}`);
  }
  
  validateCerReviewStatus(eligibilityId: any,): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/eligibility/${eligibilityId}/cer-review-state`);
  }

}
