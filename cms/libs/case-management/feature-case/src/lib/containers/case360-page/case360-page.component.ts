/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Internal libraries **/
import { ClientProfile, CommunicationEvents, ScreenType, CaseFacade, IncomeFacade, EmploymentFacade, ClientProfileTab} from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { first, Subject } from 'rxjs';
import { SelectEvent } from '@progress/kendo-angular-layout';

@Component({
  selector: 'case-management-case360-page',
  templateUrl: './case360-page.component.html',
  styleUrls: ['./case360-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Case360PageComponent implements OnInit {
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
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public uiTabStripScroll : UITabStripScroll = new UITabStripScroll();
  ddlIncomeEP$ = this.caseFacade.ddlIncomeEP$;  
  ddlFamilyAndDependentEP$ = this.caseFacade.ddlFamilyAndDependentEP$;
  clientProfile$ = this.caseFacade.clientProfile$;
  clientProfileHeader$ = this.caseFacade.clientProfileHeader$;
  ddlEmploymentEP$ = this.caseFacade.ddlEmploymentEP$;
  clientProfileImpInfo$ = this.caseFacade.clientProfileImpInfo$;
  selectedCase$ = this.selectedCase.asObservable();
  screenName = ScreenType.Case360Page;
  isVerificationReviewPopupOpened = false;
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
  selectedClientTab: ClientProfileTab = 0;
  clientCaseId! : string
  actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
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
    private readonly incomeFacade: IncomeFacade,
    private readonly employmentFacade: EmploymentFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.clientInfoVisibleSubject.next(false);
    this.clientHeaderVisibleSubject.next(false); 
    this.caseSelection();
    this.loadDdlFamilyAndDependentEP();
    this.loadDdlEPEmployments();
    this.getQueryParams(); 
  }

  /** Private methods **/
private getQueryParams()
{  
  this.profileClientId = this.route.snapshot.params['id']; 
   
  if(this.profileClientId > 0)
  { 
  this.clientHeaderVisibleSubject.next(true); 
  }
}

 /** Getters **/
 get clientProfileTab(): typeof ClientProfileTab {
  return ClientProfileTab; 
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

  private loadIncomeData(clientId: any, eligibilityId: any, skipCount: number,
    pageSize: number, sortBy: string, sortType: string) {
   this.incomeFacade.loadIncomes(clientId, eligibilityId, skipCount, pageSize, sortBy, sortType);
  }

  private loadEmploymentData(clientId: any, eligibilityId: any, skipCount: number,
    pageSize: number, sortBy: string, sortType: string) {
    this.employmentFacade.loadEmployers(clientId, eligibilityId, skipCount, pageSize, sortBy, sortType);
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

  onClientProfileTabSelected(event: SelectEvent) {
    this.selectedClientTab = event.index;
    switch(this.selectedClientTab) {
      case ClientProfileTab.INCOME:  { 
        this.loadIncomes();
        break; 
       }
      case ClientProfileTab.EMPLOYMENT: {
        this.loadEmployments();
        break;
      } 
      default: 
      { 
        break; 
      }
    }
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

  loadReadOnlyClientInfoEventHandler()
  {
    
    this.caseFacade.loadClientProfile(this.profileClientId);
    this.onClientProfileLoad()
  }

  loadClientProfileInfoEventHandler()
  {
    
    this.caseFacade.loadClientProfileHeader(this.profileClientId);
    this.onClientProfileHeaderLoad()
  }

  public loadIncomes(){
    this.loadIncomeData(
      this.profileClientId.toString(),
      this.clientCaseEligibilityId,
      this.incomeFacade.skipCount,
      this.incomeFacade.gridPageSizes[0].value,
      this.incomeFacade.sortValue,
      this.incomeFacade.sortType);
  }

  loadIncomeListHandle(gridDataRefinerValue: any): void {
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sortColumn : gridDataRefinerValue.sortColumn,
      sortType : gridDataRefinerValue.sortType,
    };
    this.loadIncomeData(
      this.profileClientId.toString(),
      this.clientCaseEligibilityId,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sortColumn,
      gridDataRefiner.sortType
    );
  }

  public loadEmployments(){
    this.loadEmploymentData(
      this.profileClientId.toString(),
      this.clientCaseEligibilityId,
      this.employmentFacade.skipCount,
      this.employmentFacade.gridPageSizes[0].value,
      this.employmentFacade.sortValue,
      this.employmentFacade.sortType);
  }

  loadEmploymentsHandle(gridDataRefinerValue: any): void {
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sort: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
    };
    this.loadEmploymentData(
      this.profileClientId.toString(),
      this.clientCaseEligibilityId,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sort,
      gridDataRefiner.sortType
    );
  }
 

  onClientProfileHeaderLoad()
  {  
    this.clientProfileHeader$?.pipe(first((clientHeaderData: any ) => clientHeaderData?.clientId > 0))
    .subscribe((clientHeaderData: any) =>
    {
      if(clientHeaderData?.clientId > 0)
      {    
        
         const  clientHeader = {
             
          clientCaseEligibilityId: clientHeaderData?.clientCaseEligibilityId,
          clientId: clientHeaderData?.clientId,
          clientCaseId: clientHeaderData?.clientCaseId,
          urn: clientHeaderData?.urn,
          caseStatus: clientHeaderData?.caseStatus,
          group: clientHeaderData?.group,
          eilgibilityStartDate:clientHeaderData?.eilgibilityStartDate,
          eligibilityEndDate: clientHeaderData?.eligibilityEndDate,
          fpl:clientHeaderData?.fpl,
          clientFullName: clientHeaderData?.clientFullName,       
          pronouns:  clientHeaderData?.pronouns,
          clientCaseIdentity : clientHeaderData?.clientCaseIdentity,
          clientOfficialIdFullName : clientHeaderData?.clientOfficialIdFullName,
          caseWorkerId   : clientHeaderData?.caseWorkerId ,           
         }
         this.clientCaseId = clientHeader?.clientCaseId
         this.clientHeaderSubject.next(clientHeader);
         if(clientHeader?.clientCaseEligibilityId)
         {
          this.clientCaseEligibilityId = clientHeader?.clientCaseEligibilityId;         
         }   
         if(clientHeader?.caseWorkerId)
         {
          this.caseWorkerId = clientHeader?.caseWorkerId;         
         }        
         if(clientHeader?.clientCaseId)
         {
          this.clientCaseId = clientHeader?.clientCaseId;         
         }
      }
    });
  }
  onClientProfileLoad()
  {     
    this.clientProfile$?.pipe(first((clientData: any ) => clientData?.clientId > 0))
    .subscribe((clientData: ClientProfile) =>
    {
      if(clientData?.clientId > 0)
      {    
        
         const  client = {
             
          clientId   : clientData?.clientId , 
          firstName   : clientData?.firstName , 
          middleName   : clientData?.middleName , 
          lastName   : clientData?.lastName , 
          caseManagerId   : clientData?.caseManagerId ,
          caseManagerName   : clientData?.caseManagerName , 
          caseManagerPNumber   : clientData?.caseManagerPNumber ,
          caseManagerDomainCode   : clientData?.caseManagerDomainCode ,  
          caseManagerAssisterGroup   : clientData?.caseManagerAssisterGroup ,  
          caseManagerEmail   : clientData?.caseManagerEmail , 
          caseManagerPhone   : clientData?.caseManagerPhone ,  
          caseManagerFax   : clientData?.caseManagerFax , 
          caseManagerAddress1   : clientData?.caseManagerAddress1 , 
          caseManagerAddress2   : clientData?.caseManagerAddress2 ,  
          caseManagerCity   : clientData?.caseManagerCity ,  
          caseManagerState   : clientData?.caseManagerState , 
          caseManagerZip   : clientData?.caseManagerZip ,
          insuranceFirstName   : clientData?.insuranceFirstName , 
          insuranceLastName   : clientData?.insuranceLastName , 
          officialIdFirstName   : clientData?.officialIdFirstName , 
          officialIdLastName   : clientData?.officialIdLastName ,  
          dob   : clientData?.dob , 
          pronouns   : clientData?.pronouns ,
          genderDescription   : clientData?.genderDescription ,  
          gender   : clientData?.gender , 
          ssn   : clientData?.ssn , 
          clientTransgenderCode   : clientData?.clientTransgenderCode , 
          clientTransgenderDesc   : clientData?.clientTransgenderDesc , 
          clientSexualIdentities   : clientData?.clientSexualIdentities ,  
          otherSexualDesc   : clientData?.otherSexualDesc , 
          spokenLanguage   : clientData?.spokenLanguage ,  
          writtenLanguage   : clientData?.writtenLanguage ,  
          englishProficiency   : clientData?.englishProficiency , 
          ethnicIdentity   : clientData?.ethnicIdentity , 
          racialIdentities   : clientData?.racialIdentities , 
          primaryRacialIdentity   : clientData?.primaryRacialIdentity,
          lastModificationTime : clientData?.lastModificationTime,
          lastModifierName : clientData?.lastModifierName,
          lastModifierId : clientData?.lastModifierId
         }
         
         this.clientSubject.next(client);
        
      }
    });
   
  }
  

  loadHeaderAndProfile(){
    this.loadClientProfileInfoEventHandler();
    this.loadReadOnlyClientInfoEventHandler();
  }
}