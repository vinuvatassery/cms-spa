/** Angular **/
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
/** External libraries **/
import { catchError, filter, first, forkJoin, mergeMap, of, Subject, Subscription, tap } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade,  NavigationType, CaseManagerFacade, StatusFlag, CompletionChecklist } from '@cms/case-management/domain';
import { SnackBarNotificationType, LoaderService } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementPageComponent implements OnInit, OnDestroy, AfterViewInit {
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

  pageSizes = this.caseManagerFacade.gridPageSizes;
  sortValue = this.caseManagerFacade.sortValue;
  sortType = this.caseManagerFacade.sortType;
  sort = this.caseManagerFacade.sort;

  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  private discardChangesSubscription !: Subscription;
  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private caseManagerFacade: CaseManagerFacade,
    private route: ActivatedRoute,
    private userManagementFacade : UserManagementFacade,
    private loaderService:LoaderService,
    private router : Router,
    private cdr: ChangeDetectorRef) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.addSaveSubscription();
    this.loadCase()
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
    this.getCaseManagerHasManagerStatus$.pipe(filter(x=> typeof x === 'boolean'))
    .subscribe((x: boolean)=>
    {   
      //Currently has HIV Case Manager?
      this.hasManager='';
      this.hasManager = (x ===true) ? StatusFlag.Yes : StatusFlag.No;
      this.cdr.detectChanges();
      this.adjustDataAttribute();
      //show hide grid
      this.gridVisibleSubject.next(x);
    });

    this.getCaseManagerNeedManagerStatus$.pipe(filter(x=> typeof x === 'boolean'))
    .subscribe((x: boolean)=>
    {  
      //Would you like one?
      this.needManager='';
      this.needManager = (x ===true) ? StatusFlag.Yes : StatusFlag.No;
      this.cdr.detectChanges();
      this.caseManagerFacade.updateWorkFlow(true)
    });
     
  }

  handlehasManagerRadioChange($event : any)
  {
    this.validate();
    this.adjustDataAttribute();
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

  loadCaseManagers(gridDataRefinerValue: any): void {   
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sort: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
    };

    this.pageSizes = this.caseManagerFacade.gridPageSizes;
    this.caseManagerFacade.loadCaseManagers(
      this.clientCaseId,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sort,
      gridDataRefiner.sortType,
      false
    );   
  }
 

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      tap(() => this.workflowFacade.disableSaveButton()),
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Case Manager Status Updated')  
        this.workflowFacade.navigate(navigationType);
      } else {
        this.workflowFacade.enableSaveButton();
      }
    });
  }

  private save() {  
       if(this.validate() === true)
        {
        return  this.caseManagerFacade.updateCaseManagerStatus
          (this.clientCaseId , this.hasManager , this.needManager)
          .pipe(
            catchError((err: any) => {                     
              this.workflowFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err)          
              return  of(false);
            })  
          );  
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

     removecaseManagerHandler(data : any)
     {    
       this.caseManagerFacade.removeCaseManager(this.clientCaseId, data?.endDate, data?.assignedcaseManagerId)
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

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
      if (this.checkValidations()) {
        this.save().subscribe((response: any) => {
          if (response) {
            this.loaderService.hide();
            this.workflowFacade.handleSendNewsLetterpopup(statusResponse, this.clientCaseId)
          }
        })
      }
      else {
        this.workflowFacade.handleSendNewsLetterpopup(statusResponse, this.clientCaseId)
      }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        if(!this.checkValidations()){
          this.workflowFacade.showCancelApplicationPopup(true);
        }
        else{
          this.workflowFacade.showSaveForLaterConfirmationPopup(true);
        }
      }
    });
  }

  private updateWorkflowCount(dataPointName:string, status:StatusFlag){
    const workFlowData: CompletionChecklist[] = [{
      dataPointName: dataPointName,
      status: status
    }];

    this.workflowFacade.updateChecklist(workFlowData);
  }

  private adjustDataAttribute(){
    let data: CompletionChecklist[]=[];
    if(this.hasManager === StatusFlag.Yes)
    {
      data = [{
        dataPointName: 'case_manager_exist',
        status: StatusFlag.Yes
      },
      {
        dataPointName: 'caseManager_not_exist',
        status: StatusFlag.No 
      }];
    }
    else{
      data = [{
        dataPointName: 'case_manager_exist',
        status: StatusFlag.No
      },
      {
        dataPointName: 'caseManager_not_exist',
        status: StatusFlag.Yes 
      }];
    }

    this.workflowFacade.updateBasedOnDtAttrChecklist(data); 
    this.workflowFacade.updateChecklist([{
      dataPointName: 'hasHivCaseManager',
      status: StatusFlag.Yes 
    },{
      dataPointName: 'wouldYouLikeOne',
      status: this.needManager?? StatusFlag.No 
    }]);
  }

  checkValidations(){
    return this.validate();
  }

  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription = this.workflowFacade.discardChangesClicked$.subscribe((response: any) => {
     if(response){
       this.hasManager = '';
       this.needManager = '';
       this.gridVisibleSubject.next(false);
       this.cdr.detectChanges();
       this.getCaseManagerStatus();
     }
    });
  }
}
