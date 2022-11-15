/** Angular **/
import { Injectable } from '@angular/core';
import { SmokingCessation } from '../entities/smoking-cessation';
import { SmokingCessationDataService } from '../infrastructure/smoking-cessation.data.service';

@Injectable({ providedIn: 'root' })
export class SmokingCessationFacade {
   
    constructor(private readonly smokingCessationDataService:SmokingCessationDataService){}
    updateSmokingCessation(smokingCessation:SmokingCessation) {
        return this.smokingCessationDataService.updateSmokingCessation(smokingCessation);
    }
}
