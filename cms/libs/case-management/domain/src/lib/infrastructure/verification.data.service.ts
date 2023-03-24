/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** Internal Libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientHivVerification } from '../entities/client-hiv-verification';

@Injectable({ providedIn: 'root' })
export class VerificationDataService {
    constructor(private readonly http: HttpClient, private configurationProvider: ConfigurationProvider){}
    save(clientHivVerification: ClientHivVerification) {
        return this.http.post(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/hiv-verification`,
          clientHivVerification
        );
      }
      getHivVerification(clientId: any) {
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/hiv-verification?clientId=${clientId}`);
      }

}
