import { Injectable } from "@angular/core";
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from "@cms/shared/util-core";
import { Subject } from "rxjs";
import { HivVerificationApprovalService } from "../../infrastructure/approval/hiv-verification-approval.facade";
import { PendingApprovalGeneralService } from "../../infrastructure/approval/pending-approval-general.data.service";
import { NavigationMenuFacade } from "@cms/system-config/domain";

@Injectable({ providedIn: 'root' })
export class HivVerificationApprovalFacade {
  
  acceptStatus: string = 'ACCEPT';

  private hivVerificationApprovalSubject = new Subject<any>();
  hivVerificationApproval$ = this.hivVerificationApprovalSubject.asObservable();
  
  loadWorkflowSubject = new Subject<any>();
  loadWorkflow$ = this.loadWorkflowSubject.asObservable();

  

    /** Constructor **/
    constructor(
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly hivVerificationApprovalService: HivVerificationApprovalService,
    private readonly navigationMenuFacade: NavigationMenuFacade
    ) {}

    hideLoader() { this.loaderService.hide(); }

  showLoader() { this.loaderService.show(); }

  
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
  }
    /** Public methods **/


    getHivVerificationApproval() : void {
      this.showLoader();
      this.hivVerificationApprovalService.getHivVerificationApproval().subscribe({
        next: (hivVerificationResponse:any) => {
          this.navigationMenuFacade.hivVerificationCountSubject.next(hivVerificationResponse.length);
          this.hivVerificationApprovalSubject.next(hivVerificationResponse);
          this.hideLoader();
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
          this.hideLoader();
        },
      });
    }

    updateHivVerificationApproval(hivVerification : any){
      this.showLoader();
      this.hivVerificationApprovalService.updateHivVerificationApproval(hivVerification).subscribe(
        {
          next: (response: any) => {
            this.hideLoader();     
            this.getHivVerificationApproval();  
            if(hivVerification.status=== this.acceptStatus){
              this.loadWorkflowSubject.next(true);   
            }
            this.notificationSnackbarService.manageSnackBar(
              SnackBarNotificationType.SUCCESS,
              response.message
            );
          },
          error: (err) => {
            this.hideLoader();
            this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
          },
        }
      );
    }

    
}