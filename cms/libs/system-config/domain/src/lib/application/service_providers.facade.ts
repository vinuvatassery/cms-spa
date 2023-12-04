/** Angular **/
import { Injectable } from '@angular/core';
import {
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

@Injectable({ providedIn: 'root' })
export class SystemConfigServiceProviderFacade {
  private loadManufacturerListsServiceSubject = new BehaviorSubject<any>([]);
  loadManufacturerListsService$ =  this.loadManufacturerListsServiceSubject.asObservable();

  private loadDrugsListsServiceSubject = new BehaviorSubject<any>([]);
  loadDrugsListsService$ = this.loadDrugsListsServiceSubject.asObservable();

  private loadMedicalProvidersListsServiceSubject = new BehaviorSubject<any>(  [] );
  loadMedicalProvidersListsService$ =  this.loadMedicalProvidersListsServiceSubject.asObservable();

  private loadCptCodeListsServiceSubject = new BehaviorSubject<any>([]);
  loadCptCodeListsService$ = this.loadCptCodeListsServiceSubject.asObservable();

  private loadInsuranceVendorListsServiceSubject = new BehaviorSubject<any>([]);
  loadInsuranceVendorListsService$ = this.loadInsuranceVendorListsServiceSubject.asObservable();

  private loadInsuranceProvidersListsServiceSubject = new BehaviorSubject<any>([]);
  loadInsuranceProvidersListsService$ = this.loadInsuranceProvidersListsServiceSubject.asObservable();

  private loadInsurancePlansListsServiceSubject = new BehaviorSubject<any>([]);
  loadInsurancePlansListsService$ = this.loadInsurancePlansListsServiceSubject.asObservable();

  private loadPharmaciesListsServiceSubject = new BehaviorSubject<any>([]);
  loadPharmaciesListsService$ = this.loadPharmaciesListsServiceSubject.asObservable();

  private loadHealthCareProvidersListsServiceSubject = new BehaviorSubject<any>([]);
  loadHealthCareProvidersListsService$ = this.loadHealthCareProvidersListsServiceSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly systemConfigServiceProvidersDataService: SystemConfigServiceProvidersDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService
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

  loadInsuranceVendorLists() {
    this.systemConfigServiceProvidersDataService.loadInsuranceVendorListsService().subscribe({
      next: (loadInsuranceVendorListsService) => {
        this.loadInsuranceVendorListsServiceSubject.next(loadInsuranceVendorListsService);
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

  
  loadHealthCareProvidersLists() {
    this.systemConfigServiceProvidersDataService.loadHealthCareProvidersListsService().subscribe({
      next: (loadHealthCareProvidersListsService) => {
        this.loadHealthCareProvidersListsServiceSubject.next(loadHealthCareProvidersListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
}
