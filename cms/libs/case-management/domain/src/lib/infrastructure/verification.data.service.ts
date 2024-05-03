/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** Internal Libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientHivVerification } from '../entities/client-hiv-verification';
import { ProviderOption } from '../enums/provider-option.enum';

@Injectable({ providedIn: 'root' })
export class VerificationDataService {
    constructor(private readonly http: HttpClient, private configurationProvider: ConfigurationProvider){}
    save(clientHivVerification: FormData) {
        return this.http.post(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/hiv-verification/save`,
          clientHivVerification
        );
      }
      getHivVerification(clientId: any) {
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/hiv-verification?clientId=${clientId}`);
      }
      removeHivVerificationAttachment(hivVerificationId:any, clientId:any){
        return this.http.put(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/hiv-verification/${hivVerificationId}/remove`,
          {hivVerificationId:hivVerificationId}
        );
      }
      saveHivVerification(clientHivVerification: any)
      {
        const fd = new FormData();
        if (clientHivVerification?.hivVerificationDoc?.document) {
          fd.append('HivVerificationDoc', clientHivVerification?.hivVerificationDoc?.document ?? '', clientHivVerification?.hivVerificationDoc?.document?.name);
        }
        this.formDataAppendObject(fd, clientHivVerification);
        return this.http.post(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientHivVerification?.clientId}/hiv-verification`,
          fd
        );
      }
      formDataAppendObject(fd: FormData, obj: any, key?: any) {
        let i, k;
        for (i in obj) {
          k = key ? key + '[' + i + ']' : i;
          if (obj[i] instanceof File) {
            continue;
          }
          else if (typeof obj[i] == 'object') {
            this.formDataAppendObject(fd, obj[i], k);
          }
          else {
            fd.append(k, obj[i]);

          }
        }
      }
      getHivVerificationWithAttachment(clientId:any, clientCaseEligibilityId : any) {
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/eligibility-periods/${clientCaseEligibilityId}/hiv-verification`);
      }

      getClientHivDocuments(clientId:any){
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/hiv-verification/documents`);
      }

      loadHealthCareProviders(clientId : number  , skipcount : number,maxResultCount : number ,sort : string, sortType : string, showDeactivated :boolean) {
        return this.http.get<any[]>(
          `${this.configurationProvider.appSettings.caseApiUrl}`+
          `/case-management/healthcare-providers?showDeactivated=${showDeactivated}&clientId=${clientId}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
        );

      }

      getHivCaseWorker(clientId:any){
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/hiv-verification/hiv-caseWorker/${clientId}`);
      }

      sendHivRequestCaseManager(clientId:any){
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/hiv-verification/hiv-casemanager-notification/${clientId}`);
      }

      getClientHivVerification(clientId:any){
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/hiv-verification?clientId=${clientId}`);
      }

      getClientHivVerificationByMethod(clientId: number, methodCode: ProviderOption) {
        return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/hiv-verification/${clientId}/${methodCode}`);
      }
    }
