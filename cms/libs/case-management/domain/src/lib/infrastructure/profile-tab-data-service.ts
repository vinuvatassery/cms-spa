import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class ProfileTabDataService{

    constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider){

    }
    loadEventLog(clientId:any, clientCaseEligibilityId:any) {
        return this.http.get(
            `${this.configurationProvider.appSettings.caseApiUrl}/case-management/event-log?clientId=${clientId}&clientCaseEligibilityId=${clientCaseEligibilityId}`
          );
      }
}