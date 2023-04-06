/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External service **/
import { BehaviorSubject, mergeMap, of, tap } from 'rxjs';
import { DragEndEvent } from "@progress/kendo-angular-sortable";
/** Internal service **/
import { ActiveSessions, CaseFacade, CaseStatusCode, WorkflowTypeCode } from '@cms/case-management/domain';
import { NotificationSnackbarService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-last-visited-cases',
  templateUrl: './last-visited-cases.component.html',
  styleUrls: ['./last-visited-cases.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastVisitedCasesComponent implements OnInit {
  /** Public properties **/
  lastVisitedCases$ = this.caseFacade.lastVisitedCases$;
  isRefreshLoaderVisible$ = this.caseFacade.activeSessionLoaderVisible$;
  orderUpdateLoader$ = new BehaviorSubject<boolean>(false);
  skeletonCounts = [
    1, 2, 3, 4, 5
  ]
  /** Constructor**/
  constructor(private readonly caseFacade: CaseFacade,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notificationSnackbarService: NotificationSnackbarService) {
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
    const clientId = this.route.snapshot.queryParams['id'] ?? 0;
    if (session && session?.caseStatusCode === CaseStatusCode.accept && clientId != session?.clientId) {
      this.router.navigate([`/case-management/cases/case360/${session?.clientId}`]);
      return;
    }

    const sessionId = this.route.snapshot.queryParams['sid'];
    if (sessionId !== session?.sessionId && session?.caseStatusCode !== CaseStatusCode.accept) {
      this.router.navigate(['case-management/case-detail'], {
        queryParams: {
          sid: session?.sessionId,
          eid: session?.entityId
        }
      });
    }
  }

  public onDragEnd(e: DragEndEvent): void {
    this.lastVisitedCases$
      .pipe(
        tap(() => this.orderUpdateLoader$.next(true)),
        mergeMap((activeSessions: ActiveSessions[]) => {
          if (e.index !== e.oldIndex) { return this.updateActiveSessionOrder(activeSessions); }
          return of(false);
        }))
      .subscribe(() => { this.orderUpdateLoader$.next(false); });
  }

  private updateActiveSessionOrder(activeSessions: ActiveSessions[]) {
    if (!activeSessions || activeSessions?.length <= 1) return of(false);
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

  deleteActiveSession(activeSession: any) {
    let isProfileOpened = false;
    if(activeSession?.caseStatusCode === CaseStatusCode.accept){
      const clientId = parseInt(this.route.snapshot.queryParams['id'] ?? 0);
      isProfileOpened = clientId === activeSession.clientId;
    }else{
      const sessionId = this.route.snapshot.queryParams['sid'];
      isProfileOpened = sessionId === activeSession?.sessionId;
    }

    return this.caseFacade.deleteActiveSession(activeSession.activeSessionId, isProfileOpened);
  }
}
