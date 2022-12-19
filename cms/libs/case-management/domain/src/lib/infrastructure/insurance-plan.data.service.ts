import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationProvider } from "@cms/shared/util-core";
import { InsurancePlan } from "../entities/insurance-plan";

@Injectable({ providedIn: 'root' })
export class InsurancePlanDataService{
    constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider) {
     
    }
    
      loadInsurancePlanByProviderId(providerId:string){
        return this.http.get<InsurancePlan>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/insurance-plan/byProvider/${providerId}`);
      }
}