/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Provider } from '../entities/provider';
/** Data services **/
import { ProviderDataService } from '../infrastructure/provider.data.service';

@Injectable({ providedIn: 'root' })
export class ManagementFacade {
  /** Private properties **/
  private providersSubject = new BehaviorSubject<Provider[]>([]);
  private managersSubject = new BehaviorSubject<any>([]);
  private ddlStatesSubject = new BehaviorSubject<any>([]);
  private providersGridSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  providers$ = this.providersSubject.asObservable();
  managers$ = this.managersSubject.asObservable();
  ddlStates$ = this.ddlStatesSubject.asObservable();
  providersGrid$ = this.providersGridSubject.asObservable();

  /** Constructor**/
  constructor(private readonly providerDataService: ProviderDataService) {}

  /** Public methods **/
  loadManagers(): void {
    this.providerDataService.loadManagers().subscribe({
      next: (managersResponse) => {
        this.managersSubject.next(managersResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlStates(): void {
    this.providerDataService.loadDdlStates().subscribe({
      next: (ddlStatesResponse) => {
        this.ddlStatesSubject.next(ddlStatesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadProvidersGrid(): void {
    this.providerDataService.loadProvidersGrid().subscribe({
      next: (providersGridResponse) => {
        this.providersGridSubject.next(providersGridResponse);
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
