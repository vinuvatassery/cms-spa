/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit, Input, EventEmitter } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { filter } from 'rxjs/internal/operators/filter';
/** Facades **/
import { CaseDetailsFacade, ScreenType } from '@cms/case-management/domain';
import { Observable } from 'rxjs/internal/Observable';

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
  @Input() saveAndContinueClicked = new EventEmitter();

  /** Public Properties **/
  isSendLetterProfileOpenedSubject = new BehaviorSubject<boolean>(false);
  isSendLetterProfileOpened$ =
    this.isSendLetterProfileOpenedSubject.asObservable();
  isApplicationReviewOpened = false;
  isCheckRouteExcecuted = false; // for checking  the if conditions in the loop has been excecuted or not
  navigationIndex = 1;

  /** Private Properties */

  
  /** constructor **/
  constructor(private router: Router,
    private caseDetailFacade: CaseDetailsFacade
  ) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.loadCaseNavigationDeatils();
    this.navigationInitiated();
  }

  /** Private Methods **/
  private loadCaseNavigationDeatils() {
    this.routes$.subscribe({
      next: (routes: any) => {
        console.log(routes);
        this.navigateByUrl(routes);
        //this.saveAndContinueSubscribed(routes);
        this.navigationSubscribed(routes);
      },
      error: (err: any) => {
        console.error('error', err);
      },
    });
  }

  private saveAndContinueSubscribed(routes: any) {
    this.saveAndContinueClicked.subscribe({
      next: () => {
        // TODO: Save Application Functionality.
        this.caseDetailFacade.save();
        this.nextNavigation(routes);
      },
      error: (err: any) => {
        console.error('error', err);
      },
    });

  }

  private navigationSubscribed(routes:any){
    this.caseDetailFacade.navigateToNextCaseScreen.subscribe({
      next: () => {       
        this.nextNavigation(routes);
      },
      error: (err: any) => {
        console.error('error', err);
      },
    });
  }

  private nextNavigation(routes: any) {
    const CurrentRoute = this.router.url;
    this.navigationIndex =
      routes.findIndex((route: any) => CurrentRoute.includes(route.url)) +
      1;
    this.navigateByUrl(routes);
  }

  private navigateByUrl(routes: any) {
    if (this.navigationIndex < routes.length) {
      this.router.navigate([routes[this.navigationIndex].url], { queryParamsHandling: 'preserve' });
    }
    // TODO: In else case we can start the application review process.
  }

  /** Private methods **/
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
}
