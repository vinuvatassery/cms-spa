import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { HealthInsurancePolicy } from '../entities/health-insurance-policy';
import { CarrierContactInfo } from '../entities/carrier-contact-info';
import { of } from 'rxjs';

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
  deleteInsurancePolicy(insurancePolicyId:any){
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-policy?clientInsurancePolicyId=${insurancePolicyId}`);
  }
  copyInsurancePolicy(insurancePolicyId:any){
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-policies/${insurancePolicyId}`,{}
    );
  }
  updateInsuranceFlags(insuranceFlagsData: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-flags`, insuranceFlagsData);
  }
  loadPaymentRequest(clientId: any, clientCaseId: any,clientCaseEligibilityId: any,gridDataRefinerValue: any) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/payment-requests?type=${gridDataRefinerValue.type}&clientId=${clientId}&skipCount=${gridDataRefinerValue.skipCount}&maxResultCount=${gridDataRefinerValue.maxResultCount}`);
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
  loadMedicalHealthPlans(clientId:any,clientCaseEligibilityId:any,typeParam:any, skipCount:any,pageSize:any, sortBy:any, sortType:any) {
    let type =typeParam['type'];
    let insuranceStatusType = typeParam['insuranceStatusType'];
    let params = new HttpParams();
    params = params.append('clientId',clientId);
    params = params.append('clientCaseEligibilityId',clientCaseEligibilityId);
    params = params.append('skipCount',skipCount);
    params = params.append('maxResultCount',pageSize);
    params = params.append('sorting',sortBy);
    params = params.append('sortType',sortType);
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/health-insurance-policy?type=${type}&insuranceStatusType=${insuranceStatusType}`,{params:params});
  }
}
