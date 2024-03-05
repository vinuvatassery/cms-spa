/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class EsignDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
    initiateAdobeEsignRequest(adobeEsignData: any){
      return this.http.post<any>(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign`,adobeEsignData
      );
    }
    
    saveDraftEsignRequest(formData: any){
      return this.http.post<any>(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign`,formData
      );
    }

    loadDraftEsignRequestByClinetId(entityId: string, clientCaseEligibilityId: string, loggedInUserId: string){
      return this.http.get(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign/${entityId}/${clientCaseEligibilityId}/${loggedInUserId}`,
      );
    }

    deleteEsignRequestAttachment(esignRequestAttachmentId:any){
      return this.http.delete(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign?esignRequestAttachmentId=${esignRequestAttachmentId}`,
      );
    }

    updateEsignRequestTemplate(formData: any){
      return this.http.put(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign`,formData
      );
    }

    getEsignRequest(clientCaseEligibilityId: string){
      return this.http.get(
        `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/esign/${clientCaseEligibilityId}`,
      );
    }
}
 