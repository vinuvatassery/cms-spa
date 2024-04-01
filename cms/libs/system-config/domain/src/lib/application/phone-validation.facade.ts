/** Angular **/
import { Injectable } from '@angular/core';

/** External libraries **/
import { PhoneValidationDataService } from '../infrastructure/phone-validation.data.service';
import { LoaderService } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class PhoneValidationFacade {

    constructor(private readonly phoneValidationDataService: PhoneValidationDataService,
      private readonly loaderService: LoaderService ) { }

    /** Public methods **/
    validatePhoneNbr(phoneNbr: any) {
      return this.phoneValidationDataService.getValidatePhoneNbr(phoneNbr);
    }

    showLoader()
    {
      this.loaderService.show();
    }

    hideLoader()
    {
      this.loaderService.hide();
    }

}
