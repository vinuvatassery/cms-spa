import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationProvider } from "@cms/shared/util-core";
import{healthInsurancePolicy} from '../entities/health-insurance-policy';
import{CarrierContactInfo} from '../entities/carrier-contact-info';

@Injectable({ providedIn: 'root' })
export class HealthInsurancePolicyDataService{
    constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider) {

    }

    saveHealthInsurancePolicy(healthInsurancePolicy: healthInsurancePolicy) {
        return this.http.post<healthInsurancePolicy>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/insurance-policy`,
          healthInsurancePolicy);
        }

    getCarrierContactInfo(carrierId:any)
    {
      return this.http.get<CarrierContactInfo>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/health-insurance/carrier/contact-info/${carrierId}`);
      }
}


