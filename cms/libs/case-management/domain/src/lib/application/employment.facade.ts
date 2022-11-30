/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ClientEmployer } from '../entities/client-employer';
/** Data services **/
import { EmployersDataService } from '../infrastructure/employers.data.service';

@Injectable({ providedIn: 'root' })
export class EmploymentFacade {
  /** Private properties **/
  private employersSubject = new BehaviorSubject<any>([]);
  private employersDetailsSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  employers$ = this.employersSubject.asObservable();
  employersDetails$ = this.employersDetailsSubject.asObservable();

  /** Constructor**/
  constructor(private readonly employersDataService: EmployersDataService) { }

  /** Public methods **/
  loadEmployers(): void {
    this.employersDataService.loadEmployers().subscribe({
      next: (employersResponse) => {
        this.employersSubject.next(employersResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  loadEmployersDetails(clientCaseEligibilityId : string, clientEmployerId : string) {
    return this.employersDataService.loadEmployersDetails(clientCaseEligibilityId, clientEmployerId)

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
    return of(true)
  }

  createEmployer(clientEmployer: ClientEmployer): Observable<any> {
    return this.employersDataService.createClientEmployer(clientEmployer)
  }

  updateEmployer(clientEmployer: ClientEmployer): Observable<any> {
    return this.employersDataService.updateClientEmployer(clientEmployer)
  }

  deleteEmployer(clientCaseEligibilityId : string, clientEmployerId : string) {
    return this.employersDataService.deleteClientEmployer(clientCaseEligibilityId, clientEmployerId)
  }
}
