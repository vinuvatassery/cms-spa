/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, Subscription } from 'rxjs';


@Component({
  selector: 'case-management-profile-health-insurance-page',
  templateUrl: './profile-health-insurance-page.component.html',
  styleUrls: ['./profile-health-insurance-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHealthInsurancePageComponent implements OnInit,OnDestroy {

  constructor(
    private route: ActivatedRoute,  
    private readonly router: Router
  ) { }

  tabChangeSubscription$ = new Subscription();
  tabIdSubject = new Subject<string>();
  tabId$ = this.tabIdSubject.asObservable();
  profileClientId!: number;
  clientCaseEligibilityId!: any;
  clientCaseId!: any;
  tabId! : any
  ngOnInit(): void {  
    this.routeChangeSubscription();
    this.loadQueryParams()
  }

  /** Private properties **/
  loadQueryParams()
  {    
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['elg_id'];
    this.tabId = this.route.snapshot.queryParams['tabId'];  
    this.tabIdSubject.next(this.tabId)   
  }

  private routeChangeSubscription() {
    this.tabChangeSubscription$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {    
          this.loadQueryParams()  
      });
  }

  ngOnDestroy(): void {
    this.tabChangeSubscription$.unsubscribe();
  }

}



