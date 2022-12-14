/** Angular **/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs';
import { SmokingCessation } from '../entities/smoking-cessation';
import { SmokingCessationDataService } from '../infrastructure/smoking-cessation.data.service';
import { SnackBar } from '@cms/shared/ui-common';

@Injectable({ providedIn: 'root' })
export class SmokingCessationFacade {
   
 snackbarMessage!: SnackBar;
 snackbarSubject = new Subject<SnackBar>();
 familyfacadesnackbar$ = this.snackbarSubject.asObservable();
  handleSnackBar(title : string , subtitle : string ,type : string )
  {    
    const snackbarMessage: SnackBar = {
      title: title,
      subtitle: subtitle,
      type: type,
    };
    this.snackbarSubject.next(snackbarMessage);
  }
     constructor(private readonly smokingCessationDataService:SmokingCessationDataService){}
    updateSmokingCessation(smokingCessation:SmokingCessation) {
        return this.smokingCessationDataService.updateSmokingCessation(smokingCessation);
    }
    loadSmokingCessation(clientCaseEligibilityId:any,clientCaseId:any) {
        return this.smokingCessationDataService.loadSmokingCessation(clientCaseEligibilityId,clientCaseId);
      }
}
