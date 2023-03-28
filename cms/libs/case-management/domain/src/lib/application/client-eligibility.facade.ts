/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs';
/** Data services **/
import { ClientEligibilityDataService } from '../infrastructure/client-eligibility.data.service';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class ClientEligibilityFacade {
  /** Private properties **/
  private ddlAcceptApplicationsSubject = new BehaviorSubject<any>([]);
  private ddlGroupsSubject = new BehaviorSubject<any>([]);
  private ddlStatusSubject = new BehaviorSubject<any>([]);
  eligibilityPeriodPopupCloseSubject = new Subject<boolean>();

  /** Public properties **/
  ddlAcceptApplications$ = this.ddlAcceptApplicationsSubject.asObservable();
  ddlGroups$ = this.ddlGroupsSubject.asObservable();
  ddlStatus$ = this.ddlStatusSubject.asObservable();
  eligibilityPeriodPopupClose$ = this.eligibilityPeriodPopupCloseSubject.asObservable();

  /** Constructor**/
  constructor(
    private readonly clientEligibilityDataService: ClientEligibilityDataService,
    private readonly loggingService : LoggingService,
    private readonly loaderService: LoaderService ,
    private readonly notificationSnackbarService : NotificationSnackbarService
  ) {}

  /** Public methods **/
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
  loadDdlAcceptApplications(): void {
    this.clientEligibilityDataService.loadDdlAcceptApplications().subscribe({
      next: (ddlAcceptApplicationsResponse) => {
        this.ddlAcceptApplicationsSubject.next(ddlAcceptApplicationsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlStatus() {
    this.clientEligibilityDataService.loadDdlStatus().subscribe({
      next: (ddlStatusResponse) => {
        this.ddlStatusSubject.next(ddlStatusResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  showLoader()
  {
    this.loaderService.show();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }

  getEligibility(clientId: string,clientCaseId:any,clientCaseEligibilityId: string,type:string){
    return this.clientEligibilityDataService.getEligibility(clientId,clientCaseId,clientCaseEligibilityId,type);
  }

  saveAcceptedApplication(acceptedApplication:any,caseId:any,eligibilityId:any)
  {
    return this.clientEligibilityDataService.saveAcceptedApplication(acceptedApplication,caseId,eligibilityId);
  }
  saveNewStatusPeriod(newEligibilityPeriods:any,caseId:any,eligibilityId:any)
  {
    return this.clientEligibilityDataService.saveNewStatusPeriod(newEligibilityPeriods,caseId,eligibilityId);
  }
  
  
}
