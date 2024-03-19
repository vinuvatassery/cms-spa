/** Angular **/
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ConfigurationProvider,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  NotificationSource,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

import { catchError, forkJoin, mergeMap, of, Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Case } from '../entities/case';

/** Data services **/
import { CaseDataService } from '../infrastructure/case.data.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ActiveSessions } from '../entities/active-sessions';
import { Router } from '@angular/router';
import { ClientProfileTabs } from '../enums/client-profile-tabs.enum';
import { SearchHeaderType } from '../enums/search-header-type.enum';
import { GridColumnFilter} from '../enums/grid-column-filter.enum';
import { CaseScreenTab } from '../enums/case-screen-tab.enum';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class CaseFacade {
  /** Private properties **/
  private myCasesSubject = new BehaviorSubject<Case[]>([]);
  private recentCaseSubject = new BehaviorSubject<Case[]>([]);
  private caseSearchedSubject = new BehaviorSubject<any>([]);
  private lastVisitedCasesSubject = new BehaviorSubject<any>([]);
  private ddlProgramsSubject = new BehaviorSubject<any>([]);
  private ddlFamilyAndDependentEPSubject = new BehaviorSubject<any>([]);
  private ddlIncomeEPSubject = new BehaviorSubject<any>([]);
  private ddlEmploymentEPSubject = new BehaviorSubject<any>([]);
  private ddlGridColumnsSubject = new BehaviorSubject<any>([]);
  private ddlCommonActionsSubject = new BehaviorSubject<any>([]);
  private ddlSendLettersSubject = new BehaviorSubject<any>([]);
  private updateCaseSubject = new Subject<any>();
  private getCaseSubject = new Subject<any>();
  private getCaseHistorySubject = new BehaviorSubject<any[]>([]);
  private casesSubject = new Subject<any>();
  private clientProfileSubject = new Subject<any>();
  private clientProfileHeaderSubject = new Subject<any>();
  private clientProfileHeaderLoaderSubject = new Subject<any>();
  private activeSessionLoaderVisibleSubject = new BehaviorSubject<boolean>(
    false
  );
  private searchLoaderVisibilitySubject = new BehaviorSubject<boolean>(false);
  private isCaseReadOnlySubject = new BehaviorSubject<boolean>(false);
  private clientProfileImpInfoSubject  = new Subject<any>();
  private ddlGroupsSubject = new BehaviorSubject<any>([]);
  private currentGroupSubject = new BehaviorSubject<any>(null);
  private groupUpdatedSubject = new BehaviorSubject<any>(false);
  private groupDeletedSubject = new BehaviorSubject<boolean>(false);
  private ddlEligPeriodsSubject = new BehaviorSubject<any>([]);
  private searchBarsubject = new Subject<string>();
  private myClientsSubject = new Subject<any>();
  private recentClientsSubject = new Subject<any>();
  private allClientsSubject = new Subject<any>();


  /** Public properties **/
  myClients$ = this.myClientsSubject.asObservable();
  recentClients$ = this.recentClientsSubject.asObservable();
  allClients$ = this.allClientsSubject.asObservable();
  cases$ = this.casesSubject.asObservable();
  myCases$ = this.myCasesSubject.asObservable();
  recentCases$ = this.recentCaseSubject.asObservable();
  caseSearched$ = this.caseSearchedSubject.asObservable();
  lastVisitedCases$ = this.lastVisitedCasesSubject.asObservable();
  ddlPrograms$ = this.ddlProgramsSubject.asObservable();
  ddlFamilyAndDependentEP$ = this.ddlFamilyAndDependentEPSubject.asObservable();
  ddlIncomeEP$ = this.ddlIncomeEPSubject.asObservable();
  ddlEmploymentEP$ = this.ddlEmploymentEPSubject.asObservable();
  ddlGridColumns$ = this.ddlGridColumnsSubject.asObservable();
  ddlCommonActions$ = this.ddlCommonActionsSubject.asObservable();
  ddlSendLetters$ = this.ddlSendLettersSubject.asObservable();
  updateCase$ = this.updateCaseSubject.asObservable();
  getCase$ = this.getCaseSubject.asObservable();
  getCaseHistory$ = this.getCaseHistorySubject.asObservable();
  clientProfile$ = this.clientProfileSubject.asObservable();
  clientProfileHeader$ = this.clientProfileHeaderSubject.asObservable();
  clientProfileHeaderLoader$ = this.clientProfileHeaderLoaderSubject.asObservable()
  clientProfileImpInfo$ = this.clientProfileImpInfoSubject.asObservable();
  activeSessionLoaderVisible$ =
    this.activeSessionLoaderVisibleSubject.asObservable();
  searchLoaderVisibility$ = this.searchLoaderVisibilitySubject.asObservable();
  ddlGroups$ = this.ddlGroupsSubject.asObservable();
  currentGroup$ =  this.currentGroupSubject.asObservable();
  groupUpdated$ = this.groupUpdatedSubject.asObservable();
  groupDeleted$ = this.groupDeletedSubject.asObservable();
  ddlEligPeriods$ = this.ddlEligPeriodsSubject.asObservable();
  isCaseReadOnly$ = this.isCaseReadOnlySubject.asObservable();
  searchBars$ = this.searchBarsubject.asObservable();

  public gridPageSizes =
    this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  public totalClientsCount = 50;
  public sortValue = 'clientFullName';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [
    {
      field: this.sortValue,
      dir: 'asc',
    },
  ];
  activeSession!: ActiveSessions[];
  userManagerprofilePhotoSubject = new Subject();
  userLastModifierProfilePhotoSubject = new Subject();

  constructor(
    private readonly caseDataService: CaseDataService,
    private readonly loggingService: LoggingService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    public readonly intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly router: Router,
    private readonly userManagementFacade: UserManagementFacade,
  ) {}

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  /** Public methods **/
  onClientProfileTabSelect(
    tabName: string,
    profileClientId: number,
    clientCaseEligibilityId: string,
    clientCaseId : string
  ) {
    const redirectUrl = '/case-management/cases/case360/' + profileClientId;
    const query = {
      queryParams: {
        e_id: clientCaseEligibilityId,
        tid: tabName,
        id: profileClientId,
        cid : clientCaseId
      },
    };
    switch (tabName) {
      case ClientProfileTabs.CLIENT_INFO:
        this.router.navigate([redirectUrl + '/client/profile'], query);
        break;

      case ClientProfileTabs.CLIENT_CONTACT_INFO:
        this.router.navigate([redirectUrl + '/contact-info/profile'], query);
        break;
      case ClientProfileTabs.CLIENT_FAMILY_DEPENDENTS:
        this.router.navigate(
          [redirectUrl + '/family-dependents/profile'],
          query
        );
        break;

      case ClientProfileTabs.CLIENT_INCOME:
        this.router.navigate([redirectUrl + '/income/profile'], query);
        break;
        case ClientProfileTabs.CLIENT_SMOKING_CESS:
          this.router.navigate([redirectUrl + '/smoking-cessation/profile'], query);
          break;

      case ClientProfileTabs.CLIENT_EMPLOYMENT:
        this.router.navigate([redirectUrl + '/employment/profile'], query);
        break;
      case ClientProfileTabs.HEALTH_INSURANCE_STATUS:
      case ClientProfileTabs.HEALTH_INSURANCE_COPAY:
      case ClientProfileTabs.DENTAL_INSURANCE_STATUS:
      case ClientProfileTabs.DENTAL_INSURANCE_COPAY:
      case ClientProfileTabs.HEALTH_INSURANCE_PREMIUM_PAYMENTS:
      case ClientProfileTabs.DENTAL_INSURANCE_PREMIUM_PAYMENTS:
        this.router.navigate(
          [redirectUrl + '/health-insurance/profile'],
          query
        );
        break;
      case ClientProfileTabs.DRUGS_PHARMACIES:
      case ClientProfileTabs.DRUGS_PURCHASED:
        this.router.navigate(
          [redirectUrl + '/prescription-drugs/profile'],
          query
        );
        break;
      case ClientProfileTabs.MANAGEMENT_MANAGER:
      case ClientProfileTabs.MANAGEMENT_CD4:
      case ClientProfileTabs.MANAGEMENT_VRL:
        this.router.navigate([redirectUrl + '/case-manager/profile'], query);
        break;

      case  ClientProfileTabs.MANAGEMENT_PROVIDER:
        this.router.navigate(
          [redirectUrl + '/healthcare-provider/profile'],
          query
        );
        break;
      case ClientProfileTabs.STATUS_PERIOD:
      case ClientProfileTabs.APP_HISTORY:
        this.router.navigate(
          [redirectUrl + '/case-status-period/profile'],
          query
        );
        break;
        case ClientProfileTabs.ATTACHMENTS:
          this.router.navigate([redirectUrl + '/case-document/profile'], query);
          break;
      default:
        break;
    }
  }

  loadEligibilityPeriods(clientCaseId: string): void {
    this.caseDataService.loadEligibilityPeriods(clientCaseId).subscribe({
      next: (response) => {
        this.ddlEligPeriodsSubject.next(response);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadClientImportantInfo(clientCaseId: string): void {
    this.caseDataService.loadClientImportantInfo(clientCaseId).subscribe({
      next: (clientImportantInfoResponse) => {
        this.clientProfileImpInfoSubject.next(clientImportantInfoResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadGroupCode(){
    this.caseDataService.loadEligibilityGroups().pipe(
      catchError((err: any) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        return of(false);
      })
    ).subscribe((response: any) => {
      this.ddlGroupsSubject.next(response);
    });
  }

  loadEligibilityChangeGroups(eligibilityId:string){
    this.showLoader();
    this.caseDataService.loadEligibilityGroup(eligibilityId).pipe(
      mergeMap((currentGroup:any) => forkJoin([of(currentGroup), this.caseDataService.loadEligibilityGroups()]))
    )
    .subscribe({
      next:([currentEligibilityGroup, ddlGroups]:[any,any])=>{
        this.ddlGroupsSubject.next(ddlGroups);
        this.currentGroupSubject.next(currentEligibilityGroup);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }

  updateEligibilityGroup(group: any){
    this.showLoader();
    return this.caseDataService.updateEligibilityGroup(group).pipe(
      catchError((err: any) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        return of(false);
      })
    ).subscribe((response: boolean) => {
      this.hideLoader();
      if (response) {
        this.groupUpdatedSubject.next(true);
        this.currentGroupSubject.next(null);
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Group updated Successfully');
      }
    });
  }

  deleteEligibilityGroup(groupId: string){
    this.showLoader();
    return this.caseDataService.deleteEligibilityGroup(groupId).pipe(
      catchError((err: any) => {
        this.groupDeletedSubject.next(false);
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        return of(false);
      })
    ).subscribe((response: boolean) => {
      this.hideLoader();
      if (response) {
        this.currentGroupSubject.next(null);
        this.groupDeletedSubject.next(true);
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Group deleted successfully');
      }
    });
  }

  loadClientProfile(clientCaseEligibilityId: string): void {
    this.showLoader();
    this.caseDataService.loadClientProfile(clientCaseEligibilityId).subscribe({
      next: (clientProfileResponse: any) => {
        this.clientProfileSubject.next(clientProfileResponse);
        const caseManagerId = clientProfileResponse?.caseManagerId;
        const lastmodifierId = clientProfileResponse?.lastModifierId ?? clientProfileResponse?.creatorId;
        this.loadCaseManagerProfilePhoto(caseManagerId);
        this.loadLastModifierProfilePhoto(lastmodifierId);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadCaseManagerProfilePhoto(caseManagerId: string) {
    if(caseManagerId){
      this.userManagementFacade.getProfilePhotosByUserIds(caseManagerId)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.userManagerprofilePhotoSubject.next(data);
          }
        },
      });
    }
  }

  loadLastModifierProfilePhoto(lastmodifierId: string){
    if(lastmodifierId){
      this.userManagementFacade.getProfilePhotosByUserIds(lastmodifierId)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.userLastModifierProfilePhotoSubject.next(data);
          }
        },
      });
    }
  }

  loadClientProfileHeader(clientId: number): void {
    this.showLoader();
    this.caseDataService.loadClientProfileHeader(clientId).subscribe({
      next: (clientProfileResponse) => {
        this.clientProfileHeaderSubject.next(clientProfileResponse);
        this.hideLoader();
        if (clientProfileResponse) {
          const activeSession = {
            clientCaseId: clientProfileResponse?.clientCaseId,
            clientId: clientProfileResponse?.clientId,
          };
          this.createActiveSession(activeSession);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadClientProfileHeaderWithOutLoader(clientId: number): void {
    this.caseDataService.loadClientProfileHeader(clientId).subscribe({
      next: (clientProfileResponse) => {
        this.clientProfileHeaderLoaderSubject.next(true)

        this.clientProfileHeaderSubject.next(clientProfileResponse);
        if (clientProfileResponse) {
          const activeSession = {
            clientCaseId: clientProfileResponse?.clientCaseId,
            clientId: clientProfileResponse?.clientId,
          };
        this.clientProfileHeaderLoaderSubject.next(false)

        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadCaseHistory(): void {
    this.caseDataService.loadCaseHistory().subscribe({
      next: (casesHistoryResponse) => {
        this.getCaseHistorySubject.next(casesHistoryResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadCases(caseParams:any): void {
    this.searchLoaderVisibilitySubject.next(true);
    let isGridFilter = this.isGridFilter(caseParams.filter);
    if(!isGridFilter && caseParams.columnName !== GridColumnFilter.AllColumns){
      let _filter=
        [{
            filters:[{
              field: caseParams.columnName,
              value: caseParams.filter,
              operator: "contains"
            }]
        }]
        caseParams.filter = JSON.stringify(_filter);
    }
    this.caseDataService
      .loadCases(
        caseParams
      )
      .subscribe({
        next: (casesResponse: any) => {
          if (casesResponse) {

            const gridView = {
              data: casesResponse['items'],
              total: casesResponse['totalCount'],
            };

            if(caseParams?.caseScreenType === CaseScreenTab.ALL)
            {
              this.allClientsSubject.next(gridView);
            }
            else if(caseParams?.caseScreenType === CaseScreenTab.MY_CASES)
            {
              this.myClientsSubject.next(gridView);
            }
            else{
              this.recentClientsSubject.next(gridView);
            }

          }
          this.searchLoaderVisibilitySubject.next(false);
        },
        error: (err) => {
          this.searchLoaderVisibilitySubject.next(false);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  isGridFilter(str: string) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

  loadCaseBySearchText(text: string): void {
    this.caseDataService.loadCaseBySearchText(text).subscribe({
      next: (caseBySearchTextResponse) => {
        this.caseSearchedSubject.next(caseBySearchTextResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadCasesForAuthuser(): void {
    this.caseDataService.loadCasesForAuthuser().subscribe({
      next: (result) => {
        this.myCasesSubject.next(result);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadRecentCases(): void {
    this.caseDataService.loadRecentCases().subscribe({
      next: (result) => {
        this.recentCaseSubject.next(result);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadActiveSession(): void {
    this.activeSessionLoaderVisibleSubject.next(true);
    this.caseDataService.loadActiveSession().subscribe({
      next: (lastVisitedCasesResponse) => {
        this.activeSession = lastVisitedCasesResponse;
        this.lastVisitedCasesSubject.next(lastVisitedCasesResponse);
        this.activeSessionLoaderVisibleSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.activeSessionLoaderVisibleSubject.next(false);
      },
    });
  }

  createActiveSession(session: any) {
    this.activeSessionLoaderVisibleSubject.next(true);
    return this.caseDataService
      .createActiveSession(session)
      .pipe(
        catchError((err: any) => {
          this.handleMultipleDeviceLogin(err);
          return of(false);
        })
      )
      .subscribe((response: boolean) => {
        if (response) {
          this.activeSessionLoaderVisibleSubject.next(false);
          this.loadActiveSession();
        }
      });
  }

  updateActiveSessionOrder(session: any[]) {
    return this.caseDataService.updateActiveSessionOrder(session).pipe(
      catchError((err: any) => {
        this.handleMultipleDeviceLogin(err);
        return of(false);
      })
    );
  }

  deleteActiveSession(activeSessionId: string, isProfileOpened: boolean) {
    this.activeSessionLoaderVisibleSubject.next(true);
    return this.caseDataService
      .deleteActiveSession(activeSessionId)
      .pipe(
        catchError((err: any) => {
          this.handleMultipleDeviceLogin(err);
          return of(false);
        })
      )
      .subscribe((response) => {
        this.activeSessionLoaderVisibleSubject.next(false);
        if (response) {
          this.loadActiveSession();
          this.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            'Session Removed Successfully'
          );

          if(isProfileOpened){
            this.router.navigate(['/case-management/cases']);
          }
        }
      });
  }

  handleMultipleDeviceLogin(err: any){
    if(err){
      if(err?.error?.error?.code?.includes('MULTIPLE_DEVICE_LOGIN_WARNING')){
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.WARNING, err?.error?.error?.message,NotificationSource.UI);
        this.activeSessionLoaderVisibleSubject.next(false);
        this.hideLoader();
        return;
      }
      this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
    }
  }

  loadDdlGridColumns(): void {
    this.caseDataService.loadDdlGridColumns().subscribe({
      next: (ddlGridColumnsResponse) => {
        this.ddlGridColumnsSubject.next(ddlGridColumnsResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadDdlCommonActions(): void {
    this.caseDataService.loadDdlCommonActions().subscribe({
      next: (ddlCommonActionsResponse) => {
        this.ddlCommonActionsSubject.next(ddlCommonActionsResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
  loadCasesById(clientCaseId: string) {
    this.showLoader();
    this.caseDataService.loadCasesById(clientCaseId).subscribe({
      next: (ddlcaseGetResponse) => {
        this.getCaseSubject.next(ddlcaseGetResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
  loadDdlSendLetters(): void {
    this.caseDataService.loadDdlSendLetters().subscribe({
      next: (ddlSendLettersResponse) => {
        this.ddlSendLettersSubject.next(ddlSendLettersResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadDdlPrograms(): void {
    this.caseDataService.loadDdlPrograms().subscribe({
      next: (ddlProgramsResponse) => {
        this.ddlProgramsSubject.next(ddlProgramsResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadDdlFamilyAndDependentEP(): void {
    this.caseDataService.loadDdlFamilyAndDependentEP().subscribe({
      next: (ddlFamilyAndDependentEPResponse) => {
        this.ddlFamilyAndDependentEPSubject.next(
          ddlFamilyAndDependentEPResponse
        );
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadDdlEPEmployments(): void {
    this.caseDataService.loadDdlEPEmployments().subscribe({
      next: (ddlEmploymentEPResponse) => {
        this.ddlEmploymentEPSubject.next(ddlEmploymentEPResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadEPEmploymentData(): void {
    this.caseDataService.loadDdlEPEmployments().subscribe({
      next: (data) => {
        this.ddlEmploymentEPSubject.next(data);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  UpdateCase(existingCaseFormData: FormGroup, clientCaseId: string) {
    this.showLoader();
    const caseData = {
      clientCaseId: clientCaseId,
      assignedCwUserId: existingCaseFormData?.controls['caseOwnerId'].value,
      caseOriginCode: existingCaseFormData?.controls['caseOriginCode'].value,
      caseStartDate: existingCaseFormData?.controls['applicationDate'].value,
      concurrencyStamp:
        existingCaseFormData?.controls['concurrencyStamp'].value,
    };
    caseData.caseStartDate = this.intl.formatDate(
      caseData.caseStartDate,
      this.dateFormat
    );
    return this.caseDataService.UpdateCase(caseData);
  }

  getSessionInfoByCaseEligibilityId(clientCaseEligibilityId: any) {
    return this.caseDataService.getSessionInfoByCaseEligibilityId(clientCaseEligibilityId);
  }
  updateCaseStatus(clientCaseId: any, caseStatusCode: any, clientCaseEligibilityId: any) {
    const caseData = {
      clientCaseEligibilityId: clientCaseEligibilityId,
      caseStatusCode: caseStatusCode,
    };
    return this.caseDataService.updateCaseStatus(caseData, clientCaseId);
  }

  getCaseStatusById(clientCaseId: string) {
    return this.caseDataService.loadCasesStatusById(clientCaseId);
  }

  setCaseReadOnly(isReadOnly:any){
    this.isCaseReadOnlySubject.next(isReadOnly);
  }

  getCaseStatusByClientEligibilityId(clientId: any, clientCaseEligibilityId: any) {
    return this.caseDataService.loadCasesStatusByClientEligibilityId(clientId,clientCaseEligibilityId);
  }

  enableSearchHeader(headerType : SearchHeaderType) {
    this.searchBarsubject.next(headerType);
  }
}
