/** Angular **/
import { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** External libraries **/
import { first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
import { WorkflowFacade, CompletionStatusFacade, FamilyAndDependentFacade, StatusFlag, Dependent } from '@cms/case-management/domain';
/** Enums **/
import {  NavigationType } from '@cms/case-management/domain';

import {LovType , LovFacade } from '@cms/system-config/domain'


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
  isFamilyGridDisplay = true;
  clientCaseId! : string;
  sessionId! : string;

  /** Private properties **/
  private saveClickSubscription !: Subscription;
  clientId = 1
  clientCaseEligibilityId! : string
  familyStatus! : StatusFlag
  /** Constructor **/
  constructor(
    private familyAndDependentFacade: FamilyAndDependentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private readonly router: Router,
    private readonly workFlowFacade : WorkflowFacade,
    private route: ActivatedRoute,
    private readonly lovFacade : LovFacade
  ) { }


  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.lovFacade.getRelationShipsLovs(); 
    this.loadCase()   
    this.addSaveSubscription();
    this.loadDependentsStatus(); 
    this.loadDependentSearch();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private Methods **/
  private loadCase()
  {     
   this.sessionId = this.route.snapshot.queryParams['sid'];    
   this.workFlowFacade.loadWorkFlowSessionData(this.sessionId)
    this.workFlowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
    .subscribe((session: any) => {      
     this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId   
     this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId   
     this.clientId = 1//JSON.parse(session.sessionData).clientId   
     this.loadDependents();
    });        
  } 

  private loadDependents(): void {
    this.familyAndDependentFacade.loadDependents(this.clientId);
  }

  private loadDependentsStatus() : void {
    this.familyAndDependentFacade.loadDependentsStatus(this.clientCaseEligibilityId);
  }

  private updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.navigate(navigationType);
      }
    });
  }

  private save() {   
    this.familyStatus = this.isFamilyGridDisplay == true ? StatusFlag.Yes : StatusFlag.No
       this.familyAndDependentFacade.updateDependentStatus
      (this.clientCaseEligibilityId,this.familyStatus);      
      return this.familyAndDependentFacade.dependentStatus$;
     }

  /** Internal event methods **/
  onChangeCounterClick() {
    this.updateCompletionStatus({
      name: 'Family & Dependents',
      completed: 15,
      total: 31,
    });
  }

  onNoFamilyMemberClicked() {
    this.isFamilyGridDisplay = !this.isFamilyGridDisplay;
  }

  private loadDependentSearch() {
    this.familyAndDependentFacade.loadDependentSearch();
  }

/** child event methods **/

  addUpdateDependentHandle(dependent : any) {    
   const dependentData : Dependent = dependent;
   
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
}
