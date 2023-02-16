/** Angular **/
import {
  Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, AfterViewInit} from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
/** Internal Libraries **/
import { CaseFacade, WorkflowFacade,
   UserDefaultRoles, NavigationType, CompletionChecklist, StatusFlag  } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {LovFacade , UserManagementFacade} from '@cms/system-config/domain'

/**external libraries */
import { catchError, debounceTime, distinctUntilChanged, first, forkJoin, mergeMap, of, pairwise, startWith, Subscription, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-case-summary',
  templateUrl: './case-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CaseSummaryComponent implements OnInit , OnDestroy, AfterViewInit {
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
  private discardChangesSubscription !: Subscription;

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
    private readonly loaderService: LoaderService
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
    this.addDiscardChangesSubscription();
  } 
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.sessionDataSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
    this.discardChangesSubscription.unsubscribe();
  }

  ngAfterViewInit(){
    this.workFlowFacade.enableSaveButton();
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
        tap(() => this.workFlowFacade.disableSaveButton()),
        mergeMap((navigationType: NavigationType) =>
          forkJoin([of(navigationType), this.updateCase()])
        ),       
      ).subscribe(([navigationType, isSaved]) => {
        if (isSaved == true) {
          this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Case data Updated')  
          this.workFlowFacade.navigate(navigationType);
        } else {
          this.workFlowFacade.enableSaveButton();
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
          this.workFlowFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err) 
          
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
   
   this.workFlowFacade.updateChecklist(completedDataPoints);
  }
}

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workFlowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
      if (this.checkValidations()) {
        this.updateCase().subscribe((response: any) => {
          if (response) {
            this.loaderService.hide();
            this.workFlowFacade.handleSendNewsLetterpopup(statusResponse, this.clientCaseId)
          }
        })
      }
      else {
        this.workFlowFacade.handleSendNewsLetterpopup(statusResponse, this.clientCaseId)
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
    this.parentForm.updateValueAndValidity()
    return this.parentForm.valid;

  }

  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription = this.workFlowFacade.discardChangesClicked$.subscribe((response: any) => {
     if(response){
      this.caseFacade.loadCasesById(this.clientCaseId); 
     }
    });
  }
}
