/** Angular **/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { InsurancePlanDataService } from '../infrastructure/insurance-plan.data.service';

@Injectable({ providedIn: 'root' })
export class InsurancePlanFacade {

     /** Public properties **/
     planLoaderSubject = new Subject<boolean>();
     planLoaderChange$ = this.planLoaderSubject.asObservable();
     planNameChangeSubject = new Subject<any[]>();
     planNameChange$ = this.planNameChangeSubject.asObservable();
     constructor(private readonly insurancePlanDataService:InsurancePlanDataService){}
     
    /** Public methods **/
    loadInsurancePlanByProviderId(providerId:string) {
        return this.insurancePlanDataService.loadInsurancePlanByProviderId(providerId);
      }
}
