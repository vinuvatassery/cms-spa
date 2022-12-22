/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  CompletionChecklist, HealthcareProviderFacade, NavigationType, StatusFlag, WorkflowFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { catchError, filter, first, forkJoin, mergeMap, of, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-healthcare-provider-page',
  templateUrl: './healthcare-provider-page.component.html',
  styleUrls: ['./healthcare-provider-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthcareProviderPageComponent implements OnInit, OnDestroy {

 
  clientId ! : number
  clientCaseEligibilityId ! : string

  /** Public properties **/  
  healthCareProviderSearchList$  =this.healthProvider.healthCareProviderSearchList$;
  healthCareProviders$ = this.healthProvider.healthCareProviders$;
  removeHealthProvider$ =this.healthProvider.removeHealthProvider$;
  healthCareProvideGetFlag$  =this.healthProvider.healthCareProvideGetFlag$;
  addExistingProvider$   =this.healthProvider.addExistingProvider$ ;
  loadExistingProvider$  =this.healthProvider.loadExistingProvider$;
  isProvidersGridDisplay =true;
  pageSizes = this.healthProvider.gridPageSizes;
  sortValue  = this.healthProvider.sortValue;
  sortType  = this.healthProvider.sortType;
  sort  = this.healthProvider.sort;
  clientCaseId! : string;
  sessionId! : string;
  providersStatus!: StatusFlag;
  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private checkBoxSubscription !: Subscription;
  
  /** Constructor **/
  constructor(
    private healthProvider:HealthcareProviderFacade,
    private route: ActivatedRoute,
    private workFlowFacade: WorkflowFacade) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {  
    this.saveClickSubscribed();    
    this.loadCase();
  }
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }
   /** Private methods **/
   private loadCase()
   {  
    this.sessionId = this.route.snapshot.queryParams['sid'];    
    this.workFlowFacade.loadWorkFlowSessionData(this.sessionId)
     this.workFlowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
     .subscribe((session: any) => {      
      this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId   
      this.clientCaseEligibilityId =JSON.parse(session.sessionData).clientCaseEligibilityId   
      this.clientId = JSON.parse(session.sessionData).clientId   
      this.loadProviderStatus();      
     });        
   } 

   private loadProviderStatus() : void 
   {    
        this.healthProvider.loadProviderStatusStatus(this.clientCaseEligibilityId);
        this.checkBoxSubscription= 
        this.healthCareProvideGetFlag$.pipe(filter(x=> typeof x === 'boolean')).subscribe
      ((x: boolean)=>
      {  
             
        this.isProvidersGridDisplay = x     
        if(this.isProvidersGridDisplay === true)
        {
          this.updateWorkFlowStatus();
        }
      });
   }

   loadProvidersHandle( gridDataRefinerValue : any ): void
    {    
        const gridDataRefiner = 
        {
          skipcount: gridDataRefinerValue.skipCount,
          maxResultCount : gridDataRefinerValue.pagesize,
          sort : gridDataRefinerValue.sortColumn,
          sortType : gridDataRefinerValue.sortType,
        }
   
        if((this.isProvidersGridDisplay ?? false) == false)
        {
          this.pageSizes = this.healthProvider.gridPageSizes;
        this.healthProvider.loadHealthCareProviders(this.clientCaseEligibilityId
          , gridDataRefiner.skipcount ,gridDataRefiner.maxResultCount  ,gridDataRefiner.sort , gridDataRefiner.sortType);
        }
    }

  private removeHealthCareProvider(ProviderId : string){
     this.healthProvider.removeHealthCareProviders(this.clientCaseEligibilityId, ProviderId);      
  }

  /** Private Methods **/
  private saveClickSubscribed(): void {
    this.saveClickSubscription = this.workFlowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),  
    ).subscribe(([navigationType, isSaved ]) => {         
      if (isSaved == true) {    
        this.workFlowFacade.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Providers Status Updated')  
        this.checkBoxSubscription.unsubscribe();      
        this.workFlowFacade.navigate(navigationType);
      }
    });
  }


  private save() {       
    this.providersStatus = this.isProvidersGridDisplay == true ? StatusFlag.Yes : StatusFlag.No
     return  this.healthProvider.updateHealthCareProvidersFlag
      (this.clientCaseEligibilityId,this.providersStatus)
       .pipe
      (
       catchError((err: any) => {                     
         this.workFlowFacade.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)          
         return  of(false);
       })  
      )  
     }

  /** Internal event methods **/
  onProviderValueChanged() {   
     
    this.isProvidersGridDisplay = !this.isProvidersGridDisplay;    
    this.providersStatus = this.isProvidersGridDisplay == true ? StatusFlag.Yes : StatusFlag.No

   
    this.healthProvider.updateHealthCareProvidersFlagonCheck
      (this.clientCaseEligibilityId,this.providersStatus).subscribe((isSaved) => {         
        if (isSaved == true) {    
          this.workFlowFacade.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Provider Status Updated')  
          if(this.isProvidersGridDisplay === true)
          {
            this.updateWorkFlowStatus();
          }    
         }
      });       
  }

/** events from child components**/
   handlePrvRemove(prvSelectedId : string)
   {        
      this.removeHealthCareProvider(prvSelectedId);                  
   }

   searchTextEventHandleer(text : string)
   {
    this.healthProvider.searchHealthCareProviders(text, this.clientCaseEligibilityId);
   }

   addExistingProviderEventHandler(existProviderData : any)
   {
    existProviderData.clientCaseEligibilityId = this.clientCaseEligibilityId
   this.healthProvider.addExistingHealthCareProvider(existProviderData)
      
   }
  
   getExistingProviderEventHandler(prvSelectedId : string)
   {        
    if(prvSelectedId)
    {
    this.healthProvider.loadExistingHealthCareProvider(this.clientCaseEligibilityId,prvSelectedId)
    }
   }

   updateWorkFlowStatus() 
   {
     const workFlowdata: CompletionChecklist[] = [{
       dataPointName: 'health_care_provider',
       status: StatusFlag.Yes 
     }];
 
     this.workFlowFacade.updateChecklist(workFlowdata);
   }
}
