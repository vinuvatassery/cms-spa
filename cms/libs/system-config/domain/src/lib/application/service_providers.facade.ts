/** Angular **/
import { Injectable } from '@angular/core';
import {
  ConfigurationProvider,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { Subject, first, Observable } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
/** Data services **/
import { SystemConfigServiceProvidersDataService } from '../infrastructure/service_providers.data.service';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class SystemConfigServiceProviderFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueCptCode = 'creationTime'; 
  public sortCptCodeGrid: SortDescriptor[] = [{
    field: this.sortValueCptCode,
  }];

  public sortValueManufacturer = 'creationTime'; 
  public sortManufacturerGrid: SortDescriptor[] = [{
    field: this.sortValueManufacturer,
  }];

  public sortValueDrugs = 'creationTime'; 
  public sortDrugsGrid: SortDescriptor[] = [{
    field: this.sortValueDrugs,
  }];

  public sortValueMedicalProvider = 'creationTime'; 
  public sortMedicalProviderGrid: SortDescriptor[] = [{
    field: this.sortValueMedicalProvider,
  }];

  public sortValueInsProviders = 'creationTime'; 
  public sortInsProvidersGrid: SortDescriptor[] = [{
    field: this.sortValueInsProviders,
  }];

  public sortValueInsVendors = 'creationTime'; 
  public sortInsVendorsGrid: SortDescriptor[] = [{
    field: this.sortValueInsVendors,
  }];

  public sortValueInsurancePlans = 'creationTime'; 
  public sortInsurancePlansGrid: SortDescriptor[] = [{
    field: this.sortValueInsurancePlans,
  }];

  public sortValuePharmacies = 'creationTime'; 
  public sortPharmaciesGrid: SortDescriptor[] = [{
    field: this.sortValuePharmacies,
  }];

  public sortValueHealthcareProvider = 'creationTime'; 
  public sortHealthcareProviderGrid: SortDescriptor[] = [{
    field: this.sortValueHealthcareProvider,
  }];


  private loadManufacturerListsServiceSubject = new BehaviorSubject<any>([]);
  loadManufacturerListsService$ =  this.loadManufacturerListsServiceSubject.asObservable();

  private loadDrugsListsServiceSubject = new BehaviorSubject<any>([]);
  loadDrugsListsService$ = this.loadDrugsListsServiceSubject.asObservable();

  private loadMedicalProvidersListsServiceSubject = new BehaviorSubject<any>(  [] );
  loadMedicalProvidersListsService$ =  this.loadMedicalProvidersListsServiceSubject.asObservable();

  private loadCptCodeListsServiceSubject = new BehaviorSubject<any>([]);
  loadCptCodeListsService$ = this.loadCptCodeListsServiceSubject.asObservable();

  private loadInsuranceVendorsListsServiceSubject = new BehaviorSubject<any>([]);
  loadInsuranceVendorsListsService$ = this.loadInsuranceVendorsListsServiceSubject.asObservable();

  private loadInsuranceProvidersListsServiceSubject = new BehaviorSubject<any>([]);
  loadInsuranceProvidersListsService$ = this.loadInsuranceProvidersListsServiceSubject.asObservable();

  private loadInsurancePlansListsServiceSubject = new BehaviorSubject<any>([]);
  loadInsurancePlansListsService$ = this.loadInsurancePlansListsServiceSubject.asObservable();

  private loadPharmaciesListsServiceSubject = new BehaviorSubject<any>([]);
  loadPharmaciesListsService$ = this.loadPharmaciesListsServiceSubject.asObservable();

  private loadHealthcareProvidersListsServiceSubject = new BehaviorSubject<any>([]);
  loadHealthcareProvidersListsService$ = this.loadHealthcareProvidersListsServiceSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly systemConfigServiceProvidersDataService: SystemConfigServiceProvidersDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly configurationProvider: ConfigurationProvider
  ) {}

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  loadManufacturerLists() {
    this.systemConfigServiceProvidersDataService.loadManufacturerListsService().subscribe({
      next: (loadPcaCodeListsService) => {
        this.loadManufacturerListsServiceSubject.next(loadPcaCodeListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadDrugsLists() {
    this.systemConfigServiceProvidersDataService.loadDrugsListsService().subscribe({
      next: (loadDrugsListsService) => {
        this.loadDrugsListsServiceSubject.next(loadDrugsListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }


  loadMedicalProvidersLists() {
    this.systemConfigServiceProvidersDataService.loadMedicalProvidersListsService().subscribe({
      next: (loadMedicalProvidersListsService) => {
        this.loadMedicalProvidersListsServiceSubject.next(loadMedicalProvidersListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadCptCodeLists() {
    this.systemConfigServiceProvidersDataService.loadCptCodeListsService().subscribe({
      next: (loadCptCodeListsService) => {
        this.loadCptCodeListsServiceSubject.next(loadCptCodeListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadInsuranceVendorsLists() {
    this.systemConfigServiceProvidersDataService.loadInsuranceVendorsListsService().subscribe({
      next: (loadInsuranceVendorsListsService) => {
        this.loadInsuranceVendorsListsServiceSubject.next(loadInsuranceVendorsListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadInsuranceProvidersLists() {
    this.systemConfigServiceProvidersDataService.loadInsuranceProvidersListsService().subscribe({
      next: (loadInsuranceProvidersListsService) => {
        this.loadInsuranceProvidersListsServiceSubject.next(loadInsuranceProvidersListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadInsurancePlansLists() {
    this.systemConfigServiceProvidersDataService.loadInsurancePlansListsService().subscribe({
      next: (loadInsurancePlansListsService) => {
        this.loadInsurancePlansListsServiceSubject.next(loadInsurancePlansListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadPharmaciesLists() {
    this.systemConfigServiceProvidersDataService.loadPharmaciesListsService().subscribe({
      next: (loadPharmaciesListsService) => {
        this.loadPharmaciesListsServiceSubject.next(loadPharmaciesListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  
  loadHealthcareProvidersLists() {
    this.systemConfigServiceProvidersDataService.loadHealthcareProvidersListsService().subscribe({
      next: (loadHealthcareProvidersListsService) => {
        this.loadHealthcareProvidersListsServiceSubject.next(loadHealthcareProvidersListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
}
