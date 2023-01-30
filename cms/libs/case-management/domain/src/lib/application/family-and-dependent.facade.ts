/** Angular **/
import { Injectable } from '@angular/core';
import { SnackBar } from '@cms/shared/ui-common';
import { of, Subject } from 'rxjs';
/** External libraries **/

import { Dependent } from '../entities/dependent';
import { ClientDependentGroupDesc} from '../enums/client-dependent-group.enum';
import { DependentTypeCode } from '../enums/dependent-type.enum';
/** Data services **/
import { DependentDataService } from '../infrastructure/dependent.data.service';
/** Providers **/
import { ConfigurationProvider, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';


/** Facade **/
import { LoaderService } from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { WorkflowFacade } from './workflow.facade';
import { CompletionChecklist } from '../entities/workflow-stage-completion-status';
import { StatusFlag } from '../enums/status-flag.enum';
import { IntlService } from '@progress/kendo-angular-intl';

@Injectable({ providedIn: 'root' })
export class FamilyAndDependentFacade {
  public gridPageSizes =this.configurationProvider.appSettings.gridPageSizeValues;
  public sortValue = 'fullName'
  public sortType = '' 
  public sort: SortDescriptor[] = [{
    field: this.sortValue, 
  }];
  

  /** Private properties **/
  private dependentSearchSubject = new Subject<any>();
  private ddlRelationshipsSubject = new Subject<any>();
  private dependentsSubject = new Subject<any>();
  private clientDependentsSubject = new Subject<any>();
  private productsSubject = new Subject<any>();
  private existdependentStatusSubject =   new Subject<any>();
  private dependentStatusGetSubject = new Subject<any>();
  private dependentAddNewSubject = new Subject<any>();
  private dependentUpdateNewSubject = new Subject<any>();
  private dependentGetNewSubject = new Subject<any>();
  private dependentdeleteSubject = new Subject<any>();
  private dependentGetExistingSubject = new Subject<any>();
  displaydateFormat = this.configurationProvider.appSettings.displaydateFormat;
  /** Public properties **/
  products$ = this.productsSubject.asObservable();
  
  dependentSearch$ = this.dependentSearchSubject.asObservable();
  ddlRelationships$ = this.ddlRelationshipsSubject.asObservable();
  dependents$ = this.dependentsSubject.asObservable();
  clientDependents$ = this.clientDependentsSubject.asObservable();
  existdependentStatus$ = this.existdependentStatusSubject.asObservable();
  dependentStatusGet$ = this.dependentStatusGetSubject.asObservable();
  dependentAddNewGet$ = this.dependentAddNewSubject.asObservable();
  dependentUpdateNew$ = this.dependentUpdateNewSubject.asObservable();
  dependentGetNew$ = this.dependentGetNewSubject.asObservable();
  dependentdelete$ = this.dependentdeleteSubject.asObservable();
  dependentGetExisting$ = this.dependentGetExistingSubject.asObservable();


  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  familyfacadesnackbar$ = this.snackbarSubject.asObservable();
 



  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.HideLoader();   
  }


  /** Constructor**/
  constructor(private readonly dependentDataService: DependentDataService,
    private workflowFacade: WorkflowFacade ,   private readonly loaderService: LoaderService ,
    private configurationProvider : ConfigurationProvider ,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    public intl: IntlService ) {}

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
    this.dependentDataService.deleteDependent(dependentId).subscribe({
      next: (dependentdeleteResponse) => {      
       if(dependentdeleteResponse == true)
       {     
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent Removed Successfully')  
       }             
        this.dependentdeleteSubject.next(dependentdeleteResponse);
        this.HideLoader();
      },
      error: (err) => {        
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)      
      },
    });
  }

  AddNewDependent(dependent: Dependent): void {
    this.ShowLoader();
    this.dependentDataService.addNewDependent(dependent).subscribe({
      next: (addNewdependentsResponse) => {
        if(addNewdependentsResponse)
        {     
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'New Dependent Added Successfully')  
        }
           
        this.dependentAddNewSubject.next(addNewdependentsResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)      
      },
    });
  }

  UpdateNewDependent(dependent: Dependent): void {
    this.ShowLoader();
    this.dependentDataService.updateNewDependent(dependent).subscribe({
      next: (updateNewdependentsResponse) => {        
        
        if(updateNewdependentsResponse)
        {     
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent data Updated')  
        }
           
        this.dependentUpdateNewSubject.next(updateNewdependentsResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }

  GetNewDependent(dependentId: string) : void {
    this.ShowLoader();
    this.dependentDataService.getNewDependent(dependentId).subscribe({
      next: (getNewdependentsResponse) => {    
        this.dependentGetNewSubject.next(getNewdependentsResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }


  GetExistingClientDependent(clientDependentId: string) : void {   
    this.ShowLoader(); 
    this.dependentDataService.getExistingClientDependent(clientDependentId , DependentTypeCode.CAClient).subscribe({
      next: (dependentGetExistingResponse) => {      
        this.dependentGetExistingSubject.next(dependentGetExistingResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
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
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }

  updateDependentStatus(clientCaseEligibilityId : string ,hasDependents : string) {    
    this.ShowLoader();
    return this.dependentDataService.updateDependentStatus(clientCaseEligibilityId , hasDependents)
  }

  loadDependentsStatus(clientCaseEligibilityId : string) : void {
    this.ShowLoader();
    this.dependentDataService.loadDependentsStatus(clientCaseEligibilityId).subscribe({
      next: (dependentStatusGetResponse) => {
        this.dependentStatusGetSubject.next(dependentStatusGetResponse);
        this.HideLoader();
      },
      error: (err) => {  
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }

  loadDependentSearch(text : string , clientId : number): void {
    this.dependentDataService.searchDependents(text , clientId).subscribe({
      next: (dependentSearchResponse) => {

        Object.values(dependentSearchResponse).forEach((key) => {   
                   
          key.fullName = key.firstName + ' ' + key.lastName
          key.ssn=  (key.ssn =='' || key.ssn == null) ? '' : 'xxx-xx-' +key.ssn.slice(-4);
          
          const dateOB = new Date(key.dob)
                          
          key.dob = ((dateOB.getMonth()+1) +'/'+dateOB.getDate()+'/'+dateOB.getFullYear() )
          
          key.fullCustomName =key?.fullName + ' DOB '+key?.dob + ((key?.ssn == '' || key?.ssn == null) ? "" :' SSN '+key?.ssn)     
          
          
          if(key?.clientDependentId === '00000000-0000-0000-0000-000000000000')   
          {
              key.memberType = ClientDependentGroupDesc.Clients            
          }
          else
          {            
              key.memberType = ClientDependentGroupDesc.Dependents
          }
        });
        this.dependentSearchSubject.next(dependentSearchResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }



  AddExistingDependent(data : any) : void {    
    this.ShowLoader();
    this.dependentDataService.addExistingDependent(data ).subscribe({
      next: (dependentStatusResponse) => {    
        if(dependentStatusResponse)
        {     
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent added successfully')  
        }
        
        this.existdependentStatusSubject.next(dependentStatusResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
        
      },
    });
  }

  loadClientDependents(clientId: number) {
    this.ShowLoader();
    this.dependentDataService.loadClientDependents(clientId).subscribe({ 
      next: (dependentsResponse : any) => {         
              this.clientDependentsSubject.next(dependentsResponse);
               this.HideLoader();       
      },
      error: (err) => {
        this.HideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }

  uploadDependentProofOfSchool(dependentProof:any){
    return this.dependentDataService.uploadDependentProofOfSchool(dependentProof);
  }
}
