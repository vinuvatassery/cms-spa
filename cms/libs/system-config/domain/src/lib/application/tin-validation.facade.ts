/** Angular **/
import { Injectable } from '@angular/core';

/** External libraries **/
import { TinValidationDataService } from '../infrastructure/tin-validation.data.service';
import { LoaderService } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class TinValidationFacade {

    constructor(private readonly tinValidationDataService: TinValidationDataService,
      private readonly loaderService: LoaderService ) { }

    /** Public methods **/
    validateTinNbr(tinNbr: any) {
      return this.tinValidationDataService.getValidateTinNbr(tinNbr);
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
