/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { DependentDataService } from '../infrastructure/dependent.data.service';

@Injectable({ providedIn: 'root' })
export class FamilyAndDependentFacade {
  /** Private properties **/
  private dependentSearchSubject = new BehaviorSubject<any>([]);
  private ddlRelationshipsSubject = new BehaviorSubject<any>([]);
  private dependentsSubject = new BehaviorSubject<any>([]);
  private productsSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  products$ = this.productsSubject.asObservable();
  dependentSearch$ = this.dependentSearchSubject.asObservable();
  ddlRelationships$ = this.ddlRelationshipsSubject.asObservable();
  dependents$ = this.dependentsSubject.asObservable();

  /** Constructor**/
  constructor(private readonly dependentDataService: DependentDataService) {}

  /** Public methods **/
  loadDependentSearch(): void {
    this.dependentDataService.loadDependentSearch().subscribe({
      next: (dependentSearchResponse) => {
        this.dependentSearchSubject.next(dependentSearchResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDependents(): void {
    this.dependentDataService.loadDependents().subscribe({
      next: (dependentsResponse) => {
        this.dependentsSubject.next(dependentsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlRelationships(): void {
    this.dependentDataService.loadDdlRelationships().subscribe({
      next: (ddlRelationshipsResponse) => {
        this.ddlRelationshipsSubject.next(ddlRelationshipsResponse);
      },
    });
  }

  loadFamilyDependents(): void {
    this.dependentDataService.loadFamilyDependents().subscribe({
      next: (productsResponse) => {
        this.productsSubject.next(productsResponse);
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
