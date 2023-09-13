/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class ProviderDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider
  ) {}

  /** Public methods **/

  loadLabResults(
    labResultTypeCode: string,
    clientId: number,  
    skip: any,
    pageSize: any,
    sortBy: any,
    sortType: any,
    historychkBoxChecked : boolean
  ) {
    return this.http.get(
      `${this.configurationProvider.appSettings.sysInterfaceApiUrl}/system-interface/surveillance/clients/${clientId}/lab-results/?labResultTypeCode=${labResultTypeCode}&yearlyFilter=${historychkBoxChecked}&SkipCount=${skip}&MaxResultCount=${pageSize}&Sorting=${sortBy}&SortType=${sortType}`
    );
  }

  loadManagers() {
    return of([
      {
        CaseManagerName: 'John Ade',
        CaseManagerPhoneNumber: '(415) 555-2671',
        Domain: 'Deschutes County Human Services',
        AssisterGroup: 'EOCIL (EOCIL)',
        EffectiveDate: '12-2-2022',
        AssigningCaseManager: 'FName LName',
        by: 'FName LName',
      },
      {
        CaseManagerName: 'David Miller',
        CaseManagerPhoneNumber: '(415) 555-2671',
        Domain: 'Deschutes County Human Services',
        AssisterGroup: 'EOCIL (EOCIL)',
        EffectiveDate: '12-2-2022',
        AssigningCaseManager: 'FName LName',
        by: 'FName LName',
      },
      {
        CaseManagerName: 'Doe Phil',
        CaseManagerPhoneNumber: '(415) 555-2671',
        Domain: 'Deschutes County Human Services',
        AssisterGroup: 'EOCIL (EOCIL)',
        EffectiveDate: '12-2-2022',
        AssigningCaseManager: 'FName LName',
        by: 'FName LName',
      },
    ]);
  }

  loadDdlStates() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadProvidersGrid() {
    return of([
      {
        ClinicName: 'John Ade',
        ProviderName: 'Beaverton Provider',
        ProviderPhone: '(415) 555-2671',
        ProviderAddress: '980 ADAMS DR APT 02 FRANKLIN DA 98760-8797',
        Fax: '(415) 555-2671',
        EffectiveDate: '12-27-2022',
        By: 'Rajesh',
      },
      {
        ClinicName: 'Para Ade',
        ProviderName: 'Provider Beaverton',
        ProviderPhone: '(415) 555-2671',
        ProviderAddress: '980 ADAMS DR APT 02 FRANKLIN DA 98760-8797',
        Fax: '(415) 555-2671',
        EffectiveDate: '12-27-2022',
        By: 'Rajesh',
      },
      {
        ClinicName: 'John Ade',
        ProviderName: 'Jat Provider',
        ProviderPhone: '(415) 555-2671',
        ProviderAddress: '980 ADAMS DR APT 02 FRANKLIN DA 98760-8797',
        Fax: '(415) 555-2671',
        EffectiveDate: '12-27-2022',
        By: 'Rajesh',
      },
      {
        ClinicName: 'Jet Lee',
        ProviderName: 'Beaverton Provider',
        ProviderPhone: '(415) 555-2671',
        ProviderAddress: '980 ADAMS DR APT 02 FRANKLIN DA 98760-8797',
        Fax: '(415) 555-2671',
        EffectiveDate: '12-27-2022',
        By: 'Rajesh',
      },
      {
        ClinicName: 'John Ali',
        ProviderName: 'Beaverton Provider',
        ProviderPhone: '(415) 555-2671',
        ProviderAddress: '980 ADAMS DR APT 02 FRANKLIN DA 98760-8797',
        Fax: '(415) 555-2671',
        EffectiveDate: '12-27-2022',
        By: 'Rajesh',
      },
    ]);
  }
  loadCd4Count() {
    return of([
      {
        id: 1,
        Result: 'John Ade',
        DateofTest: 'Beaverton Provider',
        EntryDate: '12-27-2022',
      },
      {
        id: 2,
        Result: 'John Ade',
        DateofTest: 'Beaverton Provider',
        EntryDate: '12-27-2022',
      },
      {
        id: 3,
        Result: 'John Ade',
        DateofTest: 'Beaverton Provider',
        EntryDate: '12-27-2022',
      },
      {
        id: 4,
        Result: 'John Ade',
        DateofTest: 'Beaverton Provider',
        EntryDate: '12-27-2022',
      },
    ]);
  }

  searchProvider(searchText: string) {
    return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/search/${searchText}`);

  }
}
