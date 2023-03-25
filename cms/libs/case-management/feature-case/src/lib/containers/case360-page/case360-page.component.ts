/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Internal libraries **/
import {DrugPharmacyFacade, ClientProfile, CommunicationEvents, ScreenType, CaseFacade,WorkflowFacade, ContactFacade } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { filter, first, Subject, Subscription } from 'rxjs';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { LovFacade } from '@cms/system-config/domain';
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
  private clientSubject = new Subject<any>();
  private clientHeaderSubject = new Subject<any>();
  private clientInfoVisibleSubject = new Subject<any>();
  private clientHeaderVisibleSubject = new Subject<any>();

  loadedClient$ = this.clientSubject.asObservable();
  loadedClientHeader$ = this.clientHeaderSubject.asObservable();
  clientInfoVisible$ = this.clientInfoVisibleSubject.asObservable();
  clientHeaderVisible$ = this.clientHeaderVisibleSubject.asObservable();
  /** Public properties **/
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  ddlIncomeEP$ = this.caseFacade.ddlIncomeEP$;
  ddlFamilyAndDependentEP$ = this.caseFacade.ddlFamilyAndDependentEP$;
  clientProfile$ = this.caseFacade.clientProfile$;
  clientProfileHeader$ = this.caseFacade.clientProfileHeader$;
  ddlEmploymentEP$ = this.caseFacade.ddlEmploymentEP$;
  clientProfileImpInfo$ = this.caseFacade.clientProfileImpInfo$;
  selectedCase$ = this.selectedCase.asObservable();
  screenName = ScreenType.Case360Page;
  isVerificationReviewPopupOpened = false;
  //for add pharmacy
  clientpharmacies$ = this.drugPharmacyFacade.clientPharmacies$;
  pharmacysearchResult$ = this.drugPharmacyFacade.pharmacies$;
  searchLoaderVisibility$ = this.drugPharmacyFacade.searchLoaderVisibility$;
  addPharmacyRsp$ = this.drugPharmacyFacade.addPharmacyResponse$;
  editPharmacyRsp$ = this.drugPharmacyFacade.editPharmacyResponse$;
  removePharmacyRsp$ = this.drugPharmacyFacade.removePharmacyResponse$;
  removeDrugPharmacyRsp$ = this.drugPharmacyFacade.removeDrugPharmacyResponse$;
  triggerPriorityPopup$ = this.drugPharmacyFacade.triggerPriorityPopup$;
  selectedPharmacy$ = this.drugPharmacyFacade.selectedPharmacy$;
  
  isTodoDetailsOpened = false;
  isNewReminderOpened = false;
  isIdCardOpened = false;
  isSendNewLetterOpened = false;
  isSendNewEmailOpened = false;
  isNewSMSTextOpened = false;
  profileClientId = 0
  clientCaseEligibilityId! : string;
  caseWorkerId! : string;
  clientHeaderTabs: any = [];
  clientCaseId! : string 
  actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  clientId:any;
  clientChangeSubscription$ = new Subscription();
  public SendActions = [
    {
      buttonType: "btn-h-primary",
      text: "New Letter",
      icon: "markunread_mailbox",
      click: (): void => {
        this.onSendNewLetterClicked();
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "New Email",
      icon: "mail_outline",
      click: (): void => {
        this.onSendNewEmailClicked()
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "New SMS Text",
      icon: "comment",
      click: (): void => {
        this.onNewSMSTextClicked()
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "New ID Card",
      icon: "call_to_action",
      click: (): void => {
        this.onIdCardClicked()
      },
    },

  ];
  /** Constructor**/
  constructor(
    private readonly caseFacade: CaseFacade,
    private readonly route: ActivatedRoute,
    private drugPharmacyFacade: DrugPharmacyFacade,
    private workflowFacade: WorkflowFacade,
    private readonly router: Router,
    private readonly contactFacade : ContactFacade,
    private readonly lovFacade : LovFacade
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
    this.clientInfoVisibleSubject.next(false);
    this.clientHeaderVisibleSubject.next(true);
    this.caseSelection();
    this.loadDdlFamilyAndDependentEP();
    this.loadDdlEPEmployments();
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

  private loadDdlFamilyAndDependentEP(): void {
    this.caseFacade.loadDdlFamilyAndDependentEP();
  }

  private loadDdlEPEmployments(): void {
    this.caseFacade.loadDdlEPEmployments();
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
        this.loadReadOnlyClientInfoEventHandler();
      }
    });
  }

  private resetTabs(){
    Promise.resolve(null).then(() => this.tabStripParent.selectTab(0));
    Promise.resolve(null).then(() => this.tabStripChild.selectTab(0));
  }

  /** Internal event methods **/
  onTodoDetailsClosed() {
    this.isTodoDetailsOpened = false;
  }

  onTodoDetailsClicked() {
    this.isTodoDetailsOpened = true;
  }

  onNewReminderClosed() {
    this.isNewReminderOpened = false;
  }

  onNewReminderClicked() {
    this.isNewReminderOpened = true;
  }

  onIdCardClicked() {
    this.isIdCardOpened = true;
  }

  onSendNewLetterClicked() {
    this.isSendNewLetterOpened = true;
  }

  onSendNewEmailClicked() {
    this.isSendNewEmailOpened = true;
  }

  onNewSMSTextClicked() {
    this.isNewSMSTextOpened = true;
  }

  onVerificationReviewClosed() {
    this.isVerificationReviewPopupOpened = false;
  }

  onVerificationReviewClicked() {
    this.isVerificationReviewPopupOpened = true;
  }

  onIdCardClosed() {
    this.isIdCardOpened = false;
  }

  /** External event methods **/
  handleSendNewEmailClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isSendNewEmailOpened = false;
    }
  }

  handleNewSMSTextClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isNewSMSTextOpened = false;
    }
  }

  handleSendNewLetterClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isSendNewLetterOpened = false;
    }
  }

  handleIdCardClosed() {
    this.isIdCardOpened = false;
  }

  loadClientImpInfo()
  {
    this.caseFacade.loadClientImportantInfo(this.clientCaseId);
  }
  searchPharmacy(searchText: string) {
    this.drugPharmacyFacade.searchPharmacies(searchText);
  }
  addPharmacy(vendorId: string) {
    let priorityCode :string = "";
    this.drugPharmacyFacade.drugPharnacyPriority.subscribe(priorityCodes =>{
     
      priorityCode = priorityCodes;
    })
    this.drugPharmacyFacade.addDrugPharmacy(
      this.profileClientId,
      vendorId,
      priorityCode
    );
  }
  loadReadOnlyClientInfoEventHandler() {
    this.caseFacade.loadClientProfile(this.profileClientId);
    this.onClientProfileLoad()
  }

  loadClientProfileInfoEventHandler() {    
    this.caseFacade.loadClientProfileHeader(this.profileClientId);
    this.onClientProfileHeaderLoad()
  }

  removePharmacy(clientPharmacyId: string) {
    this.drugPharmacyFacade.removeClientPharmacy(
      this.workflowFacade.clientId ?? 0,
      clientPharmacyId
    );
  }
  removeDrugPharmacyRsp(vendorId: any) {
    this.drugPharmacyFacade.removeDrugPharmacy(
      this.profileClientId ?? 0,
      vendorId
    );
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
  onClientProfileLoad() {
    this.clientProfile$?.pipe(first((clientData: any) => clientData?.clientId > 0))
      .subscribe((clientData: ClientProfile) => {
        if (clientData?.clientId > 0) {

          const client = {

            clientId: clientData?.clientId,
            firstName: clientData?.firstName,
            middleName: clientData?.middleName,
            lastName: clientData?.lastName,
            caseManagerId: clientData?.caseManagerId,
            caseManagerName: clientData?.caseManagerName,
            caseManagerPNumber: clientData?.caseManagerPNumber,
            caseManagerDomainCode: clientData?.caseManagerDomainCode,
            caseManagerAssisterGroup: clientData?.caseManagerAssisterGroup,
            caseManagerPhone: clientData?.caseManagerPhone,
            caseManagerEmail: clientData?.caseManagerEmail,
            caseManagerFax: clientData?.caseManagerFax,
            caseManagerAddress1: clientData?.caseManagerAddress1,
            caseManagerAddress2: clientData?.caseManagerAddress2,
            caseManagerCity: clientData?.caseManagerCity,
            caseManagerState: clientData?.caseManagerState,
            caseManagerZip: clientData?.caseManagerZip,
            insuranceFirstName: clientData?.insuranceFirstName,
            insuranceLastName: clientData?.insuranceLastName,
            officialIdFirstName: clientData?.officialIdFirstName,
            officialIdLastName: clientData?.officialIdLastName,
            dob: clientData?.dob,
            pronouns: clientData?.pronouns,
            genderDescription: clientData?.genderDescription,
            gender: clientData?.gender,
            ssn: clientData?.ssn,
            clientTransgenderCode: clientData?.clientTransgenderCode,
            clientTransgenderDesc: clientData?.clientTransgenderDesc,
            clientSexualIdentities: clientData?.clientSexualIdentities,
            otherSexualDesc: clientData?.otherSexualDesc,
            spokenLanguage: clientData?.spokenLanguage,
            writtenLanguage: clientData?.writtenLanguage,
            englishProficiency: clientData?.englishProficiency,
            ethnicIdentity: clientData?.ethnicIdentity,
            racialIdentities: clientData?.racialIdentities,
            primaryRacialIdentity: clientData?.primaryRacialIdentity,
            lastModificationTime: clientData?.lastModificationTime,
            lastModifierName: clientData?.lastModifierName,
            lastModifierId: clientData?.lastModifierId
          }

          this.clientSubject.next(client);

        }
      });

  }


  loadHeaderAndProfile() {
    this.loadClientProfileInfoEventHandler();
    this.loadReadOnlyClientInfoEventHandler();
  }

  
}
