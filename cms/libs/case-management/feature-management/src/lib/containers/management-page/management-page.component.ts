/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
/** External libraries **/
import { catchError, filter, first, forkJoin, mergeMap, of, Subject, Subscription } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade,  NavigationType, CaseManagerFacade, StatusFlag } from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { threadId } from 'worker_threads';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementPageComponent implements OnInit, OnDestroy {
  /** Public properties **/
  isVisible: any;
  isSelected = true;
  clientCaseId! : string;
  sessionId! : string;
  clientId ! : number
  clientCaseEligibilityId ! : string
  hasManager! :string
  needManager! : string
  hasManagerValidation =false;
  needManagerValidation =false;

  gridVisibleSubject = new Subject<boolean>();
  showCaseManagers$ = this.gridVisibleSubject.asObservable();

  hasManagerValidationSubject = new Subject<boolean>();
  hasManagerValidation$ = this.hasManagerValidationSubject.asObservable();

  needManagerValidationSubject = new Subject<boolean>();
  needManagerValidation$ = this.needManagerValidationSubject.asObservable();

  getCaseManagers$ = this.caseManagerFacade.getCaseManagers$;
  getCaseManagerHasManagerStatus$=this.caseManagerFacade.getCaseManagerHasManagerStatus$;
  getCaseManagerNeedManagerStatus$=this.caseManagerFacade.getCaseManagerNeedManagerStatus$;
  showAddNewManagerButton$ = this.caseManagerFacade.showAddNewManagerButton$;
  getManagerUsers$ = this.caseManagerFacade.getManagerUsers$;
  selectedCaseManagerDetails$= this.caseManagerFacade.selectedCaseManagerDetails$;
  assignCaseManagerStatus$ = this.caseManagerFacade.assignCaseManagerStatus$;
  removeCaseManager$ = this.caseManagerFacade.removeCaseManager$;
  userImage$ = this.userManagementFacade.userImage$;

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private caseManagerFacade: CaseManagerFacade,
    private route: ActivatedRoute,
    private userManagementFacade : UserManagementFacade) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.addSaveSubscription();
    this.loadCase()
    
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private Methods **/
    
      private loadCase()
      {  
       this.sessionId = this.route.snapshot.queryParams['sid'];    
       this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
        this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
        .subscribe((session: any) => {      
         this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId   
         this.clientCaseEligibilityId =JSON.parse(session.sessionData).clientCaseEligibilityId   
         this.clientId = JSON.parse(session.sessionData).clientId            
         this.getCaseManagerStatus()
        });        
      } 
  getCaseManagerStatus()
  {
    this.caseManagerFacade.getCaseManagerStatus(this.clientCaseId);
    this.getCaseManagerHasManagerStatus$.pipe(filter(x=> typeof x === 'boolean')).subscribe
    ((x: boolean)=>
    {   
      //Currently has HIV Case Manager?
      this.hasManager = (x ===true) ? StatusFlag.Yes : StatusFlag.No;

      //show hide grid
      this.gridVisibleSubject.next(x);
    });

    this.getCaseManagerNeedManagerStatus$.pipe(filter(x=> typeof x === 'boolean')).subscribe
    ((x: boolean)=>
    {  
      //Would you like one?
      this.needManager = (x ===true) ? StatusFlag.Yes : StatusFlag.No;
      this.caseManagerFacade.updateWorkFlow(true)
    });
     
  }

  handlehasManagerRadioChange($event : any)
  {
    this.validate();
  }

  handleNeedManagerRadioChange($event : any)
  {
    this.caseManagerFacade.updateWorkFlow(true)
    this.validate();
  }

  hasManagerChangeEvent(status : boolean)
  {    
     //show hide grid
     this.gridVisibleSubject.next(status);
  }
  loadCaseManagers()
  {
    this.caseManagerFacade.loadCaseManagers(this.clientCaseId);
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Case Manager Status Updated')  
        this.workflowFacade.navigate(navigationType);
      }
    });
  }

  private save() {  
       if(this.validate() === true)
        {
        return  this.caseManagerFacade.updateCaseManagerStatus
          (this.clientCaseId , this.hasManager , this.needManager)
          .pipe
          (
          catchError((err: any) => {                     
            this.workflowFacade.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)          
            return  of(false);
          })  
          )  
        }
        else
        {
          return of(false);
        }
     }

     private validate() : boolean
     {      
      let status =false      
      if(this.hasManager === undefined)
      {
        this.hasManagerValidation = true;
      }
      if(this.hasManager === StatusFlag.Yes)
      {
        this.hasManagerValidation = false;
        status = true;
      }
      
      else if((this.hasManager === StatusFlag.No) && (this.needManager === StatusFlag.No || this.needManager === StatusFlag.Yes))
      {
        this.needManagerValidation = false;
        this.hasManagerValidation = false;
        status = true;
      }
      else if((this.hasManager === StatusFlag.No) && this.needManager === undefined)
      {
        this.needManagerValidation = true;
        this.hasManagerValidation = false;
      }
      this.hasManagerValidationSubject.next(this.hasManagerValidation)
      this.needManagerValidationSubject.next(this.needManagerValidation)
      return status;
     }

 removecaseManagerHandler(deleteCaseManagerCaseId : string)
  {    
    this.caseManagerFacade.removeCaseManager(deleteCaseManagerCaseId)
  }

  searchTextEventHandler(text : string)
  {
   this.caseManagerFacade.searchUsersByRole(text);
  }

  getExistingCaseManagerEventHandler(assignedCaseManagerId : string)
   {        
    if(assignedCaseManagerId)
    {
    this.caseManagerFacade.loadSelectedCaseManagerData(assignedCaseManagerId,this.clientCaseId)
    }
   }


   assignCaseManagerEventHandler(event : any)
   {       
    if(event?.assignedcaseManagerId)
    {
    this.caseManagerFacade.assignCaseManager(this.clientCaseId ,event?.assignedcaseManagerId)
    }
   }

   getCaseManagerImage(assignedCaseManagerId : string)
   {    
       if(assignedCaseManagerId)
       {
       this.userManagementFacade.getUserImage(assignedCaseManagerId);
       }
   }
}
