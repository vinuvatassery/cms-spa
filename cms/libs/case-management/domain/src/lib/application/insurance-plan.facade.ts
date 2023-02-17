/** Angular **/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { InsurancePlanDataService } from '../infrastructure/insurance-plan.data.service';

@Injectable({ providedIn: 'root' })
export class InsurancePlanFacade {

     /** Public properties **/
     carrierNameChangeSubject = new Subject<string>();
     carrierNameChange$ = this.carrierNameChangeSubject.asObservable();
     constructor(private readonly insurancePlanDataService:InsurancePlanDataService){}


    /** Public methods **/

   
    loadInsurancePlanByProviderId(providerId:string) {
        return this.insurancePlanDataService.loadInsurancePlanByProviderId(providerId);
      }
}
