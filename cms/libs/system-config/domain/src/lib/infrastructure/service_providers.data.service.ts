/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Data services **/
import { User } from '../entities/user';
import { LoginUser } from '../entities/login-user';

/** Providers **/
import { ConfigurationProvider, LoaderService } from '@cms/shared/util-core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SystemConfigServiceProvidersDataService {
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

  loadManufacturerListsService() {
    return of([
      {
        id: 1,
        manufacturerName: 'A Manufacturer',
        tin: 'XXX-XX-XXXX',
        mailCode: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
      },
      {
        id: 2,
        manufacturerName: 'A Manufacturer',
        tin: 'XXX-XX-XXXX',
        mailCode: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
      },
      {
        id: 3,
        manufacturerName: 'A Manufacturer',
        tin: 'XXX-XX-XXXX',
        mailCode: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
      },
    ]);
  }
  loadDrugsListsService() {
    return of([
      {
        id: 1,
        drugName: 'A drugName 1',
        brandName: 'A brandName 1',
        ndc: 'XXXXXXX',
        manufacturer: 'A manufacturer',
        deliveryMethod: 'Tablet',
        includedInRebates: 'Yes',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
      {
        id: 2,
        drugName: 'A drugName 1',
        brandName: 'A brandName 1',
        ndc: 'XXXXXXX',
        manufacturer: 'A manufacturer',
        deliveryMethod: 'Tablet',
        includedInRebates: 'Yes',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',

      },
      {
        id: 3,
        drugName: 'A drugName 1',
        brandName: 'A brandName 1',
        ndc: 'XXXXXXX',
        manufacturer: 'A manufacturer',
        deliveryMethod: 'Tablet',
        includedInRebates: 'Yes',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
    ]);
  }
  loadMedicalProvidersListsService() {
    return of([
      {
        id: 1,
        medicalProviderName: 'A medicalProviderName',
        tin: 'XXX-XX-XXXX',
        mailCode: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
      {
        id: 2,
        medicalProviderName: 'A Manufacturer',
        tin: 'XXX-XX-XXXX',
        mailCode: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',

      },
      {
        id: 3,
        medicalProviderName: 'A Manufacturer',
        tin: 'XXX-XX-XXXX',
        mailCode: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active', 
      },
    ]);
  }
  loadCptCodeListsService() {
    return of([
      {
        id: 1,
        cptCode: 'XXXXXXXXXX',
        serviceDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit icus',
        medicaidRate: 'XXX.00',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
      {
        id: 2,
        cptCode: 'XXXXXXXXXX',
        serviceDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit icus',
        medicaidRate: 'XXX.00',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',

      },
      {
        id: 3,
        cptCode: 'XXXXXXXXXX',
        serviceDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit icus',
        medicaidRate: 'XXX.00',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
    ]);
  }
  loadInsuranceVendorsListsService() {
    return of([
      {
        id: 1,
        insuranceVendorName: 'A insuranceVendorName 1',
        tin: 'XXXXXXXX',
        pmtMethod: 'Check',
        runDate: 'MM/DD/YYYY',
        mailCode: 'XXXXXXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
      {
        id: 2,
        insuranceVendorName: 'A insuranceVendorName 1',
        tin: 'XXXXXXXX',
        pmtMethod: 'Check',
        runDate: 'MM/DD/YYYY',
        mailCode: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',

      },
      {
        id: 3,
        insuranceVendorName: 'A insuranceVendorName 1',
        tin: 'XXXXXXXX',
        pmtMethod: 'Check',
        runDate: 'MM/DD/YYYY',
        mailCode: 'XXXXXXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
    ]);
  }
  loadInsuranceProvidersListsService() {
    return of([
      {
        id: 1,
        insuranceProviderName: 'A insuranceProviderName 1',
        insPlanCount: 'XXXXXXXX', 
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
      {
        id: 2, 
        insuranceProviderName: 'A insuranceProviderName 1',
        insPlanCount: 'XXXXXXXX', 
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',

      },
      {
        id: 3, 
        insuranceProviderName: 'A insuranceProviderName 1',
        insPlanCount: 'XXXXXXXX', 
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
    ]);
  }
  loadInsurancePlansListsService() {
    return of([
      {
        id: 1,
        insuranceProviderName: 'A insuranceProviderName 1',
        insurancePlanName: 'A insurancePlanName 1',
        healthInsuranceType: 'A healthInsuranceType 1',
        canPayForMeds: 'Yed',
        dentalPlan: 'A dentalPlan 1',
        startDate: 'MM/DD/YYYY',
        termDate: 'MM/DD/YYYY', 
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
      {
        id: 2, 
        insuranceProviderName: 'A insuranceProviderName 1',
        insurancePlanName: 'A insurancePlanName 1',
        healthInsuranceType: 'A healthInsuranceType 1',
        canPayForMeds: 'Yed',
        dentalPlan: 'A dentalPlan 1',
        startDate: 'MM/DD/YYYY',
        termDate: 'MM/DD/YYYY', 
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',

      },
      {
        id: 3, 
        insuranceProviderName: 'A insuranceProviderName 1',
        insurancePlanName: 'A insurancePlanName 1',
        healthInsuranceType: 'A healthInsuranceType 1',
        canPayForMeds: 'Yed',
        dentalPlan: 'A dentalPlan 1',
        startDate: 'MM/DD/YYYY',
        termDate: 'MM/DD/YYYY', 
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
    ]);
  }
  loadPharmaciesListsService() {
    return of([
      {
        id: 1,
        pharmacyName: 'A pharmacyName 1',
        tin: 'XXX-XX-XXXX',
        nabp: 'XXX, XXX, XXXX',
        ncpdp: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
      {
        id: 2,
        pharmacyName: 'A pharmacyName 1',
        tin: 'XXX-XX-XXXX',
        nabp: 'XXX, XXX, XXXX',
        ncpdp: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',

      },
      {
        id: 3,
        pharmacyName: 'A pharmacyName 1',
        tin: 'XXX-XX-XXXX',
        nabp: 'XXX, XXX, XXXX',
        ncpdp: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
    ]);
  }
  loadHealthCareProvidersListsService() {
    return of([
      {
        id: 1,
        clinicName: 'A pharmacyName 1',
        providerName: 'A pharmacyName 1',
        address: 'A pharmacyName 1',
        tin: 'XXX-XX-XXXX',
        nabp: 'XXX, XXX, XXXX',
        ncpdp: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
      {
        id: 2,
        pharmacyName: 'A pharmacyName 1',
        tin: 'XXX-XX-XXXX',
        nabp: 'XXX, XXX, XXXX',
        ncpdp: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',

      },
      {
        id: 3,
        pharmacyName: 'A pharmacyName 1',
        tin: 'XXX-XX-XXXX',
        nabp: 'XXX, XXX, XXXX',
        ncpdp: 'XXX, XXX, XXXX',
        lastModified: 'MM/DD/YYYY',
        modifiedBy: 'LS',
        status: 'Active',
      },
    ]);
  }
}
