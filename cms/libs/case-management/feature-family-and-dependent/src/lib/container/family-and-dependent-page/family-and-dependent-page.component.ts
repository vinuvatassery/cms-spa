/** Angular **/
import { AfterViewInit, OnDestroy,ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** External libraries **/
import { BehaviorSubject, catchError, first, forkJoin, mergeMap, of, Subject, Subscription, tap } from 'rxjs';

/** Internal libraries **/
import { WorkflowFacade, CompletionStatusFacade, FamilyAndDependentFacade, Dependent, CompletionChecklist, NavigationType} from '@cms/case-management/domain';
import {LovFacade } from '@cms/system-config/domain'
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { StatusFlag } from '@cms/shared/ui-common';

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
  private discardChangesSubscription !: Subscription;
  clientId ! : number
  clientCaseEligibilityId ! : string
  familyStatus! : StatusFlag
  isCerForm = false;
  prevClientCaseEligibilityId!: string;
  haveTheyHaveFamilyMember!: string;
  haveTheyHaveAdditionalFamilyMember! : string;
  previousRelationsList: any = [];
  isCerFormValid: Subject<boolean> = new Subject();
  updatedDependentsStatus: any = [];
  showPrevRelations$ = new BehaviorSubject<boolean>(false);
  dependentProfilePhoto$ = this.familyAndDependentFacade.dependentProfilePhotoSubject;
  workflowTypeCode:any;
  /** Constructor **/
  constructor(
    private familyAndDependentFacade: FamilyAndDependentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private readonly router: Router,
    private readonly workFlowFacade : WorkflowFacade,
    private route: ActivatedRoute,
    private readonly lovFacade : LovFacade,
    private readonly loaderService: LoaderService,
    private readonly cd: ChangeDetectorRef
  ) { }


  /** Lifecycle Hooks **/

  ngOnInit(): void {

    this.lovFacade.getRelationShipsLovs();
    this.loadCase()
    this.addSaveSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
    this.addDiscardChangesSubscription();
   
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
    this.discardChangesSubscription.unsubscribe();
  }

  ngAfterViewInit(){
    this.workflowFacade.enableSaveButton();
  }

  /** Private Methods **/
  private loadCase()
  {
   this.sessionId = this.route.snapshot.queryParams['sid'];
   this.workflowTypeCode = this.route.snapshot.queryParams['wtc'];
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
      , gridDataRefiner.skipcount ,gridDataRefiner.maxResultCount  ,gridDataRefiner.sort , gridDataRefiner.sortType, 'New');
    }
  }

  private loadDependentsStatus() : void {
      this.familyAndDependentFacade.loadDependentsStatus(this.clientCaseEligibilityId);
      this.checkBoxSubscription=
      this.dependentStatus$.subscribe((x: any)=>
    {
      if(this.isCerForm){
        this.cerDataPointAdjustmentChange('additionalFamilyMembers', x.hasAdditionalFamilyFlag);
        this.cerDataPointAdjustmentChange('haveFamilyMembersChanged', x.friendFamilyChangedFlag);
      }
      this.showPrevRelations$.next(x.friendFamilyChangedFlag === StatusFlag.Yes);
      this.isFamilyGridDisplay = x.noDependentFlag == StatusFlag.Yes ? true : false;
      this.haveTheyHaveFamilyMember = x.friendFamilyChangedFlag === null?'':x.friendFamilyChangedFlag;
      this.haveTheyHaveAdditionalFamilyMember = x.hasAdditionalFamilyFlag ===null?'':x.hasAdditionalFamilyFlag;
      this.cd.detectChanges();
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
      this.previousRelationsList = resp;
      this.cerDataPointAdjustmentChange('haveFamilyMembersChanged', this.haveTheyHaveFamilyMember);
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
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent Status Updated Successfully')
        this.checkBoxSubscription.unsubscribe();
        this.workflowFacade.navigate(navigationType);
      } else {
        this.workflowFacade.enableSaveButton();
      }
    });
  }

  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription = this.workflowFacade.discardChangesClicked$.subscribe((response: any) => {
      if (response) { 
       this.loadDependentsStatus();
      }
    });
  }

  onDependentStatusChange(dependent: any, status: string) {
    if(this.updatedDependentsStatus.length > 0){
      let checkDependentIndex = this.updatedDependentsStatus.findIndex((x: any)=>x.dependentId == dependent.clientRelationshipId);
      if(checkDependentIndex >= 0) {
        this.updatedDependentsStatus[checkDependentIndex]['status'] = status;
      } else {
        this.updatedDependentsStatus.push({'dependentId': dependent.clientRelationshipId, 'status': status});
      }
    }
    else {
      this.updatedDependentsStatus.push({'dependentId': dependent.clientRelationshipId, 'status': status});
    }

    this.updateWorkFlowStatus(dependent.clientRelationshipId, dependent.cerReviewStatusCode ? StatusFlag.Yes: StatusFlag.No);
  }

  updateEligibilityStatusDetails() {
    let request = {
      'friendFamilyChangedFlag': this.haveTheyHaveFamilyMember,
      'hasAdditionalFamilyFlag': this.haveTheyHaveAdditionalFamilyMember,
      'dependentsDetails': this.updatedDependentsStatus,
      prvEligibilityId : this.prevClientCaseEligibilityId
    }
    this.familyAndDependentFacade.updateEligibilityStatusDetails(this.clientCaseEligibilityId, request).subscribe((isSaved: any) => {
      if (isSaved ?? false) {
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Eligibility details updated.');
      }
    });
  }

  private save() {
    this.familyStatus = this.isFamilyGridDisplay === true ? StatusFlag.Yes : StatusFlag.No;
    if(this.isCerForm) {
      const isValid = this.familyAndDependentFacade.validateCer(this.haveTheyHaveFamilyMember, this.haveTheyHaveAdditionalFamilyMember, this.previousRelationsList);
      if(!isValid){
        this.isCerFormValid.next(isValid);
        return of(false);
      }
    }
    if((!this.isDependentAvailable && (this.familyStatus === StatusFlag.No) && !this.isCerForm) || (!this.isDependentAvailable && (this.haveTheyHaveAdditionalFamilyMember === StatusFlag.Yes))){
      this.familyAndDependentFacade.dependentValidSubject.next(false);
      return of(false);
    }
    else{
      let request: any = {
        noDependentFlag : this.familyStatus
      };
      if(this.isCerForm){
        request = {
          prvEligibilityId : this.prevClientCaseEligibilityId,
          isCer: this.isCerForm,
          friendFamilyChangedFlag: this.haveTheyHaveFamilyMember,
          hasAdditionalFamilyFlag: this.haveTheyHaveAdditionalFamilyMember,
          dependentsDetails: this.updatedDependentsStatus,
        };
      }
      this.familyAndDependentFacade.dependentValidSubject.next(true);
      return  this.familyAndDependentFacade.saveAndContinueDependents
        (this.clientId, this.clientCaseEligibilityId, request)
      .pipe(catchError((err: any) => {
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        return  of(false);
      })
      )
    }
    }

     private updateWorkFlowStatus(dataPointName: string, status: string)
     {
       const workFlowData: CompletionChecklist[] = [{
         dataPointName: dataPointName,
         status: status
       }];

       this.workFlowFacade.updateChecklist(workFlowData);
     }

  /** Internal event methods **/
  onNoFamilyMemberClicked() {
    this.isFamilyGridDisplay = !this.isFamilyGridDisplay;
    this.familyStatus = (this.isFamilyGridDisplay ?? false) ? StatusFlag.Yes : StatusFlag.No
    this.familyAndDependentFacade.updateDependentStatus
    (this.clientCaseEligibilityId,this.familyStatus).subscribe((isSaved) => {
      if (isSaved ?? false) {
        this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Dependent Status Updated Successfully')
        if(this.isFamilyGridDisplay ?? false)
        {
          this.updateWorkFlowStatus('family_dependents', StatusFlag.Yes);
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
     if(this.checkValidations()){
      this.save().subscribe((response: any) => {
        if (response) {
          this.workflowFacade.saveForLaterCompleted(true)  
          this.loaderService.hide();
     
        } 
      })
    } else {
      this.workflowFacade.saveForLaterCompleted(true)
    }
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

  onFamilyChangeClicked(dataPointName: string, value:string){
    if(this.previousRelationsList && this.haveTheyHaveFamilyMember === StatusFlag.Yes){
      this.showPrevRelations$.next(true);
      this.familyAndDependentFacade.reloadPreviousRelations(this.previousRelationsList);
    }else{
      this.showPrevRelations$.next(false);
    }

    this.cerDataPointAdjustmentChange(dataPointName, value);
  }

  cerDataPointAdjustmentChange(dataPointName: string, value:string){
    let prevDependentsDtPoints: CompletionChecklist[]  = [];
    if(dataPointName === 'haveFamilyMembersChanged'){
      prevDependentsDtPoints = this.previousRelationsList.map((dependent:any)=>{  
        const reviewStatus = dependent?.cerReviewStatusCode ? StatusFlag.Yes : StatusFlag.No;    
        return {
          dataPointName: dependent.clientRelationshipId,
          status: value === StatusFlag.Yes ? reviewStatus : StatusFlag.No
        }
      });

      this.updateDynamicDtPoints(prevDependentsDtPoints, value);
     
    }

    if(dataPointName === 'additionalFamilyMembers'){
      const dtPoint = [{
        dataPointName: 'family_dependents',
        status: StatusFlag.No
      }];

      this.updateDynamicDtPoints(dtPoint, value);  
    }

    this.updateWorkFlowStatus(dataPointName, value? StatusFlag.Yes: StatusFlag.No);
  }

  updateDynamicDtPoints(checkList:CompletionChecklist[], status: string){
    if(checkList?.length > 0){
      if(status === StatusFlag.Yes){
        this.workflowFacade.addDynamicDataPoints(checkList);
      }
      else{
        this.workflowFacade.removeDynamicDataPoints(checkList);
      }
  }
  }

}
