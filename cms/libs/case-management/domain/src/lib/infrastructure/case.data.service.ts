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
import { CaseScreenTab } from '../enums/case-screen-tab.enum';
import { CaseHistory } from '../entities/case-history';

@Injectable({ providedIn: 'root' })
export class CaseDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

    
  /** Public methods **/
  loadCases(CaseScreenType: CaseScreenTab, skipcount : number,maxResultCount : number ,sort : string, sortType : string) {     
    return this.http.get<ClientProfileCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-profile/cases?CaseScreenType=${CaseScreenType}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );

  }
  loadCaseHistory() : Observable<CaseHistory[]>
  {
    return of([
      { caseNumber: 13, 
        caseStatus: 'New', 
        eligibilityPeriods: 2 ,
        startDate: '01/01/2020' ,
        endDate: '01/01/2020'
      }  , 
      { caseNumber: 12, 
        caseStatus: 'DisEnrolled', 
        eligibilityPeriods: 12 ,
        startDate: '01/01/2020' ,
        endDate: '01/01/2020'
      }
      , 
      { caseNumber: 11, 
        caseStatus: 'DisEnrolled', 
        eligibilityPeriods: 15 ,
        startDate: '01/01/2020' ,
        endDate: '01/01/2020'
      }
      , 
      { caseNumber: 10, 
        caseStatus: 'DisEnrolled', 
        eligibilityPeriods: 15 ,
        startDate: '01/01/2020' ,
        endDate: '01/01/2020'
      }
    ]);
  }
  loadCasesold(): Observable<Case[]> {
    return of([
      {
        CaseId:'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId:'2',
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
        CaseId:'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId:'2',
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
        CaseId:'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId:'2',
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
        CaseId:'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId:'2',
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
        CaseId:'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId:'2',
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
        CaseId:'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId:'2',
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
        CaseId:'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId:'2',
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
        CaseId:'B7A89F10-50B8-4D0A-8789-FFD108DDCA96',
        ClientId:'2',
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

  loadCaseBySearchText(text : string) {
      return this.http.get<ClientCase[]>(
        `${this.configurationProvider.appSettings.caseApiUrl}`+
        `/case-management/clients/SearchText=${text}`
      );   
  
  }

  loadCasesForAuthuser(): Observable<Case[]> {
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

  loadRecentCases(): Observable<Case[]> {
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

  loadLastVisitedCases() {
    return of([
      {
        name: 'Donna 1',
        id: '1',
        programId: '1',
        isApplicationComplete: true,
      },
      {
        name: 'David 2',
        id: '2',
        programId: '1',
        isApplicationComplete: true,
      },
      {
        name: 'Philip 3',
        id: '3',
        programId: '2',
        isApplicationComplete: true,
      },
      { name: 'Mike Flex1', id: '4', programId: '1', isApplicationComplete: true },
      { name: 'Mike Flex2', id: '5', programId: '2', isApplicationComplete: true },
      { name: 'Mike Flex3', id: '6', programId: '1', isApplicationComplete: true },
      { name: 'Mike Flex4', id: '7', programId: '2', isApplicationComplete: true },
      { name: 'Mike Flex5', id: '8', programId: '1', isApplicationComplete: true },
    ]);
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


    loadCasesById(clientCaseId : string) {
      return this.http.get<ClientCase[]>(
        `${this.configurationProvider.appSettings.caseApiUrl}`+
        `/case-management/clients/cases/${clientCaseId}`
      );
    }


  loadDdlPrograms() {

    return this.http.get<Program[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
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
  updateCaseStatus(caseData: any,clientCaseId:any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/cases/${clientCaseId}/status`,caseData
    );
  }
  loadCasesStatusById(clientCaseId : string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/clients/cases/${clientCaseId}/status`
    );
  }
	getSessionInfoByCaseId(clientCaseId:any){
  return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/cases/${clientCaseId}/SessionSearch`);
  }
}
