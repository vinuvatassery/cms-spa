/** Angular **/
import { Injectable } from '@angular/core';
import { SnackBar, SnackBarNotificationText, SnackBarNotificationType } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Dependent } from '../entities/dependent';
import { ClientDependentGroupDesc} from '../enums/client-dependent-group.enum';
import { DependentTypeCode } from '../enums/dependent-type.enum';
/** Data services **/
import { DependentDataService } from '../infrastructure/dependent.data.service';
/** Providers **/
import { ConfigurationProvider, LoggingService } from '@cms/shared/util-core';


/** Facade **/
import { CompletionChecklist, StatusFlag, WorkflowFacade } from '@cms/case-management/domain';
import { LoaderService } from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class FamilyAndDependentFacade {
  public gridPageSizes =this.configurationProvider.appSettings.gridPageSizeValues;
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

  ShowHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    let subtitleText = subtitle;
    const titleText = (type== SnackBarNotificationType.SUCCESS) ? SnackBarNotificationText.SUCCESS : SnackBarNotificationText.ERROR
    if(type == SnackBarNotificationType.ERROR)
    {
      const err= subtitle;
      subtitleText =(err?.name ?? '')+''+(err?.error?.code ?? '')+''+(err?.error?.error ?? '');
      this.loggingService.logException(err)
    }
    const snackbarMessage: SnackBar = {
      title: titleText,
      subtitle: subtitleText,
      type: type,
    };
    this.snackbarSubject.next(snackbarMessage);
    this.HideLoader();
  }


  /** Constructor**/
  constructor(private readonly dependentDataService: DependentDataService,
    private workflowFacade: WorkflowFacade ,   private readonly loaderService: LoaderService ,
    private configurationProvider : ConfigurationProvider ,
    private loggingService : LoggingService ) {}

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
        this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent Removed Successfully')  
       }             
        this.dependentdeleteSubject.next(dependentdeleteResponse);
        this.HideLoader();
      },
      error: (err) => {        
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)      
      },
    });
  }

  AddNewDependent(dependent: Dependent): void {
    this.ShowLoader();
    this.dependentDataService.addNewDependent(dependent).subscribe({
      next: (addNewdependentsResponse) => {
        if(addNewdependentsResponse)
        {     
         this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'New Dependent Added Successfully')  
        }
           
        this.dependentAddNewSubject.next(addNewdependentsResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)      
      },
    });
  }

  UpdateNewDependent(dependent: Dependent): void {
    this.ShowLoader();
    this.dependentDataService.updateNewDependent(dependent).subscribe({
      next: (updateNewdependentsResponse) => {        
        
        if(updateNewdependentsResponse)
        {     
         this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent data Updated')  
        }
           
        this.dependentUpdateNewSubject.next(updateNewdependentsResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
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
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }


  GetExistingClientDependent(clientDependentId: string) : void {   
    this.ShowLoader(); 
    this.dependentDataService.getExistingClientDependent(clientDependentId , DependentTypeCode.CAClient).subscribe({
      next: (dependentGetExistingResponse) => {
        dependentGetExistingResponse.ssn=  'xxx-xx-' +dependentGetExistingResponse.ssn.slice(-4);
        this.dependentGetExistingSubject.next(dependentGetExistingResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
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
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }

  updateDependentStatus(clientCaseEligibilityId : string ,hasDependents : string): void {
    this.ShowLoader();
    this.dependentDataService.updateDependentStatus(clientCaseEligibilityId , hasDependents).subscribe({
      next: (dependentStatusResponse) => {        
       
        if(dependentStatusResponse == true)
        {     
         this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent Status Updated')  
        }
        
        this.dependentStatusSubject.next(dependentStatusResponse);
        this.HideLoader();
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
        
      },
    });
  }

  loadDependentsStatus(clientCaseEligibilityId : string) : void {
    this.dependentDataService.loadDependentsStatus(clientCaseEligibilityId).subscribe({
      next: (dependentStatusGetResponse) => {
        this.dependentStatusGetSubject.next(dependentStatusGetResponse);
      },
      error: (err) => {  
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }

  loadDependentSearch(text : string): void {
    this.dependentDataService.searchDependents(text).subscribe({
      next: (dependentSearchResponse) => {

        Object.values(dependentSearchResponse).forEach((key) => {            
          key.fullName = key.firstName + ' ' + key.lastName
          key.ssn=  'xxx-xx-' +key.ssn.slice(-4);
          key.fullCustomName =key?.fullName + ' DOB '+key?.dob.toString()+' SSN '+key?.ssn      
        
          if(key?.clientId > 0)   
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
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)    
      },
    });
  }



  AddExistingDependent(data : any) : void {
    this.dependentDataService.addExistingDependent(data ).subscribe({
      next: (dependentStatusResponse) => {    
        if(dependentStatusResponse == true)
        {     
         this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Client Added as Dependent')  
        }
        
        this.dependentStatusSubject.next(dependentStatusResponse);
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)    
        
      },
    });
  }

}
