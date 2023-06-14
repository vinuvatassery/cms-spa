/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationApplicationSignature, AuthorizationFacade, NavigationType, WorkFlowProgress, WorkflowFacade } from '@cms/case-management/domain';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { Subscription, first } from 'rxjs';

@Component({
  selector: 'case-management-authorization-page',
  templateUrl: './authorization-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPageComponent implements OnInit, OnDestroy {
  btnDisabled = false;
  isCerForm = false;
  sessionId!: string
  prevClientCaseEligibilityId!: string
  reviewUrl!: string;
  reviewRoute!: WorkFlowProgress
  processId!: string
  entityId!: string
  workflowType!: string

  clientId!: any;
  clientCaseEligibilityId!: any;
  private loadSessionSubscription!: Subscription;

  /** Constructor **/
  constructor(
    private readonly workflowFacade: WorkflowFacade,
    private readonly loaderService: LoaderService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authorizationFacade: AuthorizationFacade,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService
  ) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadCurrentSession();
    this.loadEligibilityReviewUrlData();
  }

  ngOnDestroy(): void {
    this.loadSessionSubscription.unsubscribe();
  }


  loadAuthorization() {
    this.authorizationFacade.loadAuthorization(this.clientCaseEligibilityId);
  }

  saveAuthorization(data: any) {
    this.authorizationFacade.updateAuthorization(data).subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Authorization Saved Successfully!")
        if (response ?? false) {
          this.startReview();
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.workflowFacade.enableSaveButton();
        this.workflowFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  private loadCurrentSession() {
    const sessionId = this.route.snapshot.queryParams['sid'];
    this.loaderService.show();
    this.workflowFacade.loadWorkFlowSessionData(sessionId);
    this.clientId = this.workflowFacade.clientId ?? 0;
    this.clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$
      .subscribe({
        next: (resp: any) => {
          if (resp) {
            this.clientCaseEligibilityId = JSON.parse(resp.sessionData).clientCaseEligibilityId;
            this.clientId = JSON.parse(resp.sessionData).clientId;
            this.prevClientCaseEligibilityId = JSON.parse(resp.sessionData)?.prevClientCaseEligibilityId;
            if (this.prevClientCaseEligibilityId) {
              this.isCerForm = true
              //this.ref.detectChanges();
            }
            this.loadAuthorization();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.workflowFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.loggingService.logException(err);
        },
      });
  }


  loadEligibilityReviewUrlData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowType = this.route.snapshot.queryParams['wtc'];
    this.entityId = this.route.snapshot.queryParams['eid'];
    this.workflowFacade.loadWorkFlowMaster(this.sessionId)
    this.workflowFacade.routesData$.pipe(first((routesData: WorkFlowProgress[]) => routesData.length > 0))
      .subscribe((workFlowProgress: WorkFlowProgress[]) => {
        const routesData = workFlowProgress;
        const maxSequenceNumber = routesData.reduce((prev, curr) => prev > curr.sequenceNbr ? prev : curr.sequenceNbr, 0)
        this.reviewRoute = routesData.filter((route: WorkFlowProgress) => route.sequenceNbr === maxSequenceNumber)[0];
        this.reviewUrl = routesData.filter((route: WorkFlowProgress) => route.sequenceNbr === maxSequenceNumber)[0]?.url
      })
  }

  navigateReviewPage() {
    this.router.navigate(
      [this.reviewUrl],
      {
        queryParams: {
          sid: this.sessionId,
          pid: this.processId,
          eid: this.entityId,
          wtc: this.workflowType
        }
      }
    );
  }

  startReview() {
    this.workflowFacade.saveNonSequenceNavigation(this.reviewRoute?.workflowProgressId, this.sessionId ?? '')
      .subscribe(() => {
        this.loaderService.hide();
        this.workflowFacade.updateNonequenceNavigation(this.reviewRoute);
      });
  }

  onStartButtonClick(){
    this.workflowFacade.save(NavigationType.Next);
  }
}
