/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Dependent } from '../entities/dependent';
/** Data services **/
import { DependentDataService } from '../infrastructure/dependent.data.service';

@Injectable({ providedIn: 'root' })
export class FamilyAndDependentFacade {
  /** Private properties **/
  private dependentSearchSubject = new Subject<any>();
  private ddlRelationshipsSubject = new Subject<any>();
  private dependentsSubject = new Subject<any>();
  private productsSubject = new Subject<any>();
  private dependentStatusSubject = new Subject<any>();
  private dependentStatusGetSubject = new Subject<any>();
  private dependentAddNewSubject = new Subject<any>();
  private dependentUpdateNewSubject = new Subject<any>();
  private dependentGetNewSubject = new Subject<any>();
  private dependentdeleteSubject = new Subject<any>();

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
  dependentdelete$ = this.dependentdeleteSubject.asObservable();


  /** Constructor**/
  constructor(private readonly dependentDataService: DependentDataService) {}

  /** Public methods **/
  DeleteDependent(dependentId: string): void {
    this.dependentDataService.DeleteDependent(dependentId).subscribe({
      next: (dependentdeleteResponse) => {
        this.dependentdeleteSubject.next(dependentdeleteResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }



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
        this.dependentGetNewSubject.next(getNewdependentsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDependents(clientId : number , skipcount : number,maxResultCount : number ,sort : string, sortType : string): void {
    
    this.dependentDataService.loadDependents(clientId, skipcount ,maxResultCount  ,sort , sortType ).subscribe({ 
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
