/** Angular **/
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  CompletionChecklist, HealthcareProviderFacade, NavigationType, WorkflowFacade, WorkflowTypeCode } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { catchError, filter, first, forkJoin, mergeMap, of, Subject, Subscription, tap } from 'rxjs';

@Component({
  selector: 'case-management-healthcare-provider-page',
  templateUrl: './healthcare-provider-page.component.html',
  styleUrls: ['./healthcare-provider-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthcareProviderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  clientId ! : number 

  /** Public properties **/  
  private showProvidervalidationboxSubject = new Subject<boolean>();
  private showProviderFlagGridSubject = new Subject<boolean>();
  private cerFormSubject = new Subject<boolean>();

  healthCareProviderSearchList$  =this.healthProvider.healthCareProviderSearchList$;
  healthCareProviders$ = this.healthProvider.healthCareProviders$;
  removeHealthProvider$ =this.healthProvider.removeHealthProvider$;
  healthCareProvideGetFlag$  =this.healthProvider.healthCareProvideGetFlag$;
  addExistingProvider$   =this.healthProvider.addExistingProvider$ ;
  loadExistingProvider$  =this.healthProvider.loadExistingProvider$;
  searchProviderLoaded$  =this.healthProvider.searchProviderLoaded$;
  showProvidervalidation$  =this.healthProvider.showProvidervalidation$;
  healthCareProvideGetCerFlag$  =this.healthProvider.healthCareProvideGetCerFlag$;
  healthCareProvideSetCerFlag$  =this.healthProvider.healthCareProvideSetCerFlag$;
  showAddNewProvider$ = this.healthProvider.showAddNewProvider$;;
  healthCareProviderProfilePhoto$ = this.healthProvider.healthCareProviderProfilePhotoSubject;

  showProvidervalidationbox$  = this.showProvidervalidationboxSubject.asObservable();
  showProviderFlagGrid$  = this.showProviderFlagGridSubject.asObservable();
  cerForm$  = this.cerFormSubject.asObservable();

  isProvidersGridDisplay =true;
  pageSizes = this.healthProvider.gridPageSizes;
  sortValue  = this.healthProvider.sortValue;
  sortType  = this.healthProvider.sortType;
  sort  = this.healthProvider.sort;
  clientCaseId! : string;
  sessionId! : string;
  providersStatus!: StatusFlag;
  showProvidervalidationbox! : boolean;
  isCerForm = false;
  prevClientCaseEligibilityId!: string;
  clientCaseEligibilityId!: string;
  treatstheirHIVchangedValue! : string
  workflowTypeCode:any;
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

  ngAfterViewInit(){
    this.workFlowFacade.enableSaveButton();
  }

   /** Private methods **/
   private loadCase()
   {  
    this.healthProvider.showLoader();            
    this.sessionId = this.route.snapshot.queryParams['sid']; 
    this.workflowTypeCode = this.route.snapshot.queryParams['wtc'];   
    this.workFlowFacade.loadWorkFlowSessionData(this.sessionId)
     this.workFlowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
     .subscribe((session: any) => {      
      this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId  
      this.clientId = JSON.parse(session.sessionData).clientId  
      this.clientCaseEligibilityId = JSON.parse(session.sessionData)?.clientCaseEligibilityId;
      this.prevClientCaseEligibilityId = JSON.parse(session.sessionData)?.prevClientCaseEligibilityId;
      if (this.prevClientCaseEligibilityId) 
      {   
         this.isCerForm = true;
      }
      this.healthProvider.hideLoader(); 
      if(this.isCerForm === true)
      {       
         this.loadProviderCerStatus()
      }
      else
      {
        this.showProviderFlagGridSubject.next(true)
        this.loadProviderStatus();      
      }
      this.cerFormSubject.next(this.isCerForm)
     });        
   } 

   private loadProviderCerStatus()
   {
    this.healthProvider.loadProviderCerStatus(this.clientCaseEligibilityId)
    this.healthCareProvideGetCerFlag$.pipe(first(x => x != null))
    .subscribe((x: any)=>
    {  
     if(x === StatusFlag.Yes)
     {
      this.treatstheirHIVchangedValue = StatusFlag.Yes
      this.loadProviderStatus();
      this.showProviderFlagGridSubject.next(true)
     }
     else
     {
      this.updateWorkFlowStatus();
      this.treatstheirHIVchangedValue = StatusFlag.No
      this.showProviderFlagGridSubject.next(false)
     }
    });


   }

   private loadProviderStatus() : void 
   {    
        this.healthProvider.loadProviderStatus(this.clientId);
        this.checkBoxSubscription= 
        this.healthCareProvideGetFlag$.pipe(
          filter(x=> typeof x === 'boolean')
        )
        .subscribe((x: boolean)=>
        {  
          this.isProvidersGridDisplay = x ?? false     
          if(this.isProvidersGridDisplay)
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
   
        if(!(this.isProvidersGridDisplay ?? false))
        {
          this.pageSizes = this.healthProvider.gridPageSizes;
        this.healthProvider.loadHealthCareProviders(this.clientId
          , gridDataRefiner.skipcount ,gridDataRefiner.maxResultCount  ,gridDataRefiner.sort , gridDataRefiner.sortType);
          this.showHideValidation()
        }
    }

  private removeHealthCareProvider(clientProviderId : string){
     this.healthProvider.removeHealthCareProviders(clientProviderId, true);      
  }

  /** Private Methods **/
  private saveClickSubscribed(): void {
    this.saveClickSubscription = this.workFlowFacade.saveAndContinueClicked$.pipe(
      tap(() => this.workFlowFacade.disableSaveButton()),
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),  
    ).subscribe(([navigationType, isSaved ]) => {         
      if (isSaved ) {    
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Providers Status Updated Successfully')  
        this.workFlowFacade.navigate(navigationType);
        this.healthProvider.hideLoader(); 
      } else {
        this.workFlowFacade.enableSaveButton();
      }
    });
  }


  private save() {     
    this.providersStatus = (this.isProvidersGridDisplay ?? false) ? StatusFlag.Yes : StatusFlag.No
    
        if(this.showProvidervalidationbox && !this.isProvidersGridDisplay)
        {        
          this.showProvidervalidationboxSubject.next(true)
          return  of(false);
        }
        else
        {
          this.showProvidervalidationboxSubject.next(false)
          this.healthProvider.showLoader();    
          return  this.healthProvider.updateHealthCareProvidersFlag(this.clientId,this.providersStatus,StatusFlag.Yes )
          .pipe(
            catchError((err: any) => { 
              this.healthProvider.hideLoader();                     
              this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err)          
              return  of(false);
            })  
          );  
        }
     }


     showHideValidation() 
     {    
      this.showProvidervalidation$.pipe(
        filter(x=> typeof x === 'boolean')
      )
      .subscribe((x: boolean)=>
      {        
        this.showProvidervalidationbox = x;       
      });     
     }
  /** Internal event methods **/
  onProviderValueChanged() {   
     
    this.isProvidersGridDisplay = !this.isProvidersGridDisplay;    
    this.providersStatus = (this.isProvidersGridDisplay ?? false) ? StatusFlag.Yes : StatusFlag.No
    
    this.showProvidervalidationboxSubject.next(false)
    
    this.healthProvider.updateHealthCareProvidersFlagonCheck
      (this.clientId,this.providersStatus, StatusFlag.No).subscribe((isSaved) => {  
        this.healthProvider.hideLoader();       
        if (isSaved) {    
          this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Provider Status Updated')   
          if(this.isProvidersGridDisplay ?? false)
            {
              this.updateWorkFlowStatus();
            }   
        }
      });       
  }

/** events from child components**/
   handlePrvRemove(clientProviderId : string)
   {        
      this.removeHealthCareProvider(clientProviderId);                  
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
  
   getExistingProviderEventHandler(clientProviderId : string)
   {        
    if(clientProviderId)
    {
    this.healthProvider.loadExistingHealthCareProvider(clientProviderId)
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
    this.saveForLaterClickSubscription = this.workFlowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
     if(this.checkValidations()){
      this.save().subscribe((response: any) => {
        if (response) {
          this.workFlowFacade.saveForLaterCompleted(true)  
          this.loaderService.hide();
        }
      })
    }else{
      this.workFlowFacade.saveForLaterCompleted(true)  
    }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workFlowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        this.checkValidations()
        this.workFlowFacade.showSaveForLaterConfirmationPopup(true);
      }
    });
  }

  checkValidations() {
    this.providersStatus = (this.isProvidersGridDisplay ?? false) ? StatusFlag.Yes : StatusFlag.No
    if (this.showProvidervalidationbox && !this.isProvidersGridDisplay) {
      this.showProvidervalidationboxSubject.next(true)
      return false;
    }
    return true;
  }

  treatstheirHIVSelected(event: Event) {
    const status = (event.target as HTMLInputElement).value.toUpperCase()
    this.healthProvider.setProviderCerStatus(this.clientCaseEligibilityId , status)
    if(status === StatusFlag.No)
    {
      this.updateWorkFlowStatus();
    }
    this.healthCareProvideSetCerFlag$.pipe(
      filter(x=> typeof x === 'boolean')
    )
    .subscribe((x: boolean)=>
    {  
      this.loadProviderCerStatus()
    });
   
  }

}
