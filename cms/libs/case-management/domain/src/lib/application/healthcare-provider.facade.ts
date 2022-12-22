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

  /** Public properties **/
  ddlStates$ = this.ddlStatesSubject.asObservable();
  healthCareProviders$ = this.healthCareProvidersSubject.asObservable();
  removeHealthProvider$ = this.healthCareProvideRemoveSubject.asObservable();
  updateHealthProvider$ = this.healthCareProvideUpdateFlagSubject.asObservable();
  healthCareProvideGetFlag$ = this.healthCareProvideGetFlagSubject.asObservable();
  healthCareProviderSearchList$ = this.healthCareProviderSearchSubject.asObservable();
  addExistingProvider$ = this.addExistingProviderSubject.asObservable();
  loadExistingProvider$ = this.loadExistingProviderSubject.asObservable();
  public gridPageSizes =this.configurationProvider.appSettings.gridPageSizeValues;
  public sortValue = 'fullName'
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

  ShowLoader()
  {
    this.loaderService.show();
  }

  HideLoader()
  {
    this.loaderService.hide();
  }
  ShowHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.HideLoader();   
  }

  /** Public methods **/
  removeHealthCareProviders(ClientCaseEligibilityId : string , ProviderId : string): void {
    this.ShowLoader();
    this.healthcareProviderDataService.removeHealthCareProvider(ClientCaseEligibilityId,ProviderId)
    .subscribe({
      next: (removeHealthCareProvidersResponse) => {        
        if(removeHealthCareProvidersResponse == true)
        {     
         this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Provider or Clinic Removed Successfully')  
        } 
        this.healthCareProvideRemoveSubject.next(removeHealthCareProvidersResponse);       
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)      
      },
    });
  }

  loadProviderStatusStatus(clientCaseEligibilityId : string) : void {
    this.ShowLoader();
    this.healthcareProviderDataService.loadProviderStatusStatus(clientCaseEligibilityId).subscribe({
      next: (providerStatusGetResponse) => {
        this.HideLoader();
        this.healthCareProvideGetFlagSubject.next(providerStatusGetResponse);
      },
      error: (err) => {  
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }

  updateHealthCareProvidersFlagonCheck(ClientCaseEligibilityId : string, nohealthCareProviderFlag : string)  {
    this.ShowLoader();
   return this.healthcareProviderDataService.updateHealthCareProvidersFlag(ClientCaseEligibilityId,nohealthCareProviderFlag)
   //.subscribe({
    //   next: (providerflagStatusGetResponse) => {     
    //     this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Providers Status Updated')     
    //     this.healthCareProvideUpdateFlagSubject.next(providerflagStatusGetResponse);
    //   },
    //   error: (err) => {  
    //     this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
    //   },
    // });
  }

  updateHealthCareProvidersFlag(ClientCaseEligibilityId : string, nohealthCareProviderFlag : string)
  {
    this.ShowLoader();
    return this.healthcareProviderDataService.updateHealthCareProvidersFlag(ClientCaseEligibilityId,nohealthCareProviderFlag)
  }

  loadHealthCareProviders(clientCaseEligibilityId : string,skipcount : number,maxResultCount : number ,sort : string, sortType : string): void {
    this.ShowLoader();
    this.healthcareProviderDataService.loadHealthCareProviders(clientCaseEligibilityId, skipcount ,maxResultCount  ,sort , sortType).subscribe({
      next: (healthCareProvidersResponse : any) => {        
        if(healthCareProvidersResponse)
        {      
            const gridView = {
              data : healthCareProvidersResponse["items"] ,        
              total:  healthCareProvidersResponse["totalCount"]  
              };       
          const workFlowdata: CompletionChecklist[] = [{
            dataPointName: 'health_care_provider',
            status: (parseInt(healthCareProvidersResponse["totalCount"]) > 0) ? StatusFlag.Yes : StatusFlag.No
          }];

          this.workflowFacade.updateChecklist(workFlowdata);
          this.healthCareProvidersSubject.next(gridView);
         }
         this.HideLoader();    
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }


 searchHealthCareProviders(text : string , clientCaseEligibilityId : string): void {  
    this.healthcareProviderDataService.searchProviders(text,clientCaseEligibilityId).subscribe({
      next: (healthCareProvidersSearchResponse) => {        
        if(healthCareProvidersSearchResponse)
        {            
          Object.values(healthCareProvidersSearchResponse).forEach((key) => {   
                    key.selectedCustomProvider = key.fullName+' '+key.clinicName+' '+key.address
          });
          this.healthCareProviderSearchSubject.next(healthCareProvidersSearchResponse);
         }         
      },
      error: (err) => {
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }

  addExistingHealthCareProvider(existProviderData :any) : void {
    this.ShowLoader();
    this.healthcareProviderDataService.addExistingHealthCareProvider(existProviderData).subscribe({
      next: (addExistingProviderGetResponse) => {
        this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Provider Added Successfully')   
        this.addExistingProviderSubject.next(addExistingProviderGetResponse);
      },
      error: (err) => {  
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }


  loadExistingHealthCareProvider(ClientCaseEligibilityId : string  ,providerId :string) : void {
    this.ShowLoader();
    this.healthcareProviderDataService.loadExistingHealthCareProvider(ClientCaseEligibilityId   ,providerId ).subscribe({
      next: (loadExistingProviderResponse) => {
        this.HideLoader();
        this.loadExistingProviderSubject.next(loadExistingProviderResponse);
      },
      error: (err) => {  
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
      },
    });
  }
 
}
