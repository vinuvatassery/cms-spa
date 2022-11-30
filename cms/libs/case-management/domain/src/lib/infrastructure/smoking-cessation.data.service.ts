import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationProvider } from "@cms/shared/util-core";
import { SmokingCessation } from "../entities/smoking-cessation";

@Injectable({ providedIn: 'root' })
export class SmokingCessationDataService{
    constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider) {
     
    }
    
    updateSmokingCessation(smokingCessation: SmokingCessation) {  
        return this.http.put<SmokingCessation>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/smoking-cessation`,
           smokingCessation,

        )}
      loadSmokingCessation(clientCaseEligibilityId:any,clientCaseId:any){
        return this.http.get<SmokingCessation>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/smoking-cessations/clientCaseId=${clientCaseId}/clientCaseEligibilityId=${clientCaseEligibilityId}`,);
      }
}