/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
/** Facades **/
import { CerTrackingFacade } from '@cms/case-management/domain';
import { filter, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-profile-cer-tracking-page',
  templateUrl: './profile-cer-tracking-page.component.html',
  styleUrls: ['./profile-cer-tracking-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCerTrackingPageComponent implements OnInit , OnDestroy {
  /** Public properties **/
  cer$ = this.cerTrackingFacade.cer$;
  tabChangeSubscription$ = new Subscription();
  tabIdSubject = new Subject<string>();
  tabId$ = this.tabIdSubject.asObservable();
  profileClientId!: number;
  clientCaseEligibilityId!: any;
  tabId!: any;

  /** Constructor**/
  constructor(private readonly cerTrackingFacade: CerTrackingFacade,
    private route: ActivatedRoute, private readonly router: Router) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadCer();
    this.loadQueryParams();
    this.routeChangeSubscription()
  }

  /** Private methods **/
  private loadCer(): void {
    this.cerTrackingFacade.loadCer();
  }
   /** Private properties **/
   loadQueryParams() {
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['elg_id'];
    this.tabId = this.route.snapshot.queryParams['tabId'];
    this.tabIdSubject.next(this.tabId);
  }

  private routeChangeSubscription() {
    this.tabChangeSubscription$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadQueryParams();
      });
  }

  ngOnDestroy(): void {
    this.tabChangeSubscription$.unsubscribe();
  }
}
