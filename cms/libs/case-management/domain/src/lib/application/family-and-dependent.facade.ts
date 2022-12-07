/** Angular **/
import { Injectable } from '@angular/core';
import { SnackBar } from '@cms/shared/ui-common';
import { Observable, of, Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Dependent } from '../entities/dependent';
import { DependentTypeCode, DependentTypeDesc } from '../enums/dependent-type.enum';
/** Data services **/
import { DependentDataService } from '../infrastructure/dependent.data.service';

@Injectable({ providedIn: 'root' })
export class FamilyAndDependentFacade {
  /** Private properties **/
  private dependentSearchSubject = new Subject<any>();
  private ddlRelationshipsSubject = new Subject<any>();
  private dependentsSubject = new Subject<any>();
  private productsSubject = new Subject<any>();
  private dependentStatusSubject =  new BehaviorSubject<any>([]);
  private dependentStatusGetSubject = new Subject<any>();
  private dependentAddNewSubject = new Subject<any>();
  private dependentUpdateNewSubject = new Subject<any>();
  private dependentGetNewSubject = new Subject<any>();
  private dependentdeleteSubject = new Subject<any>();
  private dependentGetExistingSubject = new Subject<any>();

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
  dependentGetExisting$ = this.dependentGetExistingSubject.asObservable();


  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  familyfacadesnackbar$ = this.snackbarSubject.asObservable();

  handleSnackBar(title : string , subtitle : string ,type : string )
  {    
    const snackbarMessage: SnackBar = {
      title: title,
      subtitle: subtitle,
      type: type,
    };
    this.snackbarSubject.next(snackbarMessage);
  }


  /** Constructor**/
  constructor(private readonly dependentDataService: DependentDataService) {}

  /** Public methods **/
  DeleteDependent(dependentId: string): void {
    this.dependentDataService.DeleteDependent(dependentId).subscribe({
      next: (dependentdeleteResponse) => {      
       if(dependentdeleteResponse == true)
       {
        this.handleSnackBar('Success' ,'Dependent Removed','success')     
       }
       else
       {
        this.handleSnackBar('Error' ,'Error','error') 
       }        
        this.dependentdeleteSubject.next(dependentdeleteResponse);
      },
      error: (err) => {        
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )       
      },
    });
  }



  AddNewDependent(dependent: Dependent): void {
    this.dependentDataService.AddNewDependent(dependent).subscribe({
      next: (addNewdependentsResponse) => {
        this.dependentAddNewSubject.next(addNewdependentsResponse);
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }

  UpdateNewDependent(dependent: Dependent): void {
    this.dependentDataService.UpdateNewDependent(dependent).subscribe({
      next: (updateNewdependentsResponse) => {
        this.dependentUpdateNewSubject.next(updateNewdependentsResponse);
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }

  GetNewDependent(dependentId: string) : void {
    this.dependentDataService.GetNewDependent(dependentId).subscribe({
      next: (getNewdependentsResponse) => {
        this.dependentGetNewSubject.next(getNewdependentsResponse);
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }


  GetExistingClientDependent(dependentId: string) : void {
    this.dependentDataService.GetExistingClientDependent(dependentId , DependentTypeCode.CAClient).subscribe({
      next: (dependentGetExistingResponse) => {
        this.dependentGetExistingSubject.next(dependentGetExistingResponse);
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }

  loadDependents(clientId : number , skipcount : number,maxResultCount : number ,sort : string, sortType : string): void {
    
    this.dependentDataService.loadDependents(clientId, skipcount ,maxResultCount  ,sort , sortType ).subscribe({ 
      next: (dependentsResponse : any) => {
        const gridView = {
          data : dependentsResponse["items"],        
          total: dependentsResponse["totalCount"]
      };
        this.dependentsSubject.next(gridView);
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }

  updateDependentStatus(clientCaseEligibilityId : string ,hasDependents : string): void {
    this.dependentDataService.updateDependentStatus(clientCaseEligibilityId , hasDependents).subscribe({
      next: (dependentStatusResponse) => {        
        if(dependentStatusResponse == true)
        {
         this.handleSnackBar('Success' ,'Dependent Status Updated','success')     
        }
        else
        {
         this.handleSnackBar('Error' ,'Error','error') 
        }       
        this.dependentStatusSubject.next(dependentStatusResponse);
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
        
      },
    });
  }

  loadDependentsStatus(clientCaseEligibilityId : string) : void {
    this.dependentDataService.loadDependentsStatus(clientCaseEligibilityId).subscribe({
      next: (dependentStatusGetResponse) => {
        this.dependentStatusGetSubject.next(dependentStatusGetResponse);
      },
      error: (err) => {  
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }

  loadDependentSearch(): void {
    this.dependentDataService.loadDependentSearch().subscribe({
      next: (dependentSearchResponse) => {

        Object.values(dependentSearchResponse).forEach((key) => {   
          key.fullName = key.firstName + ' ' + key.lastName
          key.fullCustomName =key?.fullName + ' DOB '+key?.dob.toString()+' SSN '+key?.ssn

          if(key?.dependentTypeCode === DependentTypeCode.Dependent)   
          {
              key.memberType = DependentTypeDesc.Dependent            
          }
          else
          {
              key.memberType = DependentTypeDesc.CAClient
          }
        });
        this.dependentSearchSubject.next(dependentSearchResponse);
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }
  
}
