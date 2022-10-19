/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';

@Injectable({ providedIn: 'root' })
export class HealthcareProviderDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadHealthCareProviders() {
    return of([
      {
        ClinicName: 'John Ade',
        ProviderName: 'Beaverton Provider',
        ProviderPhone: '(415) 555-2671',
        ProviderAddress: '980 ADAMS DR APT 02 FRANKLIN DA 98760-8797',
      },
      {
        ClinicName: 'Para Ade',
        ProviderName: 'Provider Beaverton',
        ProviderPhone: '(415) 555-2671',
        ProviderAddress: '980 ADAMS DR APT 02 FRANKLIN DA 98760-8797',
      },
      {
        ClinicName: 'John Ade',
        ProviderName: 'Jat Provider',
        ProviderPhone: '(415) 555-2671',
        ProviderAddress: '980 ADAMS DR APT 02 FRANKLIN DA 98760-8797',
      },
      {
        ClinicName: 'Jet Lee',
        ProviderName: 'Beaverton Provider',
        ProviderPhone: '(415) 555-2671',
        ProviderAddress: '980 ADAMS DR APT 02 FRANKLIN DA 98760-8797',
      },
      {
        ClinicName: 'John Ali',
        ProviderName: 'Beaverton Provider',
        ProviderPhone: '(415) 555-2671',
        ProviderAddress: '980 ADAMS DR APT 02 FRANKLIN DA 98760-8797',
      },
    ]);
  }

  loadDdlStates() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }
}
