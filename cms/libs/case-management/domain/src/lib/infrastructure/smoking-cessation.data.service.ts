import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationProvider } from "@cms/shared/util-core";
import { SmokingCessation } from "../entities/smoking-cessation";
import { ClientNote } from "../entities/client-note";

@Injectable({ providedIn: 'root' })
export class SmokingCessationDataService{
    constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider) {
    }  
    
      loadSmokingCessationNotes(clientId:any,clientCaseId:any,clientCaseEligibilityId:any,type:any,isShowHistoricalData:boolean=false){
        return this.http.get<SmokingCessation>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/notes?clientCaseId=${clientCaseId}&clientCaseEligibilityId=${clientCaseEligibilityId}&type=${type}&isShowHistoricalData=${isShowHistoricalData}`);
      }
      createSmokingCessationNote(clientNote: ClientNote) {  
        return this.http.post<ClientNote>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientNote.clientId}/notes`,
          clientNote,

        )}

        loadClientNote(clientCaseEligibilityId:any,clientId:any){
          return this.http.get<any>(
            `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/notes/cer?ClientCaseEligibilityId=${clientCaseEligibilityId}`);
        }
}