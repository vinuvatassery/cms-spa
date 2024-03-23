/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External service **/
import { BehaviorSubject, Subscription, of } from 'rxjs';
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
export class LastVisitedCasesComponent implements OnInit, OnDestroy {
  /** Public properties **/
  lastVisitedCases$ = this.caseFacade.lastVisitedCases$;
  isRefreshLoaderVisible$ = this.caseFacade.activeSessionLoaderVisible$;
  orderUpdateLoader$ = new BehaviorSubject<boolean>(false);
  skeletonCounts = [
    1, 2, 3, 4, 5
  ]
  activeSessionSubscription = new Subscription();
  activeSessionCur!: ActiveSessions[];
  activeSessionPrv!: ActiveSessions[];
  /** Constructor**/
  constructor(private readonly caseFacade: CaseFacade,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notificationSnackbarService: NotificationSnackbarService) {
  }


  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadLastVisitedCases();
    this.addActiveSessionSubscription();
  }

  ngOnDestroy(): void {
    this.activeSessionSubscription.unsubscribe();
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

  private addActiveSessionSubscription() {
    this.activeSessionSubscription = this.lastVisitedCases$
      .subscribe((sessions: ActiveSessions[]) => {
        this.activeSessionCur = sessions;
        this.activeSessionPrv = this.deepCopy(sessions);
      });
  }

  private deepCopy(data: any): any {
    return JSON.parse(JSON.stringify(data === undefined ? null : data));
  }

  onCaseClicked(session: ActiveSessions) {
    const clientId = this.route.snapshot.queryParams['id'] ?? 0;
    const newApplicationStatus: string[] = [CaseStatusCode.incomplete];
    if (session && !newApplicationStatus.includes(session?.caseStatusCode) && clientId != session?.clientId) {
      this.router.navigate([`/case-management/cases/case360/${session?.clientId}`]);
      return;
    }

    const sessionId = this.route.snapshot.queryParams['sid'];
    if (sessionId !== session?.sessionId && newApplicationStatus.includes(session?.caseStatusCode)) {
      this.router.navigate(['case-management/case-detail'], {
        queryParams: {
          sid: session?.sessionId,
          eid: session?.entityId,
          wtc: session?.workflowTypeCode ? session?.workflowTypeCode : WorkflowTypeCode.NewCase
        }
      });
    }
  }

  public onDragEnd(e: DragEndEvent): void {
    if (this.isOrderChanged()) {
      this.orderUpdateLoader$.next(true);
      this.updateActiveSessionOrder(this.activeSessionCur).subscribe((isUpdated: boolean) => {
        if (isUpdated) {
          this.activeSessionPrv = this.deepCopy(this.activeSessionCur);
        }
        this.orderUpdateLoader$.next(false);

      });
    }
  }

  private isOrderChanged() {
    for (let i = 0; i <= this.activeSessionCur.length; i++) {
      if (this.activeSessionCur[i]?.activeSessionId !== this.activeSessionPrv[i]?.activeSessionId) {
        return true;
      }
    }

    return false;
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

  deleteActiveSession(activeSession: any) {
    let isProfileOpened = false;
    if (activeSession?.caseStatusCode === CaseStatusCode.accept) {
      const clientId = parseInt(this.route.snapshot.queryParams['id'] ?? 0);
      isProfileOpened = clientId === activeSession.clientId;
    } else {
      const sessionId = this.route.snapshot.queryParams['sid'];
      isProfileOpened = sessionId === activeSession?.sessionId;
    }

    return this.caseFacade.deleteActiveSession(activeSession.activeSessionId, isProfileOpened);
  }
}
