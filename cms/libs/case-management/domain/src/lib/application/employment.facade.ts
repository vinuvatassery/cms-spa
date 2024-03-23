/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar, StatusFlag } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
// entities library
import { ClientEmployer } from '../entities/client-employer';
import { CompletionChecklist } from '../entities/workflow-stage-completion-status';
/** Data services **/
import { EmployersDataService } from '../infrastructure/employers.data.service';
// enum  library

import { WorkflowFacade } from './workflow.facade'
/** Providers **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class EmploymentFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'employerName';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  /** Private properties **/
  private employersSubject = new Subject<any>();
  private employersDetailsSubject = new BehaviorSubject<any>([]);
  private employmentStatusGetSubject = new Subject<any>();
  private employersStatusSubject = new BehaviorSubject<any>([]);
  private prvEmployersSubject = new Subject<any>();
  employmentValidSubject = new Subject<boolean>();
  /** Public properties **/
  employers$ = this.employersSubject.asObservable();
  employersDetails$ = this.employersDetailsSubject.asObservable();
  employmentStatusGet$ = this.employmentStatusGetSubject.asObservable();
  employersStatus$ = this.employersStatusSubject.asObservable();
  employmentValid$ = this.employmentValidSubject.asObservable();
  prvEmployers$ = this.prvEmployersSubject.asObservable();
  // handling the snackbar & loader
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  employmentFacadeSnackbar$ = this.snackbarSubject.asObservable();
  employerProfilePhotoSubject = new Subject();

  showLoader() { this.loaderService.show(); }
  hideLoader() { this.loaderService.hide(); }

  errorShowHideSnackBar( subtitle : any)
  {
    this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR,subtitle, NotificationSource.UI)
  }
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
  }

  /** Constructor**/
  constructor(
    private readonly employersDataService: EmployersDataService,
    private workflowFacade: WorkflowFacade,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly userManagementFacade: UserManagementFacade
  ) { }

  /** Public methods **/


  // Loading the unemployment status
  loadEmploymentStatus(clientCaseEligibilityId: string): void {
    this.employersDataService.loadEmploymentStatusService(clientCaseEligibilityId).subscribe({
      next: (employmentStatusGetResponse) => {
        this.employmentStatusGetSubject.next(employmentStatusGetResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },

    });
  }

  // Loading the employmet lists
  loadEmployers(
    clientId : any,
    clientCaseEligibilityId: string,
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string,
    type:string
  ) {
    this.showLoader();
    this.employersDataService
      .loadEmploymentService(
        clientId,
        clientCaseEligibilityId,
        skipcount,
        maxResultCount,
        sort,
        sortType,
        type
      )
      .subscribe({
        next: (employersResponse: any) => {

          if (employersResponse) {
            const gridView: any = {
              data: employersResponse['items'],
              total: employersResponse?.totalCount,
            };

            this.updateWorkFlowCount(parseInt(employersResponse['totalCount']) > 0 ? StatusFlag.Yes : StatusFlag.No);
            this.employersSubject.next(gridView);
            this.loadEmployersDistinctUserIdsAndProfilePhoto(employersResponse['items']);
            this.hideLoader();
          }
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.hideLoader();
        },
      });
  }

  loadEmployersDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.employerProfilePhotoSubject.next(data);
          }
        },
      });
    }
}

  loadPrevEmployers(clientId : any,prvClientCaseEligibilityId: string,){
    this.showLoader();
    this.employersDataService
    .loadEmploymentService(
      clientId,
      prvClientCaseEligibilityId,
      0,
      1000,
      '',
      '',
      'Old'
    )
    .subscribe({
      next: (employersResponse: any) => {
        if (employersResponse) {
          this.prvEmployersSubject.next(employersResponse['items']);
          this.hideLoader();
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  // Loading the employmet details based on employerid
  loadEmployersDetails(clientId : string, clientEmployerId: string) {
    return this.employersDataService.loadEmployersDetailsService(
      clientId,
      clientEmployerId
    );
  }

  // creating a new employer
  createEmployer(clientId : any, clientEmployer: ClientEmployer): Observable<any> {
    return this.employersDataService.createClientNewEmployerService(clientId, clientEmployer);
  }

  // updating the employer
  updateEmployer(clientId : any, clientEmployer: ClientEmployer, clientEmployerId : string): Observable<any> {
    return this.employersDataService.updateClientEmployerService(clientId, clientEmployer, clientEmployerId);
  }

  // removing the employer
  deleteEmployer(clientId : any, clientEmployerId: string) {
    return this.employersDataService.removeClientEmployerService(
      clientId,
      clientEmployerId
    );
  }

  // updating the unemployment stats
  employmentUpdate(clientCaseEligibilityId: string, employmentData: any) {
    return this.employersDataService.employmentUpdateService(clientCaseEligibilityId, employmentData);
  }

  updateWorkFlowCount(status: StatusFlag) {
    const workFlowdata: CompletionChecklist[] = [{
      dataPointName: 'employment',
      status: status
    }];

    this.workflowFacade.updateChecklist(workFlowdata);
  }

  validateOldEmployers(prvEmployers: any){
    let isValid = true;
    prvEmployers.forEach((emp:any) => {
      emp.cerReviewStatusCodeRequired = false;
      emp.endDateRequired = false;
      if(!emp.cerReviewStatusCode || emp.cerReviewStatusCode === 'PENDING'){
        isValid = false;
        emp.cerReviewStatusCodeRequired = true;
      }
      else if(emp.cerReviewStatusCode === 'INACTIVE' && !emp.endDate){
        isValid = false;
        emp.endDateRequired = true;
      }
      else if(emp.endDate !== null && emp.endDate<emp.dateOfHire){
        isValid = false;
        emp.endDateAfterHireDate = true;
      }
    });
    this.prvEmployersSubject.next(prvEmployers);
    return isValid;
  }

}
