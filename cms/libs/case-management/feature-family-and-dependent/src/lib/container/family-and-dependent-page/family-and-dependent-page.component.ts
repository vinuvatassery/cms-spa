/** Angular **/
import { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** External libraries **/
import { catchError, filter, first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
import { WorkflowFacade, CompletionStatusFacade, FamilyAndDependentFacade, StatusFlag, Dependent, CompletionChecklist } from '@cms/case-management/domain';
/** Enums **/
import {  NavigationType } from '@cms/case-management/domain';

import {LovFacade } from '@cms/system-config/domain' 
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';


@Component({
  selector: 'case-management-family-and-dependent-page',
  templateUrl: './family-and-dependent-page.component.html',
  styleUrls: ['./family-and-dependent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyAndDependentPageComponent implements OnInit, OnDestroy {
  /** Public Methods **/
  dependentList$ = this.familyAndDependentFacade.dependents$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  dependentSearch$ = this.familyAndDependentFacade.dependentSearch$;
  ddlRelationships$ = this.lovFacade.lovRelationShip$;
  dependentStatus$  = this.familyAndDependentFacade.dependentStatusGet$;
  dependentGet$= this.familyAndDependentFacade.dependentGetNew$;
  dependentGetExisting$ =this.familyAndDependentFacade.dependentGetExisting$;
  dependentdelete$  = this.familyAndDependentFacade.dependentdelete$;
  dependentAddNewGet$= this.familyAndDependentFacade.dependentAddNewGet$
  dependentUpdateNew$=this.familyAndDependentFacade.dependentUpdateNew$
  existdependentStatus$ =this.familyAndDependentFacade.existdependentStatus$ 
  isFamilyGridDisplay =true;
  clientCaseId! : string;
  sessionId! : string;
  pageSizes = this.familyAndDependentFacade.gridPageSizes;
  sortValue  = this.familyAndDependentFacade.sortValue;
  sortType  = this.familyAndDependentFacade.sortType;
  sort  = this.familyAndDependentFacade.sort;
  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private checkBoxSubscription !: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  clientId ! : number
  clientCaseEligibilityId ! : string
  familyStatus! : StatusFlag  


  /** Constructor **/
  constructor(
    private familyAndDependentFacade: FamilyAndDependentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private readonly router: Router,
    private readonly workFlowFacade : WorkflowFacade,
    private route: ActivatedRoute,
    private readonly lovFacade : LovFacade,
    private readonly loaderService: LoaderService  
  ) { }


  /** Lifecycle Hooks **/
 
  ngOnInit(): void {   
   
    this.lovFacade.getRelationShipsLovs(); 
    this.loadCase()   
    this.addSaveSubscription();    
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe(); 
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
  }

  /** Private Methods **/
  private loadCase()
  {  
   this.sessionId = this.route.snapshot.queryParams['sid'];    
   this.workFlowFacade.loadWorkFlowSessionData(this.sessionId)
    this.workFlowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
    .subscribe((session: any) => {      
     this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId   
     this.clientCaseEligibilityId =JSON.parse(session.sessionData).clientCaseEligibilityId   
     this.clientId = JSON.parse(session.sessionData).clientId   
     this.loadDependentsStatus();      
    });        
  } 

  loadDependentsHandle( gridDataRefinerValue : any ): void {    
    const gridDataRefiner = 
    {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount : gridDataRefinerValue.pagesize,
      sort : gridDataRefinerValue.sortColumn,
      sortType : gridDataRefinerValue.sortType,
    }
   
    if((this.isFamilyGridDisplay ?? false) == false)
    {
      this.pageSizes = this.familyAndDependentFacade.gridPageSizes;
    this.familyAndDependentFacade.loadDependents(this.clientId
      , gridDataRefiner.skipcount ,gridDataRefiner.maxResultCount  ,gridDataRefiner.sort , gridDataRefiner.sortType);
    }
  }

  private loadDependentsStatus() : void {    
      this.familyAndDependentFacade.loadDependentsStatus(this.clientCaseEligibilityId);
      this.checkBoxSubscription= 
      this.dependentStatus$.pipe(filter(x=> typeof x === 'boolean')).subscribe
    ((x: boolean)=>
    {               
      this.isFamilyGridDisplay = x
     
    });
  }
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),  
    ).subscribe(([navigationType, isSaved ]) => {         
      if (isSaved == true) {    
        this.workFlowFacade.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent Status Updated')  
        this.checkBoxSubscription.unsubscribe();      
        this.workflowFacade.navigate(navigationType);
      }
    });
  }

  private save() {       
    this.familyStatus = this.isFamilyGridDisplay == true ? StatusFlag.Yes : StatusFlag.No
     return  this.familyAndDependentFacade.updateDependentStatus
      (this.clientCaseEligibilityId,this.familyStatus)
       .pipe
      (
       catchError((err: any) => {                     
         this.workFlowFacade.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)          
         return  of(false);
       })  
      )  
     }

     private updateWorkFlowStatus() 
     {
       const workFlowdata: CompletionChecklist[] = [{
         dataPointName: 'family_dependents',
         status: StatusFlag.Yes 
       }];
   
       this.workFlowFacade.updateChecklist(workFlowdata);
     }
    
  /** Internal event methods **/
  onNoFamilyMemberClicked() {      
    this.isFamilyGridDisplay = !this.isFamilyGridDisplay;    
    this.familyStatus = this.isFamilyGridDisplay == true ? StatusFlag.Yes : StatusFlag.No
    this.familyAndDependentFacade.updateDependentStatus
    (this.clientCaseEligibilityId,this.familyStatus).subscribe((isSaved) => {         
      if (isSaved == true) {    
        this.workFlowFacade.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent Status Updated')        
        if(this.isFamilyGridDisplay === true)
        {
          this.updateWorkFlowStatus();
        }              
      }
    });    
   
  }

  private loadDependentSearch(text : string ) {
    this.familyAndDependentFacade.loadDependentSearch(text , this.clientId);
  }

/** child event methods **/

  addUpdateDependentHandle(dependent : any) {    
   const dependentData : Dependent = dependent;   
   dependent.clientId =this.clientId ;
    if(dependentData.clientDependentId && dependentData.clientDependentId !='')
    {
      this.familyAndDependentFacade.UpdateNewDependent(dependentData);
    }
    else
    {
    this.familyAndDependentFacade.AddNewDependent(dependentData);
    }
  }

  GetNewDependentHandle(dependentId : string)
  {
    this.familyAndDependentFacade.GetNewDependent(dependentId);
  }

  GetExistclientDependentEventHandle(dependentId : string)
  {
    this.familyAndDependentFacade.GetExistingClientDependent(dependentId);
  }

  deleteDependentParamHandle(clientDependentId : any)
  {      
      if(clientDependentId)
      {
       this.familyAndDependentFacade.DeleteDependent(clientDependentId);
      }      
  }

  searchTextHandleEventHandle($event : any)
  {    
    this.loadDependentSearch($event )
  }

  AddUpdateExistingDependentHandle(data : any)
  {
    data.parentClientId =   this.clientId 
    this.familyAndDependentFacade.AddExistingDependent(data);
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.pipe(
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
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        if(this.checkValidations()){
          this.workflowFacade.showSaveForLaterConfirmationPopup(true);
        }
      }
    });
  }

  checkValidations(){
    return true;
  }
 
}
