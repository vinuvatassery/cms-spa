/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
/** Facades **/
import { CerTrackingFacade, ClientProfileTabs, StatusPeriodFacade } from '@cms/case-management/domain';
import { filter, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-profile-cer-tracking-page',
  templateUrl: './profile-cer-tracking-page.component.html',
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
  clientCaseId!: any;
  showHistoricalFlag!: any;
  gridDataRefinerValue!: any;
  /** Constructor**/
  constructor(private readonly cerTrackingFacade: CerTrackingFacade,
    private route: ActivatedRoute, private readonly router: Router,
    private readonly statusPeriodFacade: StatusPeriodFacade) {}

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
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];
    this.tabId = this.route.snapshot.queryParams['tid'];
    this.clientCaseId = this.route.snapshot.queryParams['cid'];
    if(ClientProfileTabs.STATUS_PERIOD){
      this.gridDataRefinerValue = {
        skipCount: this.statusPeriodFacade.skipCount,
        pagesize: this.statusPeriodFacade.gridPageSizes[0]?.value,
      };
      this.loadStatusPeriod();
    }
    this.tabIdSubject.next(this.tabId);
  }

  get clientProfileTabs(): typeof ClientProfileTabs {
    return ClientProfileTabs;
  }

  private routeChangeSubscription() {
    this.tabChangeSubscription$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadQueryParams();
      });
  }

  handleShowHistoricalClick(){
    this.gridDataRefinerValue = {
      skipCount: this.statusPeriodFacade.skipCount,
      pagesize: this.statusPeriodFacade.gridPageSizes[0]?.value,
    };
    this.loadStatusPeriod();
  }

  ngOnDestroy(): void {
    this.tabChangeSubscription$.unsubscribe();
  }

  loadStatusPeriod(){
    this.statusPeriodFacade.loadStatusPeriod(this.clientCaseId,this.profileClientId,this.showHistoricalFlag,this.gridDataRefinerValue);
  }

  loadStatusPeriodData(gridDataRefinerValue:any){
    this.gridDataRefinerValue=gridDataRefinerValue;
    this.loadStatusPeriod();
  }
}
