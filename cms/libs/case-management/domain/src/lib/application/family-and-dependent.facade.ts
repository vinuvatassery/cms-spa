/** Angular **/
import { Injectable } from '@angular/core';
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Dependent } from '../entities/dependent';
import { ClientDependentGroupDesc ,ClientDependentGroup } from '../enums/client-dependent-group.enum';
import { DependentTypeCode } from '../enums/dependent-type.enum';
/** Data services **/
import { DependentDataService } from '../infrastructure/dependent.data.service';
import { DatePipe } from '@angular/common';
import { FamilyMember, FamilyMember2LabelMapping } from '../enums/family-member.enum';


/** Facade **/
import { CompletionChecklist, StatusFlag, WorkflowFacade } from '@cms/case-management/domain';

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
  constructor(private readonly dependentDataService: DependentDataService,private workflowFacade: WorkflowFacade) {}

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
        if(addNewdependentsResponse == true)
        {
         this.handleSnackBar('Success' ,'Added New Dependent','success')     
        }
        else
        {
         this.handleSnackBar('Error' ,'Error','error') 
        }   
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
        if(updateNewdependentsResponse == true)
        {
         this.handleSnackBar('Success' ,'Dependent data Updated','success')     
        }
        else
        {
         this.handleSnackBar('Error' ,'Error','error') 
        }   
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


  GetExistingClientDependent(clientDependentId: string) : void {
    this.dependentDataService.GetExistingClientDependent(clientDependentId , DependentTypeCode.CAClient).subscribe({
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
       
              if(dependentsResponse)
              {      
                  const gridView = {
                    data : dependentsResponse["items"] ,        
                    total:  dependentsResponse["totalCount"]  
                    };       
                const workFlowdata: CompletionChecklist[] = [{
                  dataPointName: 'family_dependents',
                  status: (parseInt(dependentsResponse["totalCount"]) > 0) ? StatusFlag.Yes : StatusFlag.No
                }];

                this.workflowFacade.updateChecklist(workFlowdata);
                this.dependentsSubject.next(gridView);
               }
       
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
          key.ssn=  'xxx-xx-' +key.ssn.slice(-4);;
          key.fullCustomName =key?.fullName + ' DOB '+key?.dob.toString()+' SSN '+key?.ssn      
        
          if(key?.clientId > 0)   
          {
              key.memberType = ClientDependentGroupDesc.Inactive            
          }
          else
          {
              key.memberType = ClientDependentGroupDesc.Active
          }
        });
        this.dependentSearchSubject.next(dependentSearchResponse);
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }



  AddExistingDependent(data : any) : void {
    this.dependentDataService.AddExistingDependent(data ).subscribe({
      next: (dependentStatusResponse) => {        
        if(dependentStatusResponse == true)
        {
         this.handleSnackBar('Success' ,'Client Added as Dependent','success')     
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
  
}
