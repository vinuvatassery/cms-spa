/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
/** External libraries **/
import { filter, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-profile-management-page',
  templateUrl: './profile-management-page.component.html',
  styleUrls: ['./profile-management-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileManagementPageComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private readonly router: Router) {}

  tabChangeSubscription$ = new Subscription();
  tabIdSubject = new Subject<string>();
  tabId$ = this.tabIdSubject.asObservable();
  profileClientId!: number;
  clientCaseEligibilityId!: any;
  tabId!: any;
  ngOnInit(): void {
    this.loadQueryParams();
    this.routeChangeSubscription()
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
