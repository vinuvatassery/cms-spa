/** Angular **/
import {
  Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
/** Internal Libraries **/
import { CaseFacade, WorkflowFacade, LoginUserFacade, UserDefaultRoles } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

/**external libraries */
import { first } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'case-management-case-summary',
  templateUrl: './case-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CaseSummaryComponent implements OnInit {
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
  ddlCaseOrigins$ = this.caseFacade.ddlCaseOrigins$;
  case$ = this.caseFacade.getCase$;
  clientCaseId! : string;
  sessionId! : string;

  /** Constructor**/
  constructor(
    private readonly router: Router,
    private readonly caseFacade: CaseFacade,
    private readonly ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly workFlowFacade : WorkflowFacade,
    private readonly loginUserFacade : LoginUserFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {   
    this.loadCase();
    /** methods for case child form **/
    this.caseFacade.loadCaseBySearchText();
    this.loginUserFacade.getUsersByRole(UserDefaultRoles.CACaseWorker);
    this.caseFacade.loadDdlPrograms();
    this.caseFacade.loadDdlCaseOrigins();   
    this.registerFormData()
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
  private registerFormData() {

    this.parentForm = this.formBuilder.group({
      applicationDate: ['', Validators.required],
      caseOriginCode: ['', Validators.required],
      caseOwnerId: ['', Validators.required],
      programId: ['', [Validators.required]],
    });
   
  }
}
