import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationProvider } from "@cms/shared/util-core";
import { ClientNote } from "../entities/client-note";
import { SmokingCessation } from "../entities/smoking-cessation";

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
      loadSmokingCessationNotes(clientId:any,clientCaseEligibilityId:any){
        return this.http.get<SmokingCessation>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/smoking-cessations/notes?clientCaseEligibilityId=${clientCaseEligibilityId}`);
      }
      createSmokingCessationNote(clientNote: ClientNote) {  
        return this.http.post<ClientNote>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientNote.clientId}/smoking-cessations/notes`,
          clientNote,

        )}
}