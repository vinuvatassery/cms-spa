/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { filter } from 'rxjs/internal/operators/filter';
import { Observable } from 'rxjs/internal/Observable';

/** Internal Libraries **/
import { ScreenType, StatusFlag, WorkFlowProgress } from '@cms/case-management/domain';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-case-navigation',
  templateUrl: './case-navigation.component.html',
  styleUrls: ['./case-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseNavigationComponent implements OnInit {
  /** Input Properties **/
  @Input() routes$!: Observable<any>;
  @Input() completeStaus$!: Observable<any>;
  @Input() currentSession : any
  @Input() navigationEvent = new EventEmitter<string>();
  /** Output Properties **/
  @Output() workflowChange = new EventEmitter<object>();

  /** Public Properties **/
  isSendLetterProfileOpenedSubject = new BehaviorSubject<boolean>(false);
  isSendLetterProfileOpened$ =
    this.isSendLetterProfileOpenedSubject.asObservable();
  isApplicationReviewOpened = false;
  isCheckRouteExcecuted = false; // for checking  the if conditions in the loop has been excecuted or not
  navigationIndex = 1;
  routes!: any[];
  review!: WorkFlowProgress;
  isNotReadyForReview  = true; 

  /** constructor **/
  constructor(private router: Router, private actRoute: ActivatedRoute, private readonly loaderService:LoaderService) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.loadCaseNavigationDeatils();
    this.navigationInitiated();
    this.addNavigationSubscription();   
  } 

  private loadCaseNavigationDeatils() {
    this.routes$.subscribe({
      next: (routes: any) => {
        if (routes.length > 0) {
          this.routes = routes;
          const maxSequenceNumber = this.routes.reduce((prev, curr) => prev = prev > curr.sequenceNbr ? prev : curr.sequenceNbr, 0);
          this.review = this.routes.filter((route: WorkFlowProgress) => route.sequenceNbr === maxSequenceNumber)[0];
          this.isNotReadyForReview = this.routes.findIndex((route: any) => route.visitedFlag == StatusFlag.No && route.sequenceNbr !== maxSequenceNumber) != -1;
          this.navigate(routes)
        }
      },
      error: (err: any) => {
        console.error('error', err);
      },
    });
  }

  private addNavigationSubscription() {
    this.navigationEvent.subscribe({
      next: () => {
        this.navigate(this.routes);
      },
      error: (err: any) => {
        console.error('error', err);
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
            pid: routes[this.navigationIndex].processId   ,
            eid: entityId,       
          }
        }
      );
    }
    this.loaderService.hide();
  }

  private navigateByUrl(routes: any) {
    if (this.navigationIndex > -1 && this.navigationIndex < routes.length) {
      this.router.navigate([routes[this.navigationIndex].url], { queryParamsHandling: 'preserve' });
    }
    // TODO: In else case we can start the application review process.
  }

  private navigationInitiated() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: (event) => {
          let previousRoute = '';
          this.isCheckRouteExcecuted = false;
          const route = this.router.url;
          const routeArray = this.router.url
            .substring(
              0,
              route.indexOf('?') !== -1 ? route.indexOf('?') : route.length
            )
            .split('/');
          routeArray.forEach((route) => {
            const currentRoute = route;
            this.checkRoute(currentRoute, previousRoute);
            previousRoute = currentRoute;
          });
          if (!this.isCheckRouteExcecuted) {
            this.isSendLetterProfileOpenedSubject.next(false);
            this.isApplicationReviewOpened = false;
          }
        },
        error: (err: any) => {
          console.log('Error', err);
        },
      });
  }

  private checkRoute(currentRoute: string, previousRoute: string) {
    switch (previousRoute) {
      case ScreenType.ApplicationEligibility: {
        switch (currentRoute) {
          case ScreenType.SendLetter: {
            this.isSendLetterProfileOpenedSubject.next(true);
            this.isApplicationReviewOpened = true;
            this.isCheckRouteExcecuted = true;
            break;
          }
          case ScreenType.Eligibility: {
            this.isSendLetterProfileOpenedSubject.next(false);
            this.isApplicationReviewOpened = true;
            this.isCheckRouteExcecuted = true;
            break;
          }
        }
      }
    }
  }

  /** Internal event methods **/
  onApplicationReviewClicked() {
    this.onRouteChange(this.review, true);
    this.isApplicationReviewOpened = true;
  }

  onApplicationReviewClosed() {
    this.onRouteChange(this.review, false, true);
    this.isApplicationReviewOpened = false;
  }

  onRouteChange(route: WorkFlowProgress, isReview: boolean = false, isReset: boolean = false) {
    this.workflowChange.emit({ route: route, isReview: isReview, isReset: isReset });
  }
}
