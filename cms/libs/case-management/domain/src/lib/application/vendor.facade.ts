/** Angular **/
import { Injectable } from '@angular/core';
import { VendorDataService } from '../infrastructure/vendor.data.service';

@Injectable({ providedIn: 'root' })
export class VendorFacade {

     constructor(private readonly vendorDataService:VendorDataService){}

    /** Public methods **/


    loadAllVendors(type:string) {
        return this.vendorDataService.loadAllVendors(type);
      }
}
