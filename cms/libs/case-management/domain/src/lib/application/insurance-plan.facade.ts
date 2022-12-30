/** Angular **/
import { Injectable } from '@angular/core';
import { InsurancePlanDataService } from '../infrastructure/insurance-plan.data.service';

@Injectable({ providedIn: 'root' })
export class InsurancePlanFacade {

     constructor(private readonly insurancePlanDataService:InsurancePlanDataService){}

    /** Public methods **/

   
    loadInsurancePlanByProviderId(providerId:string) {
        return this.insurancePlanDataService.loadInsurancePlanByProviderId(providerId);
      }
}
