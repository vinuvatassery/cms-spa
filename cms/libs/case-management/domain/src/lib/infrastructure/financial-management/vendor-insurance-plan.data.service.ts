/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class VendorInsurancePlanDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/

 
  loadVendorInsurancePlanListService() {
    return of([
      {
        InsuranceVendor: 'Aetna',
        InsuranceProvider:'Aetna', 
        InsurancePlanName: 'Standard Silver Plan',
        HealthInsuranceType: 'Qualifed Health Plan',
        Canpayformeds: 'No',
        Dentalplan: 'No',
        StartDate: 'xx/xx/xxxx',
        TermDate: 'xx/xx/xxxx', 
      },
    ]);
  }

}
