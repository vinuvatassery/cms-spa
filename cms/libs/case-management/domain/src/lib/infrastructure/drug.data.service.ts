/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';

@Injectable({ providedIn: 'root' })
export class DrugDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadDdlPriorities() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadPharmacies() {
    return of([
      {
        id: '690',
        name: 'John Ade',
        address: '455 LARKSPUR DR APT 23 BAVIERA CA  92908‑4601',
      },
      {
        id: '890',
        name: 'Rat Bite',
        address: '455 LARKSPUR DR APT 23 BAVIERA CA  92908‑4601',
      },
      {
        id: '167',
        name: 'DLL Hist',
        address: '456 LARKSPUR DR APT 23 BAVIERA CA  92908‑4601',
      },
      {
        id: '891',
        name: 'Clar Medi',
        address: '457 LARKSPUR DR APT 23 BAVIERA CA  92908‑4601',
      },
      {
        id: '129',
        name: 'Mike Flex',
        address: '458 LARKSPUR DR APT 23 BAVIERA CA  92908‑4601',
      },
    ]);
  }

  loadDdlStates() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadClientPharmacies() {
    return of([
      {
        PharmacyName: 'John Ade ',
        PharmcayId: 690,
        City: 'Beaverton',
        State: 'OR',
        Priority: 'Primary',
        Phone: '(415) 555-2671',
        ContactName: 'Deal Dhilip',
      },
    ]);
  }
}
