/** Angular **/
import { Injectable } from '@angular/core';
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Dependent } from '../entities/dependent';
import { ClientDependentGroupDesc} from '../enums/client-dependent-group.enum';
import { DependentTypeCode } from '../enums/dependent-type.enum';
/** Data services **/
import { DependentDataService } from '../infrastructure/dependent.data.service';


/** Facade **/
import { CompletionChecklist, StatusFlag, WorkflowFacade } from '@cms/case-management/domain';
import { LoaderService } from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class FamilyAndDependentFacade {
  public gridPageSizes = [
    {text: "5", value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20}   
  ];
  
  public sortValue = 'fullName'
  public sortType = 'asc'

  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];
  

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
    this.HideLoader();
  }


  /** Constructor**/
  constructor(private readonly dependentDataService: DependentDataService,
    private workflowFacade: WorkflowFacade ,   private readonly loaderService: LoaderService  ) {}

  /** Public methods **/
  ShowLoader()
  {
    this.loaderService.show();
  }

  HideLoader()
  {
    this.loaderService.hide();
  }

  DeleteDependent(dependentId: string): void {
   this.ShowLoader();
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
        this.HideLoader();
      },
      error: (err) => {        
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )       
      },
    });
  }

  AddNewDependent(dependent: Dependent): void {
    this.ShowLoader();
    this.dependentDataService.AddNewDependent(dependent).subscribe({
      next: (addNewdependentsResponse) => {
        if(addNewdependentsResponse)
        {
         this.handleSnackBar('Success' ,'Added New Dependent','success')     
        }
        else
        {
         this.handleSnackBar('Error' ,'Error','error') 
        }   
        this.dependentAddNewSubject.next(addNewdependentsResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }

  UpdateNewDependent(dependent: Dependent): void {
    this.ShowLoader();
    this.dependentDataService.UpdateNewDependent(dependent).subscribe({
      next: (updateNewdependentsResponse) => {
        if(updateNewdependentsResponse)
        {
         this.handleSnackBar('Success' ,'Dependent data Updated','success')     
        }
        else
        {
         this.handleSnackBar('Error' ,'Error','error') 
        }   
        this.dependentUpdateNewSubject.next(updateNewdependentsResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }

  GetNewDependent(dependentId: string) : void {
    this.ShowLoader();
    this.dependentDataService.GetNewDependent(dependentId).subscribe({
      next: (getNewdependentsResponse) => {
        getNewdependentsResponse.ssn = this.FormatSSN(getNewdependentsResponse?.ssn)
        this.dependentGetNewSubject.next(getNewdependentsResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }


  GetExistingClientDependent(clientDependentId: string) : void {   
    this.ShowLoader(); 
    this.dependentDataService.GetExistingClientDependent(clientDependentId , DependentTypeCode.CAClient).subscribe({
      next: (dependentGetExistingResponse) => {
        dependentGetExistingResponse.ssn=  'xxx-xx-' +dependentGetExistingResponse.ssn.slice(-4);
        this.dependentGetExistingSubject.next(dependentGetExistingResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }

  loadDependents(clientId : number , skipcount : number,maxResultCount : number ,sort : string, sortType : string): void {
    this.ShowLoader();
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
               this.HideLoader();       
      },
      error: (err) => {
        this.workflowFacade.updateChecklist([{
          dataPointName: 'family_dependents',
          status: StatusFlag.No
        }]);
        this.handleSnackBar('error' , (err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '') ,'error' )    
      },
    });
  }

  updateDependentStatus(clientCaseEligibilityId : string ,hasDependents : string): void {
    this.ShowLoader();
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
        this.HideLoader();
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

  loadDependentSearch(text : string): void {
    this.dependentDataService.SearchDependents(text).subscribe({
      next: (dependentSearchResponse) => {

        Object.values(dependentSearchResponse).forEach((key) => {            
          key.fullName = key.firstName + ' ' + key.lastName
          key.ssn=  'xxx-xx-' +key.ssn.slice(-4);
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

  FormatSSN(x: string) : string
  {  
    if(x.length >  0)
    {
      let fSSN = '';
      fSSN += x.substr(0, 3);
      fSSN += '-' + x.substr(3, 2);
      fSSN += '-' + x.substr(5, 4);
      return fSSN;    
    }
    return '';
  }
  
}
