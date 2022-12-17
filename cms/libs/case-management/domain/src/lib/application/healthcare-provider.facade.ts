/** Angular **/
import { Injectable } from '@angular/core';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Observable, of, Subject } from 'rxjs';
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

  /** Public properties **/
  ddlStates$ = this.ddlStatesSubject.asObservable();
  healthCareProviders$ = this.healthCareProvidersSubject.asObservable();
  removeHealthProvider$ = this.healthCareProvideRemoveSubject.asObservable();
  updateHealthProvider$ = this.healthCareProvideUpdateFlagSubject.asObservable();
  healthCareProvideGetFlag$ = this.healthCareProvideGetFlagSubject.asObservable();
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

  updateHealthCareProvidersFlag(ClientCaseEligibilityId : string, nohealthCareProviderFlag : string)
  {
    this.ShowLoader();
    return this.healthcareProviderDataService.updateHealthCareProvidersFlag(ClientCaseEligibilityId,nohealthCareProviderFlag)
    // .subscribe({
    //   next: (updateHealthCareProvidersFlagResponse) => { 
    //     this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Provider status updated Successfully')  
    //     this.healthCareProvideUpdateFlagSubject.next(updateHealthCareProvidersFlagResponse);        
    //   },
    //   error: (err) => {
    //     this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)   
    //   },
    // });
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
            dataPointName: 'health_care_providers',
            status: (parseInt(healthCareProvidersResponse["totalCount"]) > 2) ? StatusFlag.Yes : StatusFlag.No
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

 



  save():Observable<boolean>{
    //TODO: save api call   
    return of(true);
  }
}
