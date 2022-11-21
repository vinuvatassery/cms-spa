/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

/** Internal Libraries **/
import { CaseFacade, CaseScreenTab, WorkflowFacade,LoginUserFacade,UserDefaultRoles} from '@cms/case-management/domain';

@Component({
  selector: 'case-management-case-page',
  templateUrl: './case-page.component.html',
  styleUrls: ['./case-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CasePageComponent implements OnInit {
  /** Public Properties **/
  selectedTab: CaseScreenTab = 0;
  isRightReminderBarEnabled = true;
  isNewCaseDialogClicked = false;
  allCases$ = this.caseFacade.cases$;
  myCases$ = this.caseFacade.myCases$;
  recentCases$ = this.caseFacade.lastVisitedCases$;
  savedcaseForm! : FormGroup ;
  formButtonDisabled! : boolean

  /** Public properties for case popup**/
  caseSearchResults$ = this.caseFacade.caseSearched$;
  caseOwners$ = this.loginUserFacade.usersByRole$;
  ddlPrograms$ = this.caseFacade.ddlPrograms$;
  ddlCaseOrigins$ = this.caseFacade.ddlCaseOrigins$;
  
  /** Constructor**/
    
    constructor(private readonly router: Router,
      private readonly caseFacade: CaseFacade,
      private readonly workflowFacade :WorkflowFacade,
      private readonly loginUserFacade : LoginUserFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {    
    this.loadCases();
  }

  /** Private methods **/
  private loadCases(): void {
    this.caseFacade.loadCases();
    this.caseFacade.loadCasesForAuthuser();
    this.caseFacade.loadRecentCases();

      /** methods for case popup **/
      this.caseFacade.loadCaseBySearchText();
      this.loginUserFacade.getUsersByRole(UserDefaultRoles.CACaseWorker);     
      this.caseFacade.loadDdlPrograms();
      this.caseFacade.loadDdlCaseOrigins();
  }

  /** Getters **/
  get caseScreenTab(): typeof CaseScreenTab {
    return CaseScreenTab; 
  }

  /** Internal event methods **/
  onTabSelected(e: any) {
    this.selectedTab = e.index;
    if (this.selectedTab === CaseScreenTab.CER_TRACKING) {
      this.isRightReminderBarEnabled = false;
    } else {
      this.isRightReminderBarEnabled = true;
    }
  }

  onNewCaseDialogOpened() {
    this.isNewCaseDialogClicked = true;
  }

  /** External event methods **/
  handleNewCaseDialogClosed() {
    this.isNewCaseDialogClicked = false;
  }

  /**
   * 
   * @param caseForm 
   * a new workflow session
   * is created for the 
   * logged in user
   */
  newcaseSaved(caseForm : FormGroup){    
    if(caseForm.valid)
    {
      this.savedcaseForm  = caseForm
      this.formButtonDisabled = true;
      this.workflowFacade.createNewSession(caseForm);  
   }    
  }
}
