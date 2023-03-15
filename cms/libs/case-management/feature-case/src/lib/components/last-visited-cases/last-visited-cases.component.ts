/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
/** Facades **/
import { CaseFacade, CaseStatusCode, WorkflowTypeCode } from '@cms/case-management/domain';
import { ActiveSessions } from 'libs/case-management/domain/src/lib/entities/active-sessions';

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
  constructor(private readonly caseFacade: CaseFacade, private readonly router: Router) {
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

  getQueryParams(caseDetail: any): object {
    //console.log(caseDetail);
    return {
      type: WorkflowTypeCode.NewCase,
      sid: caseDetail.SessionId,
      eid: caseDetail.EntityId,
    };
  }

  onCaseClicked(session: ActiveSessions) {
    if (session && session?.caseStatusCode === CaseStatusCode.accept) {
      this.router.navigate([`/case-management/cases/case360/${session?.clientId}`]);
      return;
    }
    
    this.router.navigate(['case-management/case-detail'], {
      queryParams: {
        sid: session?.sessionId,
        eid: session?.entityId
      },
    });
  }
}
