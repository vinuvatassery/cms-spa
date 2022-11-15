/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { HealthcareProviderDataService } from '../infrastructure/healthcare-provider.data.service';

@Injectable({ providedIn: 'root' })
export class HealthcareProviderFacade {
  /** Private properties **/
  private ddlStatesSubject = new BehaviorSubject<any>([]);
  private healthCareProvidersSubject = new BehaviorSubject<any>([]);
  private healthCareProvideRemoveSubject = new BehaviorSubject<any>([]);
  private healthCareProvideUpdateFlagSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  ddlStates$ = this.ddlStatesSubject.asObservable();
  healthCareProviders$ = this.healthCareProvidersSubject.asObservable();
  removeHealthProvider$ = this.healthCareProvideRemoveSubject.asObservable();
  updateHealthProvider$ = this.healthCareProvideUpdateFlagSubject.asObservable();
  /** Constructor**/
  constructor(
    private readonly healthcareProviderDataService: HealthcareProviderDataService
  ) {}

  /** Public methods **/
  loadHealthCareProviders(ClientCaseEligibilityId : string): void {
    this.healthcareProviderDataService.loadHealthCareProviders(ClientCaseEligibilityId).subscribe({
      next: (healthCareProvidersResponse) => {        
        this.healthCareProvidersSubject.next(healthCareProvidersResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  removeHealthCareProviders(ClientCaseEligibilityId : string , ProviderId : string): void {
    this.healthcareProviderDataService.removeHealthCareProvider(ClientCaseEligibilityId,ProviderId)
    .subscribe({
      next: (removeHealthCareProvidersResponse) => {        
        this.healthCareProvideRemoveSubject.next(removeHealthCareProvidersResponse);
        this.loadHealthCareProviders(ClientCaseEligibilityId);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  UpdateHealthCareProvidersFlag(ClientCaseEligibilityId : string, nohealthCareProviderFlag : string): void {
    this.healthcareProviderDataService.UpdateHealthCareProvidersFlag(ClientCaseEligibilityId,nohealthCareProviderFlag)
    .subscribe({
      next: (updateHealthCareProvidersFlagResponse) => {        
        this.healthCareProvideUpdateFlagSubject.next(updateHealthCareProvidersFlagResponse);        
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlStates(): void {
    this.healthcareProviderDataService.loadDdlStates().subscribe({
      next: (ddlStatesResponse) => {
        this.ddlStatesSubject.next(ddlStatesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  save():Observable<boolean>{
    //TODO: save api call   
    return of(true);
  }
}
