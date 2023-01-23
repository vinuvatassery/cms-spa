/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  CompletionChecklist, HealthcareProviderFacade, NavigationType, StatusFlag, WorkflowFacade } from '@cms/case-management/domain';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { catchError, filter, first, forkJoin, mergeMap, of, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-healthcare-provider-page',
  templateUrl: './healthcare-provider-page.component.html',
  styleUrls: ['./healthcare-provider-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthcareProviderPageComponent implements OnInit, OnDestroy {

  clientId ! : number 

  /** Public properties **/  
  private showProvidervalidationboxSubject = new Subject<boolean>();

  healthCareProviderSearchList$  =this.healthProvider.healthCareProviderSearchList$;
  healthCareProviders$ = this.healthProvider.healthCareProviders$;
  removeHealthProvider$ =this.healthProvider.removeHealthProvider$;
  healthCareProvideGetFlag$  =this.healthProvider.healthCareProvideGetFlag$;
  addExistingProvider$   =this.healthProvider.addExistingProvider$ ;
  loadExistingProvider$  =this.healthProvider.loadExistingProvider$;
  searchProviderLoaded$  =this.healthProvider.searchProviderLoaded$;
  showProvidervalidation$  =this.healthProvider.showProvidervalidation$;
  showProvidervalidationbox$  = this.showProvidervalidationboxSubject.asObservable();
  isProvidersGridDisplay =true;
  pageSizes = this.healthProvider.gridPageSizes;
  sortValue  = this.healthProvider.sortValue;
  sortType  = this.healthProvider.sortType;
  sort  = this.healthProvider.sort;
  clientCaseId! : string;
  sessionId! : string;
  providersStatus!: StatusFlag;
  showProvidervalidationbox! : boolean;
  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private checkBoxSubscription !: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  
  /** Constructor **/
  constructor(
    private readonly healthProvider:HealthcareProviderFacade,
    private readonly route: ActivatedRoute,
    private readonly workFlowFacade: WorkflowFacade,
	  private readonly loaderService: LoaderService,
    private readonly router :Router) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {  
    this.saveClickSubscribed();    
    this.loadCase();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
  }
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
  }
   /** Private methods **/
   private loadCase()
   {  
    this.healthProvider.showLoader();            
    this.sessionId = this.route.snapshot.queryParams['sid'];    
    this.workFlowFacade.loadWorkFlowSessionData(this.sessionId)
     this.workFlowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
     .subscribe((session: any) => {      
      this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId  
      this.clientId = JSON.parse(session.sessionData).clientId  
      this.healthProvider.hideLoader(); 
      this.loadProviderStatus();      
     });        
   } 

   private loadProviderStatus() : void 
   {    
        this.healthProvider.loadProviderStatusStatus(this.clientId);
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
      this.showProvidervalidationboxSubject.next(false)
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
        this.healthProvider.loadHealthCareProviders(this.clientId
          , gridDataRefiner.skipcount ,gridDataRefiner.maxResultCount  ,gridDataRefiner.sort , gridDataRefiner.sortType);
          this.showHideValidation()
        }
    }

  private removeHealthCareProvider(ProviderId : string){
     this.healthProvider.removeHealthCareProviders(this.clientId, ProviderId);      
  }

  /** Private Methods **/
  private saveClickSubscribed(): void {
    this.saveClickSubscription = this.workFlowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),  
    ).subscribe(([navigationType, isSaved ]) => {         
      if (isSaved == true) {    
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Providers Status Updated')  
        this.checkBoxSubscription.unsubscribe();      
        this.workFlowFacade.navigate(navigationType);
        this.healthProvider.hideLoader(); 
      }
    });
  }


  private save() {     
    this.providersStatus = this.isProvidersGridDisplay == true ? StatusFlag.Yes : StatusFlag.No
    
        if(this.showProvidervalidationbox && !this.isProvidersGridDisplay)
        {        
          this.showProvidervalidationboxSubject.next(true)
          return  of(false);
        }
        else
        {
          this.showProvidervalidationboxSubject.next(false)
          this.healthProvider.showLoader();    
          return  this.healthProvider.updateHealthCareProvidersFlag
            (this.clientId,this.providersStatus)
            .pipe
            (
            catchError((err: any) => { 
              this.healthProvider.hideLoader();                     
              this.workFlowFacade.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)          
              return  of(false);
            })  
            )  
        }
     }


     showHideValidation() 
     {    
      this.showProvidervalidation$.pipe(filter(x=> typeof x === 'boolean')).subscribe
      ((x: boolean)=>
      {        
        this.showProvidervalidationbox = x;       
      });     
     }
  /** Internal event methods **/
  onProviderValueChanged() {   
     
    this.isProvidersGridDisplay = !this.isProvidersGridDisplay;    
    this.providersStatus = this.isProvidersGridDisplay == true ? StatusFlag.Yes : StatusFlag.No
    
    this.showProvidervalidationboxSubject.next(false)
    
    this.healthProvider.updateHealthCareProvidersFlagonCheck
      (this.clientId,this.providersStatus).subscribe((isSaved) => {  
        this.healthProvider.hideLoader();       
        if (isSaved == true) {    
          this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Provider Status Updated')   
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
    this.healthProvider.searchHealthCareProviders(text, this.clientId);
   }

   addExistingProviderEventHandler(existProviderData : any)
   {
    existProviderData.clientId = this.clientId
   this.healthProvider.addExistingHealthCareProvider(existProviderData)
      
   }
  
   getExistingProviderEventHandler(prvSelectedId : string)
   {        
    if(prvSelectedId)
    {
    this.healthProvider.loadExistingHealthCareProvider(this.clientId,prvSelectedId)
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

   private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workFlowFacade.saveForLaterClicked$.pipe(
      mergeMap((statusResponse: boolean) =>
        forkJoin([of(statusResponse), this.save()])
      ),
    ).subscribe(([statusResponse, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.router.navigate([`/case-management/cases/case360/${this.clientCaseId}`])
      }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workFlowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
          this.workFlowFacade.showSaveForLaterConfirmationPopup(true);
      }
    });
  }

}
