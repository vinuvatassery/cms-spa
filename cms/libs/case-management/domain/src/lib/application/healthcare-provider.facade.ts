/** Angular **/
import { Injectable } from '@angular/core';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { CompletionChecklist } from '../entities/workflow-stage-completion-status';
import { StatusFlag } from '../enums/status-flag.enum';

/** External libraries **/

/** Data services **/
import { HealthcareProviderDataService } from '../infrastructure/healthcare-provider.data.service';
import { WorkflowFacade } from './workflow.facade';

@Injectable({ providedIn: 'root' })
export class HealthcareProviderFacade {
  /** Private properties **/
  private ddlStatesSubject =  new Subject<any>();
  private healthCareProvidersSubject = new Subject<any>();
  private healthCareProvideRemoveSubject = new Subject<any>();
  private healthCareProvideUpdateFlagSubject = new Subject<any>();
  private healthCareProvideGetFlagSubject = new Subject<any>();
  private healthCareProviderSearchSubject = new Subject<any>();
  private addExistingProviderSubject = new Subject<any>();
  private loadExistingProviderSubject = new Subject<any>();
  private searchProviderLoadedSubject = new Subject<boolean>();
  private showProvidervalidationSubject = new Subject<boolean>();
  private healthCareProvideReactivateSubject = new Subject<any>();

  /** Public properties **/
  ddlStates$ = this.ddlStatesSubject.asObservable();
  healthCareProviders$ = this.healthCareProvidersSubject.asObservable();
  removeHealthProvider$ = this.healthCareProvideRemoveSubject.asObservable();
  updateHealthProvider$ = this.healthCareProvideUpdateFlagSubject.asObservable();
  healthCareProvideGetFlag$ = this.healthCareProvideGetFlagSubject.asObservable();
  healthCareProviderSearchList$ = this.healthCareProviderSearchSubject.asObservable();
  addExistingProvider$ = this.addExistingProviderSubject.asObservable();
  loadExistingProvider$ = this.loadExistingProviderSubject.asObservable();
  searchProviderLoaded$ = this.searchProviderLoadedSubject.asObservable();
  showProvidervalidation$ = this.showProvidervalidationSubject.asObservable();
  healthCareProvideReactivate$ = this.healthCareProvideReactivateSubject.asObservable();
  public gridPageSizes =this.configurationProvider.appSettings.gridPageSizeValues;
  public sortValue = ' '
  public sortType = 'asc'

  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];

  /** Constructor**/
  constructor(
    private readonly healthcareProviderDataService: HealthcareProviderDataService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService ,
    private readonly loaderService: LoaderService,
    private workflowFacade: WorkflowFacade ,private configurationProvider : ConfigurationProvider 
  ) {}

  showLoader()
  {
    this.loaderService.show();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }
  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.hideLoader();   
  }

  /** Public methods **/
  removeHealthCareProviders(clientId : number,  ProviderId : string, hardDelete : boolean): void {    
    this.showLoader();
    this.healthcareProviderDataService.removeHealthCareProvider(clientId,ProviderId,hardDelete)
    .subscribe({
      next: (removeResponse) => {        
        if(removeResponse ?? false)
        {     
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS , hardDelete ? 'provider or clinic removed successfully' : 'provider or clinic deactivated successfully')  
        
        } 
        this.healthCareProvideRemoveSubject.next(removeResponse);       
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)      
      },
    });
  }

  reActivateHealthCareProvider(clientId : number,  ProviderId : string): void {    
    this.showLoader();
    this.healthcareProviderDataService.reActivateHealthCareProvider(clientId,ProviderId)
    .subscribe({
      next: (removeResponse) => {        
        if(removeResponse ?? false)
        {     
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'provider or clinic re-activated successfully')  
        
        } 
        this.healthCareProvideReactivateSubject.next(removeResponse);       
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)      
      },
    });
  }

  loadProviderStatus(clientId : number,) : void {
    this.showLoader();
    this.healthcareProviderDataService.loadProviderStatus(clientId).subscribe({
      next: (providerStatusGetResponse) => {
        this.hideLoader();
        this.healthCareProvideGetFlagSubject.next(providerStatusGetResponse);
      },
      error: (err) => {  
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }

  updateHealthCareProvidersFlagonCheck(clientId : number, nohealthCareProviderFlag : string)  {
  
   return this.healthcareProviderDataService.updateHealthCareProvidersFlag(clientId,nohealthCareProviderFlag)
  }

  updateHealthCareProvidersFlag(clientId : number, nohealthCareProviderFlag : string)
  {
 
    return this.healthcareProviderDataService.updateHealthCareProvidersFlag(clientId,nohealthCareProviderFlag)
  }

  loadHealthCareProviders(clientId : number,skipcount : number,maxResultCount : number ,sort : string, sortType : string, showDeactivated = false): void {
    this.showLoader();
    this.healthcareProviderDataService.loadHealthCareProviders(clientId , skipcount ,maxResultCount  ,sort , sortType, showDeactivated).subscribe({
      next: (healthCareProvidersResponse : any) => {        
        if(healthCareProvidersResponse)
        {      
          const gridView = {
            data : healthCareProvidersResponse["items"] ,        
            total:  healthCareProvidersResponse["totalCount"]  
          };      

          this.updateWorkflowCount(parseInt(healthCareProvidersResponse["totalCount"]) > 0);
          this.showProvidervalidationSubject.next(parseInt(healthCareProvidersResponse["totalCount"]) === 0);
          this.healthCareProvidersSubject.next(gridView);
          this.hideLoader();    
         }
         else{
         this.hideLoader();    
         }
      },
      error: (err) => {      
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        this.updateWorkflowCount(false);   
      },
    });
  }


 searchHealthCareProviders(text : string , clientId : number): void {  
  this.searchProviderLoadedSubject.next(true);
  this.healthCareProviderSearchSubject.next(null);
    this.healthcareProviderDataService.searchProviders(text,clientId).subscribe({
      next: (healthCareProvidersSearchResponse) => {        
        if(healthCareProvidersSearchResponse)
        {            
          Object.values(healthCareProvidersSearchResponse).forEach((key) => {   
                    key.selectedCustomProvider = key.fullName+' '+key.clinicName+' '+key.address
          });
          this.healthCareProviderSearchSubject.next(healthCareProvidersSearchResponse);         
         }      
         this.searchProviderLoadedSubject.next(false);   
      },
      error: (err) => { 
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
        this.searchProviderLoadedSubject.next(false);
      },
    });
  }

  addExistingHealthCareProvider(existProviderData :any) : void {
    this.showLoader();
    this.healthcareProviderDataService.addExistingHealthCareProvider(existProviderData).subscribe({
      next: (addExistingProviderGetResponse) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Provider Added successfully')   
        this.addExistingProviderSubject.next(addExistingProviderGetResponse);
      },
      error: (err) => {        
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }


  loadExistingHealthCareProvider(clientId : number,providerId :string) : void {
    this.showLoader();
    this.healthcareProviderDataService.loadExistingHealthCareProvider(clientId ,providerId ).subscribe({
      next: (loadExistingProviderResponse) => {
        this.hideLoader();
        this.loadExistingProviderSubject.next(loadExistingProviderResponse);
      },
      error: (err) => {        
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }

  private updateWorkflowCount(isCompleted:boolean){
    const workFlowdata: CompletionChecklist[] = [{
      dataPointName: 'health_care_provider',
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(workFlowdata);
  }
 
}
