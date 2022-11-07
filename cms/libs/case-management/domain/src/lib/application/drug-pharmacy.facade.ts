/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { DrugDataService } from '../infrastructure/drug.data.service';

@Injectable({ providedIn: 'root' })
export class DrugPharmacyFacade {
  /** Private properties **/
  private pharmaciesSubject = new BehaviorSubject<any>([]);
  private clientPharmaciesSubject = new BehaviorSubject<any>([]);
  private ddlPrioritiesSubject = new BehaviorSubject<any>([]);
  private ddlStatesSubject = new BehaviorSubject<any>([]);
  private pharmaciesListSubject = new BehaviorSubject<any>([]);
  private DrugsPurchasedSubject = new BehaviorSubject<any>([]);
  
  /** Public properties **/
  pharmacies$ = this.pharmaciesSubject.asObservable();
  clientPharmacies$ = this.clientPharmaciesSubject.asObservable();
  pharmaciesList$ = this.pharmaciesListSubject.asObservable();
  DrugsPurchased$ = this.DrugsPurchasedSubject.asObservable();
  ddlPriorities$ = this.ddlPrioritiesSubject.asObservable();
  ddlStates$ = this.ddlStatesSubject.asObservable();

  /** Constructor**/
  constructor(private readonly drugDataService: DrugDataService) {}

  /** Public methods **/
  loadPharmacies(): void {
    this.drugDataService.loadPharmacies().subscribe({
      next: (pharmaciesResponse) => {
        this.pharmaciesSubject.next(pharmaciesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlStates(): void {
    this.drugDataService.loadDdlStates().subscribe({
      next: (ddlStatesResponse) => {
        this.ddlStatesSubject.next(ddlStatesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadClientPharmacies(): void {
    this.drugDataService.loadClientPharmacies().subscribe({
      next: (clientPharmaciesResponse) => {
        this.clientPharmaciesSubject.next(clientPharmaciesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  loadPharmacieslist(): void {
    this.drugDataService.loadtPharmacies().subscribe({
      next: (PharmacieslistResponse) => {
        this.pharmaciesListSubject.next(PharmacieslistResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDrugsPurchased(): void {
    this.drugDataService.loadDrugsPurchased().subscribe({
      next: (DrugsPurchased) => {
        this.DrugsPurchasedSubject.next(DrugsPurchased);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  loadDdlPriorities(): void {
    this.drugDataService.loadDdlPriorities().subscribe({
      next: (ddlPrioritiesResponse) => {
        this.ddlPrioritiesSubject.next(ddlPrioritiesResponse);
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
