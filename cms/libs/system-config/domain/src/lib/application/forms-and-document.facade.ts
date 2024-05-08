/** Angular **/
import { Injectable } from '@angular/core';

/** External libraries **/
import { MailAddress } from '../entities/address-validation';
import { AddressValidationDataService } from '../infrastructure/address-validation.data.service';

@Injectable({ providedIn: 'root' })
export class FormsAndDocumentFacade {

    constructor(private readonly addressValidationDataService: AddressValidationDataService,) { }

    /** Public methods **/
    validate(addres: MailAddress) {
        return this.addressValidationDataService.validateAddress(addres);
    }
}
