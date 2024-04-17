/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Case } from '../entities/case';
import { Program } from '../entities/program';

/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientCase } from '../entities/client-case';
import { ClientProfileCase } from '../entities/client-profile-cases';
import { CaseHistory } from '../entities/case-history';
import { ActiveSessions } from '../entities/active-sessions';

@Injectable({ providedIn: 'root' })
export class CaseDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) { }


  /** Public methods **/
  loadCases(caseParams:any) {
    const ClientCasesPagedResultRequest=
      {
        CaseScreenType : caseParams.caseScreenType,
        SortType : caseParams.sortType,
        Sorting : caseParams.sort,
        SkipCount : caseParams.skipcount,
        MaxResultCount : caseParams.maxResultCount,
        columnName: caseParams.columnName,
        Filter: caseParams.filter,
        TotalCount: caseParams.totalClientsCount,
        AfterDate: caseParams.afterDate,
        BeforeDate: caseParams.beforeDate
      }

    return this.http.post<ClientProfileCase[]>(

      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/cases`,
      ClientCasesPagedResultRequest
    );
  }

  loadClientProfile(clientCaseEligibilityId: string) {
    return this.http.get<ClientProfileCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientCaseEligibilityId}/profile`
    );

  }

  loadClientProfileHeader(clientId: number) {
    return this.http.get<ClientProfileCase>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/profile-header`
    );

  }

  loadClientEligibility(clientId: number) {
    return this.http.get<ClientProfileCase>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}`
    );

  }

  loadClientImportantInfo(clientCaseId: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientCaseId}/info`
    );

  }

  loadEligibilityGroups(){
    return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/eligibility-periods/eligibility-groups`);
  }

  loadEligibilityGroup(eligibilityId : string){
    return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/eligibility-periods/${eligibilityId}/groups`);
  }

  updateEligibilityGroup(group : any){
    return this.http.put<boolean>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/eligibility-periods/${group.eligibilityId}/groups`, group);
  }

  deleteEligibilityGroup(groupId: string) {
    return this.http.delete<boolean>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/eligibility-periods/groups/${groupId}`);
  }

  loadCaseHistory(): Observable<CaseHistory[]> {
    return of([
      {
        caseNumber: 13,
        caseStatus: 'New',
        eligibilityPeriods: 2,
        startDate: '01/01/2020',
        endDate: '01/01/2020'
      },
      {
        caseNumber: 12,
        caseStatus: 'DisEnrolled',
        eligibilityPeriods: 12,
        startDate: '01/01/2020',
        endDate: '01/01/2020'
      }
      ,
      {
        caseNumber: 11,
        caseStatus: 'DisEnrolled',
        eligibilityPeriods: 15,
        startDate: '01/01/2020',
        endDate: '01/01/2020'
      }
      ,
      {
        caseNumber: 10,
        caseStatus: 'DisEnrolled',
        eligibilityPeriods: 15,
        startDate: '01/01/2020',
        endDate: '01/01/2020'
      }
    ]);
  }
  loadCasesold(): Observable<Case[]> {
    return of([
      {
        CaseId: 'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId: '2',
        ClientName: 'John Sakariya',
        Pronouns: 'She/Her/Hers',
        ID: 100,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        CaseId: 'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId: '2',
        ClientName: 'David Miller',
        Pronouns: 'She/Her/Hers',
        ID: 101,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        CaseId: 'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId: '2',
        ClientName: 'Clara Stephen',
        Pronouns: 'She/Her/Hers',
        ID: 102,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        CaseId: 'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId: '2',
        ClientName: 'David Miller',
        Pronouns: 'She/Her/Hers',
        ID: 103,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        CaseId: 'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId: '2',
        ClientName: 'Johny Slot',
        Pronouns: 'She/Her/Hers',
        ID: 104,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        CaseId: 'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId: '2',
        ClientName: 'Chris Fedex',
        Pronouns: 'She/Her/Hers',
        ID: 105,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        CaseId: 'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId: '2',
        ClientName: 'Amaze Judge',
        Pronouns: 'She/Her/Hers',
        ID: 106,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        CaseId: 'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId: '2',
        ClientName: 'Dude Vills',
        Pronouns: 'She/Her/Hers',
        ID: 107,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
    ]);
  }

  loadCaseBySearchText(text: string) {
    return this.http.get<ClientCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/SearchText=${text}`
    );

  }

  loadCasesForAuthuser(): Observable<Case[]> {
    return this.getClients();
  }

  loadRecentCases(): Observable<Case[]> {
    return this.getClients();
  }

  private getClients() {
    return of([
      {
        ClientName: 'John Sakariya',
        Pronouns: 'She/Her/Hers',
        ID: 100,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'David Miller',
        Pronouns: 'She/Her/Hers',
        ID: 101,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Clara Stephen',
        Pronouns: 'She/Her/Hers',
        ID: 102,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'David Miller',
        Pronouns: 'She/Her/Hers',
        ID: 103,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Johny Slot',
        Pronouns: 'She/Her/Hers',
        ID: 104,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Chris Fedex',
        Pronouns: 'She/Her/Hers',
        ID: 105,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Amaze Judge',
        Pronouns: 'She/Her/Hers',
        ID: 106,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
      {
        ClientName: 'Dude Vills',
        Pronouns: 'She/Her/Hers',
        ID: 107,
        URN: 100000,
        PreferredContact: '(415) 123-4567',
        Status: 'ACCEPT',
        Group: 'Group 1',
        EligibilityStartDate: '01-01-2022',
        EligibilityEndDate: '01-03-2022',
      },
    ]);
  }

  loadActiveSession(): Observable<ActiveSessions[]> {
    return this.http.get<ActiveSessions[]>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/users/active-sessions`);
  }

  createActiveSession(session: any) {
    return this.http.post<boolean>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/users/active-sessions`, session);
  }

  updateActiveSessionOrder(session: any) {
    return this.http.put<boolean>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/users/active-sessions`, session);
  }

  deleteActiveSession(activeSessionId: any) {
    return this.http.delete<boolean>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/users/active-sessions/${activeSessionId}`);
  }

  loadDdlGridColumns() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlCommonActions() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlSendLetters() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }


  loadCasesById(clientCaseId: string) {
    return this.http.get<ClientCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/cases/${clientCaseId}`
    );
  }


  loadDdlPrograms() {

    return this.http.get<Program[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/client-case/programs`
    );
  }



  loadDdlFamilyAndDependentEP() {
    return of([
      '01-01-2022 - 02-02-2022',
      '01-01-2022 - 02-02-2022',
      '01-01-2022 - 02-02-2022',
      '01-01-2022 - 02-02-2022',
    ]);
  }

  loadDdlEPEmployments() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  UpdateCase(caseData: any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-case`,
      caseData
    );
  }
  updateCaseStatus(caseData: any, clientCaseId: any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/cases/${clientCaseId}/status`, caseData
    );
  }
  loadCasesStatusById(clientCaseId: string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/cases/${clientCaseId}/status`
    );
  }
  getSessionInfoByCaseEligibilityId(clientCaseEligibilityId: any) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/cases/${clientCaseEligibilityId}/SessionSearch`);
  }

  loadEligibilityPeriods(clientCaseId: string){
    return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/cases/${clientCaseId}/eligibility-periods`);
  }

  loadCasesStatusByClientEligibilityId(clientId: any, clientCaseEligibilityId: any) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/${clientId}/eligibility/${clientCaseEligibilityId}/status`
    );
  }
}
