/** Angular **/
import { Injectable } from '@angular/core';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { CompletionChecklist } from '../entities/workflow-stage-completion-status';

/** External libraries **/

/** Data services **/
import { HealthcareProviderDataService } from '../infrastructure/healthcare-provider.data.service';
import { WorkflowFacade } from './workflow.facade';
import { StatusFlag } from '@cms/shared/ui-common';
import { UserManagementFacade } from '@cms/system-config/domain';

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
  private healthCareProvideGetCerFlagSubject = new Subject<any>();
  private healthCareProvideSetCerFlagSubject = new Subject<any>();
  private showAddNewProviderButtonSubject = new Subject<boolean>();

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
  healthCareProvideGetCerFlag$ = this.healthCareProvideGetCerFlagSubject.asObservable();
  healthCareProvideSetCerFlag$ = this.healthCareProvideSetCerFlagSubject.asObservable();
  showAddNewProvider$ = this.showAddNewProviderButtonSubject.asObservable();
  healthCareProviderProfilePhotoSubject = new Subject();
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
    private workflowFacade: WorkflowFacade ,private configurationProvider : ConfigurationProvider,
    private userManagementFacade:UserManagementFacade
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
  removeHealthCareProviders(clientProviderId : string, hardDelete : boolean): void {    
    this.showLoader();
    this.healthcareProviderDataService.removeHealthCareProvider(clientProviderId,hardDelete)
    .subscribe({
      next: (removeResponse) => {        
        if(removeResponse ?? false)
        {     
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS , hardDelete ? 'Provider or Clinic removed successfully' : 'Provider or Clinic deactivated successfully')  
        
        } 
        this.healthCareProvideRemoveSubject.next(removeResponse);       
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)      
      },
    });
  }

  reActivateHealthCareProvider(clientProviderId : string): void {    
    this.showLoader();
    this.healthcareProviderDataService.reActivateHealthCareProvider(clientProviderId)
    .subscribe({
      next: (removeResponse) => {        
        if(removeResponse ?? false)
        {     
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Provider or Clinic re-activated successfully')  
        
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
          if(parseInt(healthCareProvidersResponse["items"].filter(function(item : any){
            return item?.isDeleted === false;
          }).length) > 0)
          {          
          this.showAddNewProviderButtonSubject.next(false);
          }
          else
          {
            this.showAddNewProviderButtonSubject.next(true);
          }
          this.updateWorkflowCount(parseInt(healthCareProvidersResponse["totalCount"]) > 0);
          this.showProvidervalidationSubject.next(parseInt(healthCareProvidersResponse["totalCount"]) === 0);
          this.healthCareProvidersSubject.next(gridView);
          this.loadHealthcareProviderDistinctUserIdsAndProfilePhoto(healthCareProvidersResponse["items"]);
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

  loadHealthcareProviderDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.healthCareProviderProfilePhotoSubject.next(data);
          }
        },
      });
    }
  } 


 searchHealthCareProviders(text : string , clientId : number): void {  
  this.searchProviderLoadedSubject.next(true);
  this.healthCareProviderSearchSubject.next(null);
    this.healthcareProviderDataService.searchProviders(text,clientId).subscribe({
      next: (healthCareProvidersSearchResponse) => {        
        if(healthCareProvidersSearchResponse)
        {            
          Object.values(healthCareProvidersSearchResponse).forEach((key) => {   
                    key.selectedCustomProvider = (key.fullName ?? '') +' '+ (key.clinicName ?? '') +' '+key.address
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


  loadExistingHealthCareProvider(clientProviderId :string) : void {
    this.showLoader();
    this.healthcareProviderDataService.loadExistingHealthCareProvider(clientProviderId ).subscribe({
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

  ///CER
  loadProviderCerStatus(clientCaseEligibilityId : string,) : void {
    this.showLoader();
    this.healthcareProviderDataService.loadProviderCerStatus(clientCaseEligibilityId).subscribe({
      next: (providercerStatusGetResponse) => {
        this.hideLoader();        
        this.healthCareProvideGetCerFlagSubject.next(providercerStatusGetResponse?.healthcareProviderChangedFlag);
      },
      error: (err) => {  
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }

  setProviderCerStatus(clientCaseEligibilityId : string ,  cerStatus : string): void {    
    this.showLoader();
    this.healthcareProviderDataService.updateHealthCareProvidersCerFlag(clientCaseEligibilityId, cerStatus)
    .subscribe({
      next: (removeResponse) => {        
       
        this.healthCareProvideSetCerFlagSubject.next(removeResponse);   
        this.hideLoader();    
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)      
      },
    });
  }
 
}
