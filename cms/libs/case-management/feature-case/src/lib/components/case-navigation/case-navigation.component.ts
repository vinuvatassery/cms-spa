/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { filter } from 'rxjs/internal/operators/filter';
import { Observable } from 'rxjs/internal/Observable';
/** Internal Libraries **/
import { ScreenType, WorkFlowProgress } from '@cms/case-management/domain';

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
  @Input() navigationEvent = new EventEmitter<string>();
    /** Output Properties **/
  @Output() workflowChange = new EventEmitter<WorkFlowProgress>();

  /** Public Properties **/
  isSendLetterProfileOpenedSubject = new BehaviorSubject<boolean>(false);
  isSendLetterProfileOpened$ =
    this.isSendLetterProfileOpenedSubject.asObservable();
  isApplicationReviewOpened = false;
  isCheckRouteExcecuted = false; // for checking  the if conditions in the loop has been excecuted or not
  navigationIndex = 0;
  routes!: any[];

  /** constructor **/
  constructor(private router: Router, private actRoute: ActivatedRoute) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.loadCaseNavigationDeatils();
    this.navigationInitiated();
    this.addNavigationSubscription();
  }

  /** Private Methods **/
  private loadCaseNavigationDeatils() {
    this.routes$.subscribe({
      next: (routes: any) => {
        if (routes.length > 0) {
          this.navigate(routes)
          this.routes = routes;
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
    const CurrentRoute = this.router.url;
    this.navigationIndex = routes.findIndex((route: WorkFlowProgress) =>
      route?.currentFlag === 'Y'
    );

    let paramScreenFlowType: string = this.actRoute.snapshot.queryParams['type'];
    let paramEntityId: string = this.actRoute.snapshot.queryParams['eid'];
    let paramSessionId = this.actRoute.snapshot.queryParams['sid'];

    if (this.navigationIndex > -1
      && this.navigationIndex < routes.length
      && paramScreenFlowType
      && paramEntityId
      && paramSessionId) {
      this.router.navigate(
        [routes[this.navigationIndex].url],
        {
          queryParams: {
            type: paramScreenFlowType,
            sid: paramSessionId,
            eid: paramEntityId,
            pid: routes[this.navigationIndex].processId
          }
        }
      );
    }
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
    this.isApplicationReviewOpened = true;
  }

  onApplicationReviewClosed() {
    this.isApplicationReviewOpened = false;
  }

  onRouteChange(route: WorkFlowProgress) {
    this.workflowChange.emit(route);
  }
}
