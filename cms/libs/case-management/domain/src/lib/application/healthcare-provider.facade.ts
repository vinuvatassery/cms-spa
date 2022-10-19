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

  /** Public properties **/
  ddlStates$ = this.ddlStatesSubject.asObservable();
  healthCareProviders$ = this.healthCareProvidersSubject.asObservable();

  /** Constructor**/
  constructor(
    private readonly healthcareProviderDataService: HealthcareProviderDataService
  ) {}

  /** Public methods **/
  loadHealthCareProviders(): void {
    this.healthcareProviderDataService.loadHealthCareProviders().subscribe({
      next: (healthCareProvidersResponse) => {
        this.healthCareProvidersSubject.next(healthCareProvidersResponse);
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
