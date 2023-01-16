import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { healthInsurancePolicy } from '../entities/health-insurance-policy';
import { CarrierContactInfo } from '../entities/carrier-contact-info';

@Injectable({ providedIn: 'root' })
export class HealthInsurancePolicyDataService {
  constructor(
    private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider
  ) {}

  saveHealthInsurancePolicy(healthInsuranceFormData: FormData) {
    return this.http.post<healthInsurancePolicy>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-policy`,
      healthInsuranceFormData
    );
  }
  updateHealthInsurancePolicy(healthInsuranceFormData: FormData) {
    return this.http.put<healthInsurancePolicy>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-policy`,
      healthInsuranceFormData
    );
  }

  getHealthInsurancePolicyById(clientInsurancePolicyId: string) {
    return this.http.get<healthInsurancePolicy>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-policy/${clientInsurancePolicyId}`
    );
  }

  getCarrierContactInfo(carrierId: any) {
    return this.http.get<CarrierContactInfo>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/carrier/contact-info/${carrierId}`
    );
  }
}
