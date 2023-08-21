/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class FinancialFundingSourceDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}
 

 
  // loadFinancialFundingSourceFacadeListService( ) {
  //   return of([
  //     {
  //       id:1,
  //       fundingSource: 'Address `',
  //       fundingName:'address2', 
  //       isActive: false,
  //     },
  //     {
  //       id:1,
  //       fundingSource: 'Address `',
  //       fundingName:'address2', 
  //       isActive: true,
  //     },
  //   ]);
  // }
  loadFinancialFundingSourceFacadeListService(){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/funding-source/`
    );
  }
  }
