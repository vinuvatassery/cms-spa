import { BehaviorSubject } from "rxjs";
import { ProfileTabDataService } from "../infrastructure/profile-tab-data-service";
import { Injectable } from "@angular/core";
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from "@cms/shared/util-core";

@Injectable({ providedIn: 'root' })
export class ProfileTabFacade{

    private eventLogSubject = new BehaviorSubject<any>([]);
    eventLog$ = this.eventLogSubject.asObservable();
  
    constructor(private profileTabDataService: ProfileTabDataService,
        private readonly loggingService: LoggingService,
        private readonly notificationSnackbarService: NotificationSnackbarService,){

    }

    
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
  }
  
    loadEventLog(clientId:any, clientCaseEligibilityId:any){
        debugger;
        this.profileTabDataService.loadEventLog(clientId,clientCaseEligibilityId)  .subscribe({
            next: (data) => { 
                this.eventLogSubject.next(data); 
            },
            error: (err: any) => {
                this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            },
          });
    }

}