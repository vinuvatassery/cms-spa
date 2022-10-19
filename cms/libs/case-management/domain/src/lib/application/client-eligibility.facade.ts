/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { ClientEligibilityDataService } from '../infrastructure/client-eligibility.data.service';

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
    private readonly clientEligibilityDataService: ClientEligibilityDataService
  ) {}

  /** Public methods **/

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
}
