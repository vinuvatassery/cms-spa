/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


/** Internal Libraries **/
import { CaseFacade, CaseScreenTab, WorkflowFacade,  UserDefaultRoles, SearchHeaderType,ModuleCode  } from '@cms/case-management/domain';
import {UITabStripScroll} from '@cms/shared/ui-tpa'
import { LovFacade , UserManagementFacade} from '@cms/system-config/domain'


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
  public uiTabStripScroll : UITabStripScroll = new UITabStripScroll();
  savedcaseForm! : FormGroup ;
  formButtonDisabled! : boolean
  columnDroplist$ = this.lovFacade.ColumnDroplistlov$;
  searchLoaderVisibility$ = this.caseFacade.searchLoaderVisibility$;
  totalClientsCount!:number | null;
  moduleCode:any = ModuleCode;

  /** Public properties for case popup**/
  caseSearchResults$ = this.caseFacade.caseSearched$;
  caseOwners$ = this.loginUserFacade.usersByRole$;
  ddlPrograms$ = this.caseFacade.ddlPrograms$;
  ddlCaseOrigins$ = this.lovFacade.caseoriginlov$;

  pageSizes = this.caseFacade.gridPageSizes;
  sortValue  = this.caseFacade.sortValue;
  sortType  = this.caseFacade.sortType;
  sort  = this.caseFacade.sort;

  /** Constructor**/

    constructor(private readonly router: Router,
      private readonly caseFacade: CaseFacade,
      private readonly workflowFacade :WorkflowFacade,
      private readonly loginUserFacade : UserManagementFacade,
      private readonly lovFacade : LovFacade,
      private readonly  cdr :ChangeDetectorRef
    ) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.caseFacade.enableSearchHeader(SearchHeaderType.CaseSearch);
    this.loadColumnDroplist();
    this.loadCases();
  }

  /** Private methods **/
  private loadCases(): void {
    this.caseFacade.loadCasesForAuthuser();
    this.caseFacade.loadRecentCases();
      /** methods for case popup **/

      this.loginUserFacade.getUsersByRole(UserDefaultRoles.CACaseWorker);
      this.caseFacade.loadDdlPrograms();
      this.lovFacade.getCaseOriginLovs();
  }

  /** Getters **/
  get caseScreenTab(): typeof CaseScreenTab {
    return CaseScreenTab;
  }

  /** Internal event methods **/
  onTabSelected(e: any) {
    this.selectedTab = e.index;
    switch(this.selectedTab) {
      case CaseScreenTab.CER_TRACKING: {
        this.isRightReminderBarEnabled = false;
         break;
      }
      case CaseScreenTab.MY_CASES:
      case CaseScreenTab.ALL: {
        //associated with the logged in caseworker,
        this.isRightReminderBarEnabled = true;
        this.totalClientsCount = null;
         break;
      }
      case CaseScreenTab.RECENT: {
        //recently worked on by the logged in caseworker
        this.isRightReminderBarEnabled = true;
        this.totalClientsCount = this.caseFacade.totalClientsCount;
        break;
     }
      default:
      {
         break;
      }
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

  handleSearchTextChange(text : string)
  {
    this.caseFacade.loadCaseBySearchText(text);
  }

  loadCasesListEventHandler(gridDataRefinerValue : any)
  {
    const gridDataRefiner =
    {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount : gridDataRefinerValue.pagesize,
      sort : gridDataRefinerValue.sortColumn,
      sortType : gridDataRefinerValue.sortType,
      columnName : gridDataRefinerValue.columnName,
      filter : gridDataRefinerValue.filter,
      totalClientsCount : this.totalClientsCount,
    }
    this.pageSizes = this.caseFacade.gridPageSizes;
    this.loadCaseList(gridDataRefiner.skipcount ,gridDataRefiner.maxResultCount  ,gridDataRefiner.sort , gridDataRefiner.sortType, gridDataRefiner.columnName, gridDataRefiner.filter, gridDataRefiner.totalClientsCount);
  }

  loadColumnDroplist()
  {
    this.lovFacade.getColumnDroplistLovs();
  }

      /** grid event methods **/

    loadCaseList(skipcountValue : number,maxResultCountValue : number ,sortValue : string , sortTypeValue : string, columnName : any, filter : any, totalClientsCount : any)
     {
       this.pageSizes = this.caseFacade.gridPageSizes;
        this.caseFacade.loadCases(this.selectedTab, skipcountValue ,maxResultCountValue  ,sortValue , sortTypeValue, columnName, filter, totalClientsCount);
        this.cdr.detectChanges();
      }

}
