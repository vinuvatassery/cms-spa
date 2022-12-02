/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Dependent } from '../entities/dependent';
/** Data services **/
import { DependentDataService } from '../infrastructure/dependent.data.service';

@Injectable({ providedIn: 'root' })
export class FamilyAndDependentFacade {
  /** Private properties **/
  private dependentSearchSubject = new BehaviorSubject<any>([]);
  private ddlRelationshipsSubject = new BehaviorSubject<any>([]);
  private dependentsSubject = new BehaviorSubject<any>([]);
  private productsSubject = new BehaviorSubject<any>([]);
  private dependentStatusSubject = new BehaviorSubject<any>([]);
  private dependentStatusGetSubject = new BehaviorSubject<any>([]);
  private dependentAddNewSubject = new BehaviorSubject<any>([]);
  private dependentUpdateNewSubject = new BehaviorSubject<any>([]);
  private dependentGetNewSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  products$ = this.productsSubject.asObservable();
  dependentSearch$ = this.dependentSearchSubject.asObservable();
  ddlRelationships$ = this.ddlRelationshipsSubject.asObservable();
  dependents$ = this.dependentsSubject.asObservable();
  dependentStatus$ = this.dependentStatusSubject.asObservable();
  dependentStatusGet$ = this.dependentStatusGetSubject.asObservable();
  dependentAddNewGet$ = this.dependentAddNewSubject.asObservable();
  dependentUpdateNew$ = this.dependentUpdateNewSubject.asObservable();
  dependentGetNew$ = this.dependentGetNewSubject.asObservable();


  /** Constructor**/
  constructor(private readonly dependentDataService: DependentDataService) {}

  /** Public methods **/
  AddNewDependent(dependent: Dependent): void {
    this.dependentDataService.AddNewDependent(dependent).subscribe({
      next: (addNewdependentsResponse) => {
        this.dependentAddNewSubject.next(addNewdependentsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  UpdateNewDependent(dependent: Dependent): void {
    this.dependentDataService.UpdateNewDependent(dependent).subscribe({
      next: (updateNewdependentsResponse) => {
        this.dependentUpdateNewSubject.next(updateNewdependentsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  GetNewDependent(dependentId: string) : void {
    this.dependentDataService.GetNewDependent(dependentId).subscribe({
      next: (getNewdependentsResponse) => {
        this.dependentAddNewSubject.next(getNewdependentsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDependents(clientId : number): void {
    this.dependentDataService.loadDependents(clientId).subscribe({
      next: (dependentsResponse) => {
        this.dependentsSubject.next(dependentsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  updateDependentStatus(clientCaseEligibilityId : string ,hasDependents : string): void {
    this.dependentDataService.updateDependentStatus(clientCaseEligibilityId , hasDependents).subscribe({
      next: (dependentStatusResponse) => {
        this.dependentStatusSubject.next(dependentStatusResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDependentsStatus(clientCaseEligibilityId : string) : void {
    this.dependentDataService.loadDependentsStatus(clientCaseEligibilityId).subscribe({
      next: (dependentStatusGetResponse) => {
        this.dependentStatusGetSubject.next(dependentStatusGetResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

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
