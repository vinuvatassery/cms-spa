/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/

import { of } from 'rxjs/internal/observable/of';
/** Data services **/


/** Providers **/
import { ConfigurationProvider, LoaderService } from '@cms/shared/util-core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SystemConfigHousingCoordinationService {
  private getUserProfileData = new BehaviorSubject<any>([]);
  getProfile$ = this.getUserProfileData.asObservable();
  /** Constructor **/
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) {}

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }
  /** Public methods **/
 

  loadClientProfileSlots() {
    return of([
      {
        fund: 'Formula',
        slotPerFund: '35',
        currentlyAssigned: '30',
        availableSlots: '5',
        lastModified: 'MM/DD/YYYY',
      },
      {
        fund: 'Session',
        slotPerFund: '30',
        currentlyAssigned: '30',
        availableSlots: '0',
        lastModified: 'MM/DD/YYYY',
      },
      {
        fund: 'Formula 1',
        slotPerFund: '40',
        currentlyAssigned: '30',
        availableSlots: '10',
        lastModified: 'MM/DD/YYYY',
      },
      {
        fund: 'Formula 2',
        slotPerFund: '55',
        currentlyAssigned: '40',
        availableSlots: '15',
        lastModified: 'MM/DD/YYYY',
      },
    ]);
  }

  loadClientProfileCaseAvailabilities() {
    return of([
      {
        userName: 'David Miller',
        caseAvailability: '15',
        currentCaseLoad: '10',
        lastModified: 'MM/DD/YYYY',
      },
      {
        userName: 'Miller John',
        caseAvailability: '10',
        currentCaseLoad: '10',
        lastModified: 'MM/DD/YYYY',
      },
      {
        userName: 'Clara Drill',
        caseAvailability: '15',
        currentCaseLoad: '10',
        lastModified: 'MM/DD/YYYY',
      },
    ]);
  }

  loadPeriods() {
    return of([
      {
        lifetimePeriod: '48 months',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem data comments in lorem ipsum',
        lastModified: 'MM/DD/YYYY',
      },
      {
        lifetimePeriod: '33 months',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem data comments in lorem ipsum',
        lastModified: 'MM/DD/YYYY',
      },
      {
        lifetimePeriod: '44 months',
        effectiveDate: 'MM/DD/YYYY',
        comments: 'Lorem data comments in lorem ipsum',
        lastModified: 'MM/DD/YYYY',
      },
    ]);
  }
 
  loadHousingAcuityLevelList() {
    return of([
      {
        acuitylevel: '2',
        order: '1',
        suitation: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        acuitylevel: '2',
        order: '1',
        suitation: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        acuitylevel: '2',
        order: '1',
        suitation: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        acuitylevel: '2',
        order: '1',
        suitation: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
      {
        acuitylevel: '2',
        order: '1',
        suitation: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
        status: 'Active',
      },
    ]);
  }
  loadIncomeInclusionsExlusionsList() {
    return of([
      {
        inclusions: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
      },
      {
        inclusions: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
      },
      {
        inclusions: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
      },
      {
        inclusions: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
      },
      {
        inclusions: 'Formerly Individual family',
        lastModified: 'XX/XX/XXXX',
      },
    ]);
  }
  loadRegionAssignmentList() {
    return of([
      {
        region: 'Region1',
        assignto: 'Ethan Endrson',
        countries: 'Baker, Grant , Union,Umatilla',
        lastmodified: 'XX/XX/XXXX',
      },

      {
        region: 'Region2',
        assignto: 'Sophia Brown',
        countries: 'Harney, Lake , Malehur,Polk',
        lastmodified: 'XX/XX/XXXX',
      },
      {
        region: 'Region3',
        assignto: 'Noah Davis',
        countries: 'Coos , Curry , Douglas,Jackson',
        lastmodified: 'XX/XX/XXXX',
      },
      {
        region: 'Region4',
        assignto: 'Ava Johnson',
        countries: 'Crook, Deschutes , Lane,Wheeler',
        lastmodified: 'XX/XX/XXXX',
      },
      {
        region: 'Region5',
        assignto: 'Sophia Jhons',
        countries: 'Benton, Morrow , Sherman,clatsop',
        lastmodified: 'XX/XX/XXXX',
      },
    ]);
  }
  loadPSMFRZIPList() {
    return of([
      {
        year: '2020',
        county: 'Benton',
        housingtype: '0-Studio',
        psmfrzip: 'FMR',
        amount: '869.00',
        lastModified: 'XX/XX/XXXX',
        status: 'status',
      },
      {
        year: '2020',
        county: 'Benton',
        housingtype: '0-Studio',
        psmfrzip: 'Payment Standard',
        amount: '785.00',
        lastModified: 'XX/XX/XXXX',
        status: 'status',
      },
      {
        year: '2020',
        county: 'Benton',
        housingtype: '0-Studio',
        psmfrzip: 'ZIP Code',
        amount: '785.00',
        lastModified: 'XX/XX/XXXX',
        status: 'status',
      },
      {
        year: '2020',
        county: 'Benton',
        housingtype: '0-Studio',
        psmfrzip: 'ZIP Code',
        amount: '785.00',
        lastModified: 'XX/XX/XXXX',
        status: 'status',
      },
    ]);
  }
  loadServiceProviderList() {
    return of([
      {
        serviceprovidername: '2020',
        type: 'Benton',
        vendorid: '0-Studio',
        mailcode: 'FMR',
        accountno: '869.00',
        phoneno: 'Benton',
        address: '0-Studio',
        emailid: 'FMR',
        contactperson: '869.00',
        combinedpayments: '0-Studio',
        nameoncheck: 'FMR',
        comments: '869.00',
        lastModified: 'XX/XX/XXXX',
      },
    ]);
  }
 
 
}