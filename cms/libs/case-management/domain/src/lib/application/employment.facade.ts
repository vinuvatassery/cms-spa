/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Observable, of, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** interal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
// entities library
import { ClientEmployer } from '../entities/client-employer';
import { CompletionChecklist } from '../entities/workflow-stage-completion-status';
/** Data services **/
import { EmployersDataService } from '../infrastructure/employers.data.service';
// enum  library
import {StatusFlag} from '../enums/status-flag.enum'
import {WorkflowFacade}from  './workflow.facade'

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

  // handling the snackbar
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  handleSnackBar(title : string , subtitle : string ,type : string )
  {    
    const snackbarMessage: SnackBar = {
      title: title,
      subtitle: subtitle,
      type: type,
    };
    this.snackbarSubject.next(snackbarMessage);
  }
  /** Constructor**/
  constructor(
    private readonly employersDataService: EmployersDataService,
    private workflowFacade: WorkflowFacade
  ) {}

  /** Public methods **/


  // Loading the unemployment status
  loadEmploymentStatus(clientCaseEligibilityId : string) : void {
    this.employersDataService.loadEmploymentStatusService(clientCaseEligibilityId).subscribe({
      next: (employmentStatusGetResponse) => {
        this.employmentStatusGetSubject.next(employmentStatusGetResponse);
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' ); 
      },
   
    });
  }

  // Loading the employmet lists
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
          this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' ); 
        },
      });
  }
  
  // Loading the employmet details based on employerid
  loadEmployersDetails(
    clientCaseEligibilityId: string,
    clientEmployerId: string
  ) {
    return this.employersDataService.loadEmployersDetailsService(
      clientCaseEligibilityId,
      clientEmployerId
    );
  }

  // creating a new employer
  createEmployer(clientEmployer: ClientEmployer): Observable<any> {
    return this.employersDataService.createClientNewEmployerService(clientEmployer);
  }

  // updating the employer
  updateEmployer(clientEmployer: ClientEmployer): Observable<any> {
    return this.employersDataService.updateClientEmployerService(clientEmployer);
  }

  // removing the employer
  deleteEmployer(clientCaseEligibilityId: string, clientEmployerId: string) {
    return this.employersDataService.removeClientEmployerService(
      clientCaseEligibilityId,
      clientEmployerId
    );
  }

  // updating the unemployment stats
  unEmploymentUpdate(clientCaseEligibilityId: string, isEmployed: string) {

    this.employersDataService.employmentStatusUpdateService(clientCaseEligibilityId, isEmployed).subscribe({
      next: (employmentStatusResponse) => {        
        this.employersStatusSubject.next(employmentStatusResponse);
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' );
      },
    });

    // return this.employersDataService.employmentStatusUpdateService(
    //   clientCaseEligibilityId,
    //   isEmployed
    // );
  }
  
}
