/** Angular **/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SmokingCessationDataService } from '../infrastructure/smoking-cessation.data.service';
import { SnackBar } from '@cms/shared/ui-common';
import { LoaderService ,NotificationSnackbarService, SnackBarNotificationType,LoggingService} from '@cms/shared/util-core';

import { ClientNote } from '../entities/client-note';
@Injectable({ providedIn: 'root' })
export class SmokingCessationFacade {
   
 snackbarMessage!: SnackBar;
 snackbarSubject = new Subject<SnackBar>();
 familyfacadesnackbar$ = this.snackbarSubject.asObservable();

  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.hideLoader();   
  }

     constructor(private readonly smokingCessationDataService:SmokingCessationDataService, 
        private readonly loaderService: LoaderService,
        private readonly notificationSnackbarService : NotificationSnackbarService,
        private loggingService : LoggingService,){}

    /** Public methods **/

     showLoader()
     {
       this.loaderService.show();
     }
   
     hideLoader()
     {
       this.loaderService.hide();
     }
     
      createSmokingCessationNote(clientNote: ClientNote) {
        return this.smokingCessationDataService.createSmokingCessationNote(clientNote);
      }

      loadClientNote(clientCaseEligibilityId:any,clientId:any) {
        return this.smokingCessationDataService.loadClientNote(clientCaseEligibilityId,clientId);
      }

}