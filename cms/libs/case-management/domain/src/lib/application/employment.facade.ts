/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ClientEmployer } from '../entities/client-employer';
/** Data services **/
import { EmployersDataService } from '../infrastructure/employers.data.service';
import {
  CompletionChecklist,
  StatusFlag,
  WorkflowFacade,
} from '@cms/case-management/domain';
@Injectable({ providedIn: 'root' })
export class EmploymentFacade {
  /** Private properties **/
  private employersSubject = new Subject<any>();
  private employersDetailsSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  employers$ = this.employersSubject.asObservable();
  employersDetails$ = this.employersDetailsSubject.asObservable();

  /** Constructor**/
  constructor(
    private readonly employersDataService: EmployersDataService,
    private workflowFacade: WorkflowFacade
  ) {}

  /** Public methods **/
  loadEmployers(
    clientCaseEligibilityId: string,
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string
  ) {
    this.employersDataService
      .loadEmployers(
        clientCaseEligibilityId,
        skipcount,
        maxResultCount,
        sort,
        sortType
      )
      .subscribe({
        next: (employersResponse: any) => {
          // this.employersSubject.next(employersResponse);

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
    return this.employersDataService.loadEmployersDetails(
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
  save(): Observable<boolean> {
    //TODO: save api call
    return of(true);
  }

  createEmployer(clientEmployer: ClientEmployer): Observable<any> {
    return this.employersDataService.createClientEmployer(clientEmployer);
  }

  updateEmployer(clientEmployer: ClientEmployer): Observable<any> {
    return this.employersDataService.updateClientEmployer(clientEmployer);
  }

  deleteEmployer(clientCaseEligibilityId: string, clientEmployerId: string) {
    return this.employersDataService.deleteClientEmployer(
      clientCaseEligibilityId,
      clientEmployerId
    );
  }

  unEmploymentUpdate(clientCaseEligibilityId: string, isEmployed: string) {
    return this.employersDataService.unEmploymentChecked(
      clientCaseEligibilityId,
      isEmployed
    );
  }
}
