/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';

/** Data services **/
import { MailAddress, AddressValidation } from '../entities/address-validation';

@Injectable({ providedIn: 'root' })
export class FormsAndDocumentDataService {
    /** Constructor **/
    constructor(private readonly http: HttpClient,
        private configurationProvider: ConfigurationProvider) { }

    /** Public methods **/
    validateAddress(address: MailAddress) {
        return this.http.get<AddressValidation>(
            `${this.configurationProvider.appSettings.sysConfigApiUrl}/system-config/address-validation?Address1=${address?.address1}&Address2=${address?.address2}&City=${address?.city}&State=${address?.state}&Zip5=${address?.zip5}`
        );
    }
}