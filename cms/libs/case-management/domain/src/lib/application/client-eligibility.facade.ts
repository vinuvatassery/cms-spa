/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { ClientEligibilityDataService } from '../infrastructure/client-eligibility.data.service';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class ClientEligibilityFacade {
  /** Private properties **/
  private ddlAcceptApplicationsSubject = new BehaviorSubject<any>([]);
  private ddlGroupsSubject = new BehaviorSubject<any>([]);
  private ddlStatusSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  ddlAcceptApplications$ = this.ddlAcceptApplicationsSubject.asObservable();
  ddlGroups$ = this.ddlGroupsSubject.asObservable();
  ddlStatus$ = this.ddlStatusSubject.asObservable();

  /** Constructor**/
  constructor(
    private readonly clientEligibilityDataService: ClientEligibilityDataService,
    private loggingService : LoggingService,
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

  loadDdlGroups() {
    this.clientEligibilityDataService.loadDdlGroups().subscribe({
      next: (ddlGroupsResponse) => {
        this.ddlGroupsSubject.next(ddlGroupsResponse);
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

  getEligibility(clientCaseEligibilityId: string, clientId: string){
    return this.clientEligibilityDataService.getEligibility(clientCaseEligibilityId,clientId);
  }

  saveAcceptedApplication(acceptedApplication:any)
  {
    return this.clientEligibilityDataService.saveAcceptedApplication(acceptedApplication);
  }
  getAcceptedApplication(clientCaseId:string,clientCaseEligibilityId:string)
  {
    return this.clientEligibilityDataService.getAcceptedApplication(clientCaseId,clientCaseEligibilityId);
  }
  getClientEligibilityInfo(clientCaseEligibilityId: string, clientId: number, clientCaseId: string)
  {
    return this.clientEligibilityDataService.getClientEligibilityInfo(clientId,clientCaseId,clientCaseEligibilityId);

  }
}
