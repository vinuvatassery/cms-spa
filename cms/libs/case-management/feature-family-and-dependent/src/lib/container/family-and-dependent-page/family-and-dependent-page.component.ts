/** Angular **/
import { AfterViewInit, OnDestroy,ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** External libraries **/
import { catchError, filter, first, forkJoin, mergeMap, of, Subject, Subscription, tap } from 'rxjs';

/** Internal libraries **/
import { WorkflowFacade, CompletionStatusFacade, FamilyAndDependentFacade, StatusFlag, Dependent, CompletionChecklist, NavigationType } from '@cms/case-management/domain';
import {LovFacade } from '@cms/system-config/domain'
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-family-and-dependent-page',
  templateUrl: './family-and-dependent-page.component.html',
  styleUrls: ['./family-and-dependent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyAndDependentPageComponent implements OnInit, OnDestroy, AfterViewInit {
  /** Public Methods **/
  dependentList$ = this.familyAndDependentFacade.dependents$;
  previousRelationList$ = this.familyAndDependentFacade.previousRelations$;
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
  isDependentAvailable:boolean= false;
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
  isCerForm = false;
  prevClientCaseEligibilityId!: string;
  haveTheyHaveFamilyMember!: string;
  haveTheyHaveAdditionalFamilyMember! : string;
  previousRelationsList: any = [];
  isCerFormValid: Subject<boolean> = new Subject();
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

  ngAfterViewInit(){
    this.workflowFacade.enableSaveButton();
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
     this.clientId = JSON.parse(session.sessionData).clientId;
     this.prevClientCaseEligibilityId = JSON.parse(session.sessionData)?.prevClientCaseEligibilityId;     
     if(this.prevClientCaseEligibilityId) {
        this.isCerForm =  true;
        this.familyAndDependentFacade.loadPreviousRelations(this.prevClientCaseEligibilityId, this.clientId);
     }
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

    if(!(this.isFamilyGridDisplay ?? false) || this.isCerForm)
    {
      this.pageSizes = this.familyAndDependentFacade.gridPageSizes;
    this.familyAndDependentFacade.loadDependents(this.clientCaseEligibilityId, this.clientId
      , gridDataRefiner.skipcount ,gridDataRefiner.maxResultCount  ,gridDataRefiner.sort , gridDataRefiner.sortType);
    }
  }

  private loadDependentsStatus() : void {
    if(this.isCerForm) {
      this.familyAndDependentFacade.loadDependentsStatus(this.prevClientCaseEligibilityId);
    }
    else {
      this.familyAndDependentFacade.loadDependentsStatus(this.clientCaseEligibilityId);
    }
      this.checkBoxSubscription=
      this.dependentStatus$.subscribe((x: any)=>
    {
      this.isFamilyGridDisplay = x.noDependentFlag == StatusFlag.Yes ? true : false;
      this.haveTheyHaveFamilyMember = x.friendFamilyChangedFlag;
      this.haveTheyHaveAdditionalFamilyMember = x.hasAdditionalFamilyFlag;
    });
    this.dependentList$.subscribe(dependents=>{
      if(dependents.total > 0){
        this.isDependentAvailable = true;        
      }
      else{
        this.isDependentAvailable = false;        
      }
    });
    this.previousRelationList$.subscribe((resp: any)=> {
      this.previousRelationsList = resp.data;
    });
  }
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      tap(() => this.workflowFacade.disableSaveButton()),
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved ]) => {
      if (isSaved) {
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent Status Updated')
        this.checkBoxSubscription.unsubscribe();
        this.workflowFacade.navigate(navigationType);
      } else {
        this.workflowFacade.enableSaveButton();
      }
    });
  }

  onDependentStatusChange(dependent: any, status: string) {
    if(!!dependent.clientRelationshipId) {
      this.familyAndDependentFacade.deleteDependent(this.clientCaseEligibilityId, dependent.clientRelationshipId, this.isCerForm, status);
      this.dependentdelete$.pipe(first((deleteResponse: any ) => deleteResponse != null))
        .subscribe((dependentData: any) =>
        {
          if(dependentData ?? false)
          {
            this.familyAndDependentFacade.loadPreviousRelations(this.prevClientCaseEligibilityId, this.clientId);
          }
        });
    }
  }

  onFamilyMemberStatusChange(status: string) {
    this.familyAndDependentFacade.updateFamilyChangedStatus
    (this.prevClientCaseEligibilityId, status).subscribe((isSaved) => {
      if (isSaved ?? false) {
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Family Changed Status Updated');
      }
    });
  }

  onAdditionalFamilyStatusChange(status: string) {
    this.familyAndDependentFacade.updateAdditionalFamilyStatus
    (this.prevClientCaseEligibilityId, status).subscribe((isSaved) => {
      if (isSaved ?? false) {
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Additional Family Status Updated');
      }
    });
  }

  private save() {
    this.familyStatus = this.isFamilyGridDisplay === true ? StatusFlag.Yes : StatusFlag.No;
    if(this.isCerForm && (!this.haveTheyHaveAdditionalFamilyMember || !this.haveTheyHaveFamilyMember)) {
      this.isCerFormValid.next(false);
      return of(false);
    }
    if((!this.isDependentAvailable && (this.familyStatus === StatusFlag.No) && !this.isCerForm) || (!this.isDependentAvailable && (this.haveTheyHaveAdditionalFamilyMember === StatusFlag.Yes))){
      this.familyAndDependentFacade.dependentValidSubject.next(false);
      return of(false);
    }
    else{
      this.familyAndDependentFacade.dependentValidSubject.next(true);
      return  this.familyAndDependentFacade.saveAndContinueDependents
        (this.clientId, this.clientCaseEligibilityId, this.familyStatus)
      .pipe(catchError((err: any) => {
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        return  of(false);
      })
      )
    }
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
    this.familyStatus = (this.isFamilyGridDisplay ?? false) ? StatusFlag.Yes : StatusFlag.No
    this.familyAndDependentFacade.updateDependentStatus
    (this.clientCaseEligibilityId,this.familyStatus).subscribe((isSaved) => {
      if (isSaved ?? false) {
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent Status Updated')
        if(this.isFamilyGridDisplay ?? false)
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
    dependent.clientId = this.clientId;
    dependentData.clientCaseEligibilityId = this.clientCaseEligibilityId;
    if(dependentData.clientRelationshipId && dependentData.clientRelationshipId !='')
    {
      this.familyAndDependentFacade.updateNewDependent(this.clientCaseEligibilityId, dependentData);
    }
    else
    {
    this.familyAndDependentFacade.addNewDependent(this.clientCaseEligibilityId, dependentData);
    }
  }

  getNewDependentHandle(dependentId : string)
  {
    this.familyAndDependentFacade.getNewDependent(this.clientCaseEligibilityId, dependentId);
  }

  getExistclientDependentEventHandle(dependentId : string)
  {
    this.familyAndDependentFacade.getExistingClientDependent(this.clientCaseEligibilityId, dependentId);
  }

  deleteDependentParamHandle(clientDependentId : any)
  {
      if(clientDependentId)
      {
       this.familyAndDependentFacade.deleteDependent(this.clientCaseEligibilityId, clientDependentId);
      }
  }

  searchTextHandleEventHandle($event : any)
  {
    this.loadDependentSearch($event )
  }

  addUpdateExistingDependentHandle(data : any)
  {
    data.parentClientId =   this.clientId
    this.familyAndDependentFacade.addExistingDependent(this.clientCaseEligibilityId, data);
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
      this.save().subscribe((response: any) => {
        if (response) {
          this.loaderService.hide();
          this.workflowFacade.handleSendNewsLetterpopup(statusResponse)
        }
      })
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        this.checkValidations()
        this.workflowFacade.showSaveForLaterConfirmationPopup(true);
      }
    });
  }

  checkValidations(){
    this.familyStatus = this.isFamilyGridDisplay === true ? StatusFlag.Yes : StatusFlag.No;
    if(this.isCerForm && (!this.haveTheyHaveAdditionalFamilyMember || !this.haveTheyHaveFamilyMember)) {
      this.isCerFormValid.next(false);
      return false;
    }
    if((!this.isDependentAvailable && (this.familyStatus === StatusFlag.No) && !this.isCerForm) || (!this.isDependentAvailable && (this.haveTheyHaveAdditionalFamilyMember === StatusFlag.Yes))){
      this.familyAndDependentFacade.dependentValidSubject.next(false);
      return false;
    }
    return true;
  }
}
