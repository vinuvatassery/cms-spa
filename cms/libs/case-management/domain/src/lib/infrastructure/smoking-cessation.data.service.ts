import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationProvider } from "@cms/shared/util-core";
import { SmokingCessation } from "../entities/smoking-cessation";
import { ClientNote } from "../entities/client-note";

@Injectable({ providedIn: 'root' })
export class SmokingCessationDataService{
    constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider) {
     
    }
    
    updateSmokingCessation(smokingCessation: SmokingCessation,clientId:any) {  
        return this.http.put<SmokingCessation>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/smoking-cessations`,
           smokingCessation,

        )}
      loadSmokingCessation(clientCaseEligibilityId:any,clientCaseId:any,clientId:any){
        return this.http.get<SmokingCessation>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/smoking-cessations?ClientCaseId=${clientCaseId}&ClientCaseEligibilityId=${clientCaseEligibilityId}`);
      }

      loadSmokingCessationNotes(clientId:any,clientCaseEligibilityId:any,type:any){
        return this.http.get<SmokingCessation>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/notes?clientCaseEligibilityId=${clientCaseEligibilityId}&type=${type}`);
      }
      createSmokingCessationNote(clientNote: ClientNote) {  
        return this.http.post<ClientNote>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientNote.clientId}/notes`,
          clientNote,

        )}
}