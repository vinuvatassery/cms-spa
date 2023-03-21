/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
/** External service **/
import { mergeMap, of } from 'rxjs';
import { DragEndEvent } from "@progress/kendo-angular-sortable";
/** Internal service **/
import { CaseFacade, CaseStatusCode, WorkflowTypeCode } from '@cms/case-management/domain';
import { ActiveSessions } from 'libs/case-management/domain/src/lib/entities/active-sessions';
import { NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

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
  constructor(private readonly caseFacade: CaseFacade,
    private readonly router: Router,
    private readonly notificationSnackbarService: NotificationSnackbarService) {
    this.loadLastVisitedCases();
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadLastVisitedCases();
  }

  /** Private methods **/
  private loadLastVisitedCases() {
    this.caseFacade.loadActiveSession();
  }

  getQueryParams(caseDetail: any): object {
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

  public onDragEnd(e: DragEndEvent): void {
    if (e.index !== e.oldIndex) {
      this.lastVisitedCases$
        .pipe(mergeMap((activeSessions: ActiveSessions[]) => this.updateActiveSessionOrder(activeSessions)))
        .subscribe(() => {
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Active Session Order Changed Successfully')
        });
    }
  }

  private updateActiveSessionOrder(activeSessions: ActiveSessions[]) {
    if (!activeSessions) return of(false);
    let sessionUpdate: any[] = [];
    activeSessions.forEach((session, i) => {
      const seq = {
        activeSessionId: session.activeSessionId,
        sequenceNbr: i,
      };
      sessionUpdate.push(seq);
    });

    return this.caseFacade.updateActiveSessionOrder(sessionUpdate);
  }

  deleteActiveSession(activeSessionId: string) {
    return this.caseFacade.deleteActiveSession(activeSessionId);
  }
}
