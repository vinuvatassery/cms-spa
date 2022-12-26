/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { PharmacyPriority } from '../entities/pharmacy-priority';

@Injectable({ providedIn: 'root' })
export class DrugDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,private readonly configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  loadDdlPriorities() {
    return of([{text:'Primary',value:'P'}, {text:'Secondary',value:'S'},{text:'Tertiary',value:'T'}]);
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
  loadtPharmacies() {
    return of([
      {
        id: 1,
        PharmacyName: 'John Ade ',
        TIN: 6963,
        Phone: '(415) 555-2671',
        Fax: '(415) 555-2671',
        MailCodes: 42132,
        Address: '1 Main St Tigard, OR 91204',
        NABP: 'XXXXX',
        NCPDP: 'XXXXX',
        EffectiveDate: '20-12-2022',
        by: 'Rajesh',
      },
      {
        id: 2,
        PharmacyName: 'John Ade ',
        TIN: 6963,
        Phone: '(415) 555-2671',
        Fax: '(415) 555-2671',
        MailCodes: 42132,
        Address: '1 Main St Tigard, OR 91204',
        NABP: 'XXXXX',
        NCPDP: 'XXXXX',
        EffectiveDate: '20-12-2022',
        by: 'Rajesh',
      },
      {
        id: 3,
        PharmacyName: 'John Ade ',
        TIN: 6963,
        Phone: '(415) 555-2671',
        Fax: '(415) 555-2671',
        MailCodes: 42132,
        Address: '1 Main St Tigard, OR 91204',
        NABP: 'XXXXX',
        NCPDP: 'XXXXX',
        EffectiveDate: '20-12-2022',
        by: 'Rajesh',
      },
      {
        id: 3,
        PharmacyName: 'John Ade ',
        TIN: 6963,
        Phone: '(415) 555-2671',
        Fax: '(415) 555-2671',
        MailCodes: 42132,
        Address: '1 Main St Tigard, OR 91204',
        NABP: 'XXXXX',
        NCPDP: 'XXXXX',
        EffectiveDate: '20-12-2022',
        by: 'Rajesh',
      },
    ]);
  }

  loadDrugsPurchased() {
    return of([
      {
        id: 1,
        FillDate: '20-5-2022 ',
        PharmacyName: 'John Ade ',
        Drug: "Lorem ipsum dolor set",
        NDC: 'NDC',
        Qty: 20,
        RevDate : '20-5-2022',
        ClientGroup: 'GROUP I',
        PayType: 'Pay Type',
        TransType: 'Pay Type',
        PayAmt: '$ 99292',
        IngrdCost: '$ 99292',
        PhmFee: '$ 99292',
        TotalDrug: '$ 99292',
        PBMFee: '$ 99292',
        Revenue: '$ 99292',
        UC: '$ 99292',
        EntryDate: '20-5-2022',
      },
      {
        id: 2,
        FillDate: '20-5-2022 ',
        PharmacyName: 'John Ade ',
        Drug: "Lorem ipsum dolor set",
        NDC: 'NDC',
        Qty: 20,
        RevDate : '20-5-2022',
        ClientGroup: 'GROUP I',
        PayType: 'Pay Type',
        TransType: 'Pay Type',
        PayAmt: '$ 99292',
        IngrdCost: '$ 99292',
        PhmFee: '$ 99292',
        TotalDrug: '$ 99292',
        PBMFee: '$ 99292',
        Revenue: '$ 99292',
        UC: '$ 99292',
        EntryDate: '20-5-2022',
      },
      {
        id: 3,
        FillDate: '20-5-2022 ',
        PharmacyName: 'John Ade ',
        Drug: "Lorem ipsum dolor set",
        NDC: 'NDC',
        Qty: 20,
        RevDate : '20-5-2022',
        ClientGroup: 'GROUP I',
        PayType: 'Pay Type',
        TransType: 'Pay Type',
        PayAmt: '$ 99292',
        IngrdCost: '$ 99292',
        PhmFee: '$ 99292',
        TotalDrug: '$ 99292',
        PBMFee: '$ 99292',
        Revenue: '$ 99292',
        UC: '$ 99292',
        EntryDate: '20-5-2022',
      },
      {
        id: 4,
        FillDate: '20-5-2022 ',
        PharmacyName: 'John Ade ',
        Drug: "Lorem ipsum dolor set",
        NDC: 'NDC',
        Qty: 20,
        RevDate : '20-5-2022',
        ClientGroup: 'GROUP I',
        PayType: 'Pay Type',
        TransType: 'Pay Type',
        PayAmt: '$ 99292',
        IngrdCost: '$ 99292',
        PhmFee: '$ 99292',
        TotalDrug: '$ 99292',
        PBMFee: '$ 99292',
        Revenue: '$ 99292',
        UC: '$ 99292',
        EntryDate: '20-5-2022',
      },
    ]);
  }
  savePharmacyPriorityService(pharmacyPriority: any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/case-management/pharmacy-priority/save-pharmacy`, pharmacyPriority
    );
  }
  loadPharmacyPriority(clientId:any){
    return this.http.get<PharmacyPriority>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/pharmacy-priority?clientId=${clientId}`);
  }
}
