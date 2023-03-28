/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Internal libraries **/
import {ScreenType, CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { filter, first, Subject, Subscription } from 'rxjs';
import { TabStripComponent } from '@progress/kendo-angular-layout';

@Component({
  selector: 'case-management-case360-page',
  templateUrl: './case360-page.component.html',
  styleUrls: ['./case360-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Case360PageComponent implements OnInit, OnDestroy {
  @ViewChild('tabStripParent') public tabStripParent!: TabStripComponent;
  @ViewChild('tabStripChild') public tabStripChild!: TabStripComponent;

  /** Private properties **/
  private selectedCase = new BehaviorSubject<any>({});

  private clientHeaderSubject = new Subject<any>();
  private clientInfoVisibleSubject = new Subject<any>();
  private clientHeaderVisibleSubject = new Subject<any>();


  loadedClientHeader$ = this.clientHeaderSubject.asObservable();
  clientInfoVisible$ = this.clientInfoVisibleSubject.asObservable();
  clientHeaderVisible$ = this.clientHeaderVisibleSubject.asObservable();
  /** Public properties **/
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  clientProfileHeader$ = this.caseFacade.clientProfileHeader$;
  clientProfileImpInfo$ = this.caseFacade.clientProfileImpInfo$;
  selectedCase$ = this.selectedCase.asObservable();
  screenName = ScreenType.Case360Page;
  isVerificationReviewPopupOpened = false;
  profileClientId = 0
  clientCaseEligibilityId! : string;
  caseWorkerId! : string;
  clientHeaderTabs: any = [];
  clientCaseId! : string 
  actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  clientId:any;
  clientChangeSubscription$ = new Subscription();
  
  /** Constructor**/
  constructor(
    private readonly caseFacade: CaseFacade,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.initialize();  
    this.routeChangeSubscription();
  }

  ngOnDestroy(): void {
    this.clientChangeSubscription$.unsubscribe();
  }

  /** Private methods **/

  private initialize(){
    this.clientHeaderVisibleSubject.next(true);
    this.caseSelection();   
    this.getQueryParams();
  }
  private getQueryParams() {    
    this.profileClientId = this.route.snapshot.params['id'];
    if (this.profileClientId > 0) {
      this.clientHeaderVisibleSubject.next(true);
    }
  }

  private caseSelection() {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.selectedCase.next(params.get('case_id'));
      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  private routeChangeSubscription() {
    this.clientChangeSubscription$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
    ).subscribe(() => {
      const clientId = this.route.snapshot.paramMap.get('id') ?? 0 ;
      if (this.profileClientId !== 0 && this.profileClientId !== clientId) {
        this.initialize();
        this.resetTabs();
        this.loadClientProfileInfoEventHandler();      
      }
    });
  }

  private resetTabs(){
    Promise.resolve(null).then(() => this.tabStripParent.selectTab(0));
    Promise.resolve(null).then(() => this.tabStripChild.selectTab(0));
  }

  /** Internal event methods **/


 

  onVerificationReviewClosed() {
    this.isVerificationReviewPopupOpened = false;
  }

  onVerificationReviewClicked() {
    this.isVerificationReviewPopupOpened = true;
  }



  /** External event methods **/
 

  loadClientImpInfo()
  {
    this.caseFacade.loadClientImportantInfo(this.clientCaseId);
  }

 

  loadClientProfileInfoEventHandler() {    
    this.caseFacade.loadClientProfileHeader(this.profileClientId);
    this.onClientProfileHeaderLoad()
  }


  onClientProfileHeaderLoad() {
    this.clientProfileHeader$?.pipe(first((clientHeaderData: any) => clientHeaderData?.clientId > 0))
      .subscribe((clientHeaderData: any) => {
        if (clientHeaderData?.clientId > 0) {
        this.clientId =clientHeaderData?.clientId;
        this.clientCaseEligibilityId=  clientHeaderData?.clientCaseEligibilityId;
          const clientHeader = {

            clientCaseEligibilityId: clientHeaderData?.clientCaseEligibilityId,
            clientId: clientHeaderData?.clientId,
            clientCaseId: clientHeaderData?.clientCaseId,
            urn: clientHeaderData?.urn,
            caseStatus: clientHeaderData?.caseStatus,
            group: clientHeaderData?.group,
            eilgibilityStartDate: clientHeaderData?.eilgibilityStartDate,
            eligibilityEndDate: clientHeaderData?.eligibilityEndDate,
            fpl: clientHeaderData?.fpl,
            clientFullName: clientHeaderData?.clientFullName,
            pronouns: clientHeaderData?.pronouns,
            clientCaseIdentity: clientHeaderData?.clientCaseIdentity,
            clientOfficialIdFullName: clientHeaderData?.clientOfficialIdFullName,
            caseWorkerId: clientHeaderData?.caseWorkerId,
          }
          this.clientCaseId = clientHeader?.clientCaseId
          this.clientHeaderSubject.next(clientHeader);
          if (clientHeader?.clientCaseEligibilityId) {
            this.clientCaseEligibilityId = clientHeader?.clientCaseEligibilityId;
          }
          if (clientHeader?.caseWorkerId) {
            this.caseWorkerId = clientHeader?.caseWorkerId;
          }
          if (clientHeader?.clientCaseId) {
            this.clientCaseId = clientHeader?.clientCaseId;
          }
        }
      });
  }

  onTabSelect(data : any)
  {   
    debugger 
    let query ={
      queryParams: {
        elg_id: this.clientCaseEligibilityId,      
        tabId: 'contact-info'       
      }
    }
    if(data?.index ===0)
    {
    this.router.navigate(['/case-management/cases/case360/1085/contact-info/profile'],
    query)
    }
    else if(data?.index ===1)
    {
    this.router.navigate(['/case-management/cases/case360/1085/health-insurance/profile'],
    query)
    }
  }
}
