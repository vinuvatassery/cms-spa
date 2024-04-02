/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';

/** Data services **/

@Injectable({ providedIn: 'root' })
export class PhoneValidationDataService {
    /** Constructor **/
    constructor(private readonly http: HttpClient,
        private configurationProvider: ConfigurationProvider) { }

    /** Public methods **/
    getValidatePhoneNbr(clientId: any, phoneNumber:any){
      return this.http.get<any>(
        `${this.configurationProvider.appSettings.caseApiUrl}` +
          `/case-management/clients/${clientId}/ValidatePhone/${phoneNumber}`
          );
        }
}
