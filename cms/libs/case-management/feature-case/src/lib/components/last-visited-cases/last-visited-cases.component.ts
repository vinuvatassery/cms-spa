/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { CaseFacade, ScreenFlowType } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-last-visited-cases',
  templateUrl: './last-visited-cases.component.html',
  styleUrls: ['./last-visited-cases.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastVisitedCasesComponent implements OnInit {
  /** Public properties **/
  lastVisitedCases$ = this.caseFacade.lastVisitedCases$;

  /** Constructor**/
  constructor(private readonly caseFacade: CaseFacade) {
    this.loadLastVisitedCases();
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadLastVisitedCases();
  }

  /** Private methods **/
  private loadLastVisitedCases() {
    this.caseFacade.loadLastVisitedCases();
  }

  getQueryParams(_case: any): object {
    return {
      screenFlowType: ScreenFlowType.ExistingCase,
      caseId: _case.id,
      programId: _case.programId,
    };
  }
}
