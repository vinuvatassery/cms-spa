/** Angular **/
import {
  Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
/** Internal Libraries **/
import { CaseFacade, WorkflowFacade,
   UserDefaultRoles, NavigationType, CompletionChecklist, StatusFlag  } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {LovFacade , UserManagementFacade} from '@cms/system-config/domain'

/**external libraries */
import { catchError, debounceTime, distinctUntilChanged, first, forkJoin, mergeMap, of, pairwise, startWith, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-case-summary',
  templateUrl: './case-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CaseSummaryComponent implements OnInit , OnDestroy {
  /** Public properties **/

  parentForm!: FormGroup;
  isProgramSelectionOpened = false;
  selectedProgram!: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  caseDetailSummary!: FormGroup;
  isSubmitted!: boolean;

  /** Public properties for case child form**/
  caseSearchResults$ = this.caseFacade.caseSearched$;
  caseOwners$ = this.loginUserFacade.usersByRole$;
  ddlPrograms$ = this.caseFacade.ddlPrograms$;
  ddlCaseOrigins$ = this.lovFacade.caseoriginlov$;
  case$ = this.caseFacade.getCase$;
  clientCaseId! : string;
  sessionId! : string; 
  updateCase$ = this.caseFacade.updateCase$;
  private saveClickSubscription !: Subscription;
  private sessionDataSubscription !: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;

  /** Constructor**/
  constructor(
    private readonly router: Router,
    private readonly caseFacade: CaseFacade,
    private readonly ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly workFlowFacade : WorkflowFacade,
    private readonly loginUserFacade : UserManagementFacade,
    private readonly lovFacade : LovFacade ,
    private loaderService: LoaderService
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {   
    this.loadFormdata();
    this.addSaveSubscription();
    /** methods for case child form **/
    this.registerFormData();
    this.addFormChangeSubscription();
 	this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
  } 
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.sessionDataSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
  }

    private loadFormdata()
    {      
      this.loginUserFacade.getUsersByRole(UserDefaultRoles.CACaseWorker);
      this.caseFacade.loadDdlPrograms();
      this.lovFacade.getCaseOriginLovs(); 
      this.loadCase();
    }

  private loadCase()
  {     
   this.sessionId = this.route.snapshot.queryParams['sid'];    
   this.workFlowFacade.loadWorkFlowSessionData(this.sessionId)
    this.sessionDataSubscription =this.workFlowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
    .subscribe((session: any) => {      
     this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId     
     this.caseFacade.loadCasesById(this.clientCaseId);      
    });        
  } 

   /** Private methods **/
  private registerFormData() {

    this.parentForm = this.formBuilder.group({
      applicationDate: ['', Validators.required],
      caseOriginCode: ['', Validators.required],
      caseOwnerId: ['', Validators.required],
      programId: [{ value: '', disabled: true }, [Validators.required]],
      concurrencyStamp : ['']
    });
   
  }

   
    private addSaveSubscription(): void {
      this.saveClickSubscription = this.workFlowFacade.saveAndContinueClicked$.pipe(
        mergeMap((navigationType: NavigationType) =>
          forkJoin([of(navigationType), this.updateCase()])
        ),       
      ).subscribe(([navigationType, isSaved]) => {
        if (isSaved == true) {
          this.workFlowFacade.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'Case data Updated')  
          this.workFlowFacade.navigate(navigationType);
        }
      });
    }

    private updateCase()
    {      
      this.parentForm.updateValueAndValidity()
      if(this.parentForm.valid)
      {
       return  this.caseFacade.UpdateCase(this.parentForm ,this.clientCaseId)
       .pipe
       (
        catchError((err: any) => {      
          this.workFlowFacade.ShowHideSnackBar(SnackBarNotificationType.ERROR , err) 
          
          return of(false)  
        })
       )     
      }
      else return of(false)
    }

    /*Private methods*/
 private addFormChangeSubscription() {
  this.parentForm.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(null), 
      pairwise()
    )
    .subscribe(([prev, curr]: [any, any]) => {
      this.updateFormCompleteCount(prev, curr);      
    });
}

private updateFormCompleteCount(prev: any, curr: any) {
  let completedDataPoints: CompletionChecklist[] = [];
  Object.keys(this.parentForm.controls).forEach(key => {
    if (prev && curr) {
      if (prev[key] !== curr[key]) {
        let item: CompletionChecklist = {
          dataPointName: key,
          status: curr[key] ? StatusFlag.Yes : StatusFlag.No
        };
        console.log(key);
        completedDataPoints.push(item);
      }
    }
    else {
      if (this.parentForm?.get(key)?.value && this.parentForm?.get(key)?.valid) {
        let item: CompletionChecklist = {
          dataPointName: key,
          status: StatusFlag.Yes
        };

        completedDataPoints.push(item);
      }
    }
  });

  if (completedDataPoints.length > 0) {
    console.log(completedDataPoints);
   this.workFlowFacade.updateChecklist(completedDataPoints);
  }
}

private addSaveForLaterSubscription(): void {
      this.saveForLaterClickSubscription = this.workFlowFacade.saveForLaterClicked$.pipe(
        mergeMap((statusResponse: boolean) =>
          forkJoin([of(statusResponse), this.updateCase()])
        ),
      ).subscribe(([statusResponse, isSaved]) => {
        if (isSaved) {
          this.loaderService.hide();
          this.router.navigate(['/case-management/cases/case360/100'])
        }
      });
    }
  
    private addSaveForLaterValidationsSubscription(): void {
      this.saveForLaterValidationSubscription = this.workFlowFacade.saveForLaterValidationClicked$.subscribe((val) => {
        if (val) {
          if(this.checkValidations()){
            this.workFlowFacade.showSaveForLaterConfirmationPopup(true);
          }
        }
      });
    }
  
    checkValidations(){
      return true;
    }
}
