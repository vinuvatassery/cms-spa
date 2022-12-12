/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';



@Injectable({ providedIn: 'root' })
export class IncomeDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient, private readonly configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  deleteIncome(clientIncomeId:any){

    return this.http.delete(

      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-incomes/clientIncomeId=${clientIncomeId}`,);

  }
    
}
