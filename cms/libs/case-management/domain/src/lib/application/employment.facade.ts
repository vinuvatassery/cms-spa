/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ClientEmployer } from '../entities/client-employer';
/** Data services **/
import { EmployersDataService } from '../infrastructure/employers.data.service';
import {  CompletionChecklist,  StatusFlag,  WorkflowFacade,} from '@cms/case-management/domain';
import { SortDescriptor } from '@progress/kendo-data-query';
@Injectable({ providedIn: 'root' })
export class EmploymentFacade {

  public gridPageSizes = [
    {text: "5", value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20}   
  ];
  public sortValue = 'employerName'
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];
  
  /** Private properties **/
  private employersSubject = new Subject<any>();
  private employersDetailsSubject = new BehaviorSubject<any>([]);
  private employmentStatusGetSubject = new Subject<any>();
  private employersStatusSubject =  new BehaviorSubject<any>([]);
  /** Public properties **/
  employers$ = this.employersSubject.asObservable();
  employersDetails$ = this.employersDetailsSubject.asObservable();
  employmentStatusGet$ = this.employmentStatusGetSubject.asObservable();
  employersStatus$ = this.employersStatusSubject.asObservable();

  /** Constructor**/
  constructor(
    private readonly employersDataService: EmployersDataService,
    private workflowFacade: WorkflowFacade
  ) {}

  /** Public methods **/
  loadEmploymentStatus(clientCaseEligibilityId : string) : void {
    this.employersDataService.loadEmploymentStatusService(clientCaseEligibilityId).subscribe({
      next: (employmentStatusGetResponse) => {
        this.employmentStatusGetSubject.next(employmentStatusGetResponse);
      },
      error: (err) => {  
        // this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }

  loadEmployers(
    clientCaseEligibilityId: string,
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string
  ) {
    this.employersDataService
      .loadEmploymentService(
        clientCaseEligibilityId,
        skipcount,
        maxResultCount,
        sort,
        sortType
      )
      .subscribe({
        next: (employersResponse: any) => {

          if (employersResponse) {
            const gridView: any = {
              data: employersResponse['items'],
              total: employersResponse?.totalCount,
            };
            const workFlowdata: CompletionChecklist[] = [
              {
                dataPointName: 'employment',
                status:
                  parseInt(employersResponse['totalCount']) > 0
                    ? StatusFlag.Yes
                    : StatusFlag.No,
              },
            ];

            this.workflowFacade.updateChecklist(workFlowdata);
            this.employersSubject.next(gridView);
          }
        },
        error: (err) => {
          console.error('err', err);
        },
      });
  }
  loadEmployersDetails(
    clientCaseEligibilityId: string,
    clientEmployerId: string
  ) {
    return this.employersDataService.loadEmployersDetailsService(
      clientCaseEligibilityId,
      clientEmployerId
    );

    // this.contactDataService.loadEmployersDetails(clientCaseEligibilityId, clientEmployerId).subscribe({
    //   next: (employersDetailsResponse) => {
    //     this.employersDetailsSubject.next(employersDetailsResponse);
    //   },
    //   error: (err) => {
    //     console.error('err', err);
    //   },
    // });
  }
  createEmployer(clientEmployer: ClientEmployer): Observable<any> {
    return this.employersDataService.createClientNewEmployerService(clientEmployer);
  }

  updateEmployer(clientEmployer: ClientEmployer): Observable<any> {
    return this.employersDataService.updateClientEmployerService(clientEmployer);
  }

  deleteEmployer(clientCaseEligibilityId: string, clientEmployerId: string) {
    return this.employersDataService.removeClientEmployerService(
      clientCaseEligibilityId,
      clientEmployerId
    );
  }

  unEmploymentUpdate(clientCaseEligibilityId: string, isEmployed: string) {

    this.employersDataService.employmentStatusUpdateService(clientCaseEligibilityId, isEmployed).subscribe({
      next: (employmentStatusResponse) => {        
        this.employersStatusSubject.next(employmentStatusResponse);
      },
      error: (err) => { 
      },
    });

    // return this.employersDataService.employmentStatusUpdateService(
    //   clientCaseEligibilityId,
    //   isEmployed
    // );
  }

  save(): Observable<boolean> {
    //TODO: save api call
    return of(true);
  }
  
}
