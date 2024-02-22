/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Internal libraries **/
import {
  ScreenType,
  CaseFacade,
  ClientProfileTabs,
  WorkflowFacade,
  CaseStatusCode,
  ClientFacade
} from '@cms/case-management/domain';
import { filter, first, Subject, Subscription } from 'rxjs';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-case360-page',
  templateUrl: './case360-page.component.html',
  styleUrls: ['./case360-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Case360PageComponent implements OnInit, OnDestroy {
  public width = '100%';
  public height = '33px';
  arrowView = true;
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

  ddlGroups$ = this.caseFacade.ddlGroups$;
  currentGroup$ = this.caseFacade.currentGroup$;
  groupUpdated$ = this.caseFacade.groupUpdated$;
  clientProfileReload$ = this.clientFacade.clientProfileReload$;
  profileClientId = 0;
  clientCaseEligibilityId!: string;
  caseWorkerId!: string;
  clientHeaderTabs: any = [];
  clientCaseId!: string;
  actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  clientId: any;
  clientChangeSubscription$ = new Subscription();
  clientProfileReloadSubscription$ = new Subscription();
  userDetail$ = this.userManagementFacade.usersById$;

  client_button_grp = true;
  health_button_grp = false;
  dental_button_grp = false;
  drugs_button_grp = false;
  mng_button_grp = false;
  selectedTabName = 'clinfo';
  /** Constructor**/
  constructor(
    private readonly caseFacade: CaseFacade,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly workFlowFacade : WorkflowFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly clientFacade: ClientFacade,
    private readonly userManagementFacade: UserManagementFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.initialize();
    this.routeChangeSubscription();
    this.clientProfileReloadSubscription$ = this.clientProfileReload$.subscribe((data)=>{
      this.loadClientProfileInfoEventHandler();
    });
  }

  ngOnDestroy(): void {
    this.clientChangeSubscription$.unsubscribe();
    this.clientProfileReloadSubscription$.unsubscribe();
  }

  /** Private methods **/

  private initialize() {
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

  get clientProfileTabs(): typeof ClientProfileTabs {
    return ClientProfileTabs;
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

  createCerSession()
  {
    if(this.clientCaseEligibilityId)
    {
     const cerSessionData = {
        entityId: null,
        assignedCwUserId: null,
        caseOriginCode: null,
        caseStartDate: null,
        clientCaseEligibilityId: this.clientCaseEligibilityId,
      };
    this.workFlowFacade.createNewSession(null ,cerSessionData)
    }
  }

  private routeChangeSubscription() {
    this.clientChangeSubscription$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const clientId = this.route.snapshot.paramMap.get('id') ?? 0;
        if (this.profileClientId !== 0 && this.profileClientId !== clientId) {
          this.clientCaseEligibilityId = '';
          this.initialize();
          this.loadClientProfileInfoEventHandler();
        }
      });
  }

  /** Internal event methods **/

  onVerificationReviewClosed() {
    this.isVerificationReviewPopupOpened = false;
  }

  onVerificationReviewClicked() {
    this.isVerificationReviewPopupOpened = true;
  }

  /** External event methods **/

  loadClientImpInfo() {
    this.caseFacade.loadClientImportantInfo(this.clientCaseId);
  }

  loadClientProfileInfoEventHandler() {
    this.caseFacade.loadClientProfileHeader(this.profileClientId);
    this.onClientProfileHeaderLoad();
  }

  onClientProfileHeaderLoad() {
    this.clientProfileHeader$
      ?.pipe(first((clientHeaderData: any) => clientHeaderData?.clientId > 0))
      .subscribe((clientHeaderData: any) => {
        if (clientHeaderData?.clientId > 0) {

          this.clientId = clientHeaderData?.clientId;
          this.clientCaseEligibilityId =
            clientHeaderData?.clientCaseEligibilityId;
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
            clientOfficialIdFullName:
              clientHeaderData?.clientOfficialIdFullName,
            caseWorkerId: clientHeaderData?.caseWorkerId,
            clientCaseEligibilityCerId : clientHeaderData?.clientCaseEligibilityCerId
          };
          this.clientCaseId = clientHeader?.clientCaseId;
          this.clientHeaderSubject.next(clientHeader);
          if (clientHeader?.clientCaseEligibilityId) {
            this.clientCaseEligibilityId =
              clientHeader?.clientCaseEligibilityId;
          }
          if (clientHeader?.caseWorkerId) {
            this.caseWorkerId = clientHeader?.caseWorkerId;
          }
          if (clientHeader?.clientCaseId) {
            this.clientCaseId = clientHeader?.clientCaseId;
          }
          this.getCaseStatusDetails();
          this.onTabClick(ClientProfileTabs.CLIENT_INFO);
        }
      this.userManagementFacade.getUserById(this.caseWorkerId);
      });
  }

  onTabClick(tabName: string) {
    this.selectedTabName = tabName;
    switch (tabName) {
      case ClientProfileTabs.CLIENT_INFO:
        this.client_button_grp = true;
        this.health_button_grp = false;
        this.dental_button_grp = false;
        this.drugs_button_grp = false;
        this.mng_button_grp = false;
        break;
      case ClientProfileTabs.HEALTH_INSURANCE_STATUS:
        this.client_button_grp = false;
        this.health_button_grp = true;
        this.dental_button_grp = false;
        this.drugs_button_grp = false;
        this.mng_button_grp = false;
        break;
      case ClientProfileTabs.DENTAL_INSURANCE_STATUS:
        this.client_button_grp = false;
        this.health_button_grp = false;
        this.dental_button_grp = true;
        this.drugs_button_grp = false;
        this.mng_button_grp = false;
        break;
      case ClientProfileTabs.DRUGS_PHARMACIES:
        this.client_button_grp = false;
        this.health_button_grp = false;
        this.dental_button_grp = false;
        this.drugs_button_grp = true;
        this.mng_button_grp = false;
        break;
      case ClientProfileTabs.MANAGEMENT_MANAGER:
        this.client_button_grp = false;
        this.health_button_grp = false;
        this.dental_button_grp = false;
        this.drugs_button_grp = false;
        this.mng_button_grp = true;
        break;
      case ClientProfileTabs.STATUS_PERIOD:
      case ClientProfileTabs.APP_HISTORY:
      case ClientProfileTabs.ATTACHMENTS:
        this.client_button_grp = false;
        this.health_button_grp = false;
        this.dental_button_grp = false;
        this.drugs_button_grp = false;
        this.mng_button_grp = false;
        break;
    }
    this.caseFacade.onClientProfileTabSelect(
      tabName,
      this.profileClientId,
      this.clientCaseEligibilityId,
      this.clientCaseId
    );
  }

  onTabSelect(tabName: string) {
    this.selectedTabName = tabName;
    this.caseFacade.onClientProfileTabSelect(
      tabName,
      this.profileClientId,
      this.clientCaseEligibilityId,
      this.clientCaseId
    );
  }
  loadChangeGroupData(eligibilityId: string) {
    this.caseFacade.loadEligibilityChangeGroups(eligibilityId);
  }

  updateChangeGroup(group: any) {
    this.caseFacade.updateEligibilityGroup(group);
  }

  getCaseStatusDetails() {
    this.loaderService.show();
    this.caseFacade.getCaseStatusByClientEligibilityId(this.profileClientId,this.clientCaseEligibilityId).subscribe({
      next: (response: any) => {
        this.loaderService.hide();
        if(response?.caseStatusCode == CaseStatusCode.reject || response?.caseStatusCode == CaseStatusCode.disenrolled){
          this.caseFacade.setCaseReadOnly(true);
        }

        else{
          this.caseFacade.setCaseReadOnly(false);
        }
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
      }
    })
  }
}
