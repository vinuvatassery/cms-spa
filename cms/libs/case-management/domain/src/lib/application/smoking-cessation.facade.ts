/** Angular **/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs';
import { SmokingCessation } from '../entities/smoking-cessation';
import { SmokingCessationDataService } from '../infrastructure/smoking-cessation.data.service';
import { SnackBar } from '@cms/shared/ui-common';
import { LoaderService ,NotificationSnackbarService, SnackBarNotificationType,LoggingService} from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class SmokingCessationFacade {
   
 snackbarMessage!: SnackBar;
 snackbarSubject = new Subject<SnackBar>();
 familyfacadesnackbar$ = this.snackbarSubject.asObservable();

  ShowHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.HideLoader();   
  }

     constructor(private readonly smokingCessationDataService:SmokingCessationDataService, 
        private readonly loaderService: LoaderService,
        private readonly notificationSnackbarService : NotificationSnackbarService,
        private loggingService : LoggingService,){}

    /** Public methods **/

     ShowLoader()
     {
       this.loaderService.show();
     }
   
     HideLoader()
     {
       this.loaderService.hide();
     }
    updateSmokingCessation(smokingCessation:SmokingCessation) {
        return this.smokingCessationDataService.updateSmokingCessation(smokingCessation);
    }
    loadSmokingCessation(clientCaseEligibilityId:any,clientCaseId:any) {
        return this.smokingCessationDataService.loadSmokingCessation(clientCaseEligibilityId,clientCaseId);
      }
}
