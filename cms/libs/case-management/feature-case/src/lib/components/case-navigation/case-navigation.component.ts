/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { filter } from 'rxjs/internal/operators/filter';
import { Observable } from 'rxjs/internal/Observable';

/** Internal Libraries **/
import { ScreenType, WorkFlowProgress } from '@cms/case-management/domain';
import { LoaderService, LoggingService } from '@cms/shared/util-core';
import { StatusFlag } from '@cms/shared/ui-common';

@Component({
  selector: 'case-management-case-navigation',
  templateUrl: './case-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseNavigationComponent implements OnInit {
  /** Input Properties **/
  @Input() routes$!: Observable<any>;
  @Input() completeStaus$!: Observable<any>;
  @Input() currentSession: any
  @Input() navigationEvent = new EventEmitter<string>();
  @Input() workflowType!: string
  /** Output Properties **/
  @Output() workflowChange = new EventEmitter<object>();

  /** Public Properties **/
  isSendLetterProfileOpenedSubject = new BehaviorSubject<boolean>(false);
  isSendLetterProfileOpened$ = this.isSendLetterProfileOpenedSubject.asObservable();
  isApplicationReviewOpened = false;
  navigationIndex = 1;
  routes!: any[];
  review!: WorkFlowProgress;
  isNotReadyForReview = true;

  /** constructor **/
  constructor(
    private readonly router: Router,
    private readonly actRoute: ActivatedRoute,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.loadCaseNavigationDetails();
    this.navigationInitiated();
    this.addNavigationSubscription();
  }

  private loadCaseNavigationDetails() {
    this.routes$.subscribe({
      next: (routes: any) => {
        if (routes.length > 0) {
          this.routes = routes;
          const maxSequenceNumber = this.routes.reduce((prev, curr) => prev > curr.sequenceNbr ? prev : curr.sequenceNbr, 0);
          this.review = this.routes.filter((route: WorkFlowProgress) => route.sequenceNbr === maxSequenceNumber)[0];
          this.isNotReadyForReview = this.routes.findIndex((route: any) => route.visitedFlag == StatusFlag.No && route.sequenceNbr !== maxSequenceNumber) != -1;
          this.navigate(routes)
        }
      },
      error: (err: any) => {
        this.loggingService.logException(err);
      },
    });
  }

  private addNavigationSubscription() {
    this.navigationEvent.subscribe({
      next: () => {
        this.navigate(this.routes);
      },
      error: (err: any) => {
        this.loggingService.logException(err);
      },
    });
  }

  private navigate(routes: any) {
    this.loaderService.show();
    this.navigationIndex = routes.findIndex((route: WorkFlowProgress) =>
      route?.currentFlag === StatusFlag.Yes
    );

    if (routes[this.navigationIndex]?.sequenceNbr === this.review?.sequenceNbr) {
      this.isApplicationReviewOpened = true;
      const route = this.router.url;
      const routeArray = this.router.url?.substring(0, route?.indexOf('?') !== -1 ? route?.indexOf('?') : route?.length).split('/');
      const isSendLetter = routeArray?.findIndex((i: any) => i === ScreenType.SendLetter) !== -1;
      if (isSendLetter) {
        this.isSendLetterProfileOpenedSubject.next(true);
        this.loaderService.hide();
        return;
      }

      this.isSendLetterProfileOpenedSubject.next(false);
    }
    else {
      this.isApplicationReviewOpened = false;
      this.isSendLetterProfileOpenedSubject.next(false);
    }

    const sessionId = this.actRoute.snapshot.queryParams['sid'];
    const entityId: string = this.actRoute.snapshot.queryParams['eid'];
    if (this.navigationIndex > -1
      && this.navigationIndex < routes.length
      && sessionId
    ) {
      this.router.navigate(
        [routes[this.navigationIndex].url],
        {
          queryParams: {
            sid: sessionId,
            pid: routes[this.navigationIndex].processId,
            eid: entityId,
            wtc: this.workflowType
          }
        }
      );
    }
    this.loaderService.hide();
  }

  private navigationInitiated() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          if (this.isApplicationReviewOpened === true) {
            const routeArray = this.router.url?.substring(0, this.router.url?.indexOf('?') !== -1 ? this.router.url?.indexOf('?') : this.router.url?.length).split('/');
            const isNotNavigatedAwayFromReview = routeArray?.findIndex((i: any) => i === ScreenType.Eligibility || i === ScreenType.SendLetter) !== -1;
            if (!isNotNavigatedAwayFromReview) { this.isApplicationReviewOpened = false }
            const isSendLetter = routeArray?.findIndex((i: any) => i === ScreenType.SendLetter) !== -1;
            this.isSendLetterProfileOpenedSubject.next(isSendLetter);
          }
        },
        error: (err: any) => {
          this.loggingService.logException(err);
        },
      });
  }

  /** Internal event methods **/
  onApplicationReviewClicked() {
    this.onRouteChange(this.review, true);
  }

  onApplicationReviewClosed() {
    this.onRouteChange(this.review, false, true);
  }

  onRouteChange(route: WorkFlowProgress, isReview: boolean = false, isReset: boolean = false) {
    this.workflowChange.emit({ route: route, isReview: isReview, isReset: isReset });
  }
}
