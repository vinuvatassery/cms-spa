/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Internal Libraries **/
import { CaseFacade, CaseScreenTab } from '@cms/case-management/domain';

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

  /** Constructor**/
  constructor(private readonly caseFacade: CaseFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadCases();
  }

  /** Private methods **/
  private loadCases(): void {
    this.caseFacade.loadCases();
    this.caseFacade.loadCasesForAuthuser();
    this.caseFacade.loadRecentCases();
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
}
