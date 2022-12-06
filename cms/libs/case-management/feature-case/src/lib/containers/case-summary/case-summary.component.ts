/** Angular **/
import {
  Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
/** Internal Libraries **/
import { CaseFacade, WorkflowFacade,
   UserDefaultRoles, NavigationType  } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {LovType , LovFacade , UserManagementFacade} from '@cms/system-config/domain'

/**external libraries */
import { first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  private saveClickSubscription !: Subscription;

  /** Constructor**/
  constructor(
    private readonly router: Router,
    private readonly caseFacade: CaseFacade,
    private readonly ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly workFlowFacade : WorkflowFacade,
    private readonly loginUserFacade : UserManagementFacade,
    private readonly lovFacade : LovFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {   
    this.loadFormdata();
    this.addSaveSubscription();
    /** methods for case child form **/
    this.registerFormData()
   
  } 
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
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
    this.workFlowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
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
        if (isSaved) {
          this.workFlowFacade.navigate(navigationType);
        }
      });
    }
    private updateCase()
    {      
      this.parentForm.updateValueAndValidity()
      if(this.parentForm.valid)
      {
      return this.caseFacade.UpdateCase(this.parentForm ,this.clientCaseId)
      }
      else return of(false)
    }
}
