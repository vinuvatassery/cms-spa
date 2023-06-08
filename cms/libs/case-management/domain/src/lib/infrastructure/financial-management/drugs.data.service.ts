/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class DrugsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/

 
  loadDrugsListService() {
    return of([
      {
        NDC: 'XXXXXXXXXX `',
        brandName:'Very Nice Brand Name', 
        drugName: 'Drug Name',
        deliveryMethod: 'Tablet',
        includedInRebates: 'Yes',
        hivDrugs: 'Yes',
        hepDrugs: 'No',
        oiDrugs: 'No',
      },
    ]);
  }

}
