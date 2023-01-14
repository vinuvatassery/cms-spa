/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Data services **/
import { DrugDataService } from '../infrastructure/drug.data.service';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { PriorityCode } from '../enums/priority-code.enum';
import { ClientPharmacy, Pharmacy } from '../entities/client-pharmacy';

@Injectable({ providedIn: 'root' })
export class DrugPharmacyFacade {
  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {      
    
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.snackbarService.manageSnackBar(type,subtitle)
    this.hideLoader();   
  }

  hideLoader()
  {
    this.loaderService.hide();
  }
  /** Private properties **/
  private pharmaciesSubject = new BehaviorSubject<any>([]);
  private selectedPharmacySubject = new BehaviorSubject<any>([]);
  private clientPharmaciesSubject = new BehaviorSubject<any>([]);
  private ddlPrioritiesSubject = new BehaviorSubject<any>([]);
  private ddlStatesSubject = new BehaviorSubject<any>([]);
  private pharmaciesListSubject = new BehaviorSubject<any>([]);
  private drugsPurchasedSubject = new BehaviorSubject<any>([]);
  private addPharmacyResponseSubject = new BehaviorSubject<boolean>(false);
  private editPharmacyResponseSubject = new BehaviorSubject<boolean>(false);
  private removePharmacyResponseSubject = new BehaviorSubject<boolean>(false);

  /** Public properties **/
  pharmacies$ = this.pharmaciesSubject.asObservable();
  selectedPharmacy$ = this.selectedPharmacySubject.asObservable();
  clientPharmacies$ = this.clientPharmaciesSubject.asObservable();
  pharmaciesList$ = this.pharmaciesListSubject.asObservable();
  drugsPurchased$ = this.drugsPurchasedSubject.asObservable();
  ddlPriorities$ = this.ddlPrioritiesSubject.asObservable();
  ddlStates$ = this.ddlStatesSubject.asObservable();
  addPharmacyResponse$ = this.addPharmacyResponseSubject.asObservable();
  editPharmacyResponse$ = this.editPharmacyResponseSubject.asObservable();
  removePharmacyResponse$ = this.removePharmacyResponseSubject.asObservable();
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = ' '
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc'
  }];
  /** Constructor**/
  constructor(private readonly drugDataService: DrugDataService,
    private loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService) { }

  /** Public methods **/
  loadPharmacies(): void {
    this.drugDataService.loadPharmacies().subscribe({
      next: (pharmaciesResponse) => {
        this.pharmaciesSubject.next(pharmaciesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlStates(): void {
    this.drugDataService.loadDdlStates().subscribe({
      next: (ddlStatesResponse) => {
        this.ddlStatesSubject.next(ddlStatesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadClientPharmacies(): void {
    this.drugDataService.loadClientPharmacies().subscribe({
      next: (clientPharmaciesResponse) => {
        this.clientPharmaciesSubject.next(clientPharmaciesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadClientPharmacyList(clientId: number) {
    this.loaderService.show();
    this.drugDataService.loadClientPharmacyList(clientId).subscribe({
      next: (pharmacies: ClientPharmacy) => {
        this.loaderService.hide();
        this.clientPharmaciesSubject.next(pharmacies);
      },
      error: (err) => {
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  loadPharmacieslist(): void {
    this.drugDataService.loadtPharmacies().subscribe({
      next: (pharmacieslistResponse) => {
        this.pharmaciesListSubject.next(pharmacieslistResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDrugsPurchased(): void {
    this.drugDataService.loadDrugsPurchased().subscribe({
      next: (drugsPurchased) => {
        this.drugsPurchasedSubject.next(drugsPurchased);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  // save(): Observable<boolean> {
  //   //TODO: save api call   
  //   return of(true);
  // }
 updatePharmacyPriority(pharmacyPriority: any): Observable<any> {
    return this.drugDataService.savePharmacyPriorityService(pharmacyPriority);

  }

  searchPharmacies(searchText: string) {
    return this.drugDataService.searchPharmacies(searchText).subscribe({
      next: (response: Pharmacy[]) => {
        response?.forEach(vendor => {
          vendor.vendorFullName = `${vendor.vendorName} #${vendor.vendorNbr} ${vendor.address1} ${vendor.address2} ${vendor.cityCode} ${vendor.stateCode} ${vendor.zip}`;
        });
        this.pharmaciesSubject.next(response);
      },
      error: (err) => {  
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  getPharmacyById(vendorId: string) {
    this.loaderService.show();
    return this.drugDataService.getPharmacyById(vendorId).subscribe({
      next: (response:Pharmacy) => {
        response.vendorFullName = `${response.vendorName} #${response.address1} ${response.address2} ${response.cityCode} ${response.stateCode} ${response.zip}`;
        //this.pharmaciesSubject.next(response);
        this.selectedPharmacySubject.next(response);
        this.loaderService.hide();
      },
      error: (err) => {
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  addClientPharmacy(clientId: number, vendorId: string, priorityCode: PriorityCode) {
    var model = {
      vendorId: vendorId,
      priorityCode: priorityCode
    };
    this.loaderService.show();
    return this.drugDataService.addClientPharmacy(clientId, model).subscribe({
      next: (response) => {
        if (response === true) {
          this.loadClientPharmacyList(clientId);
          this.addPharmacyResponseSubject.next(true);
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Client Pharmacy Added Successfully');
        }
        this.loaderService.hide();
      },
      error: (err) => {
        this.addPharmacyResponseSubject.next(false);
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  editClientPharmacy(clientId: number, clientPharmacyId: string, vendorId?: string, priorityCode?: PriorityCode) {
    var model = {
      vendorId: vendorId,
      priorityCode: priorityCode
    };
    this.loaderService.show();
    return this.drugDataService.editClientPharmacy(clientId, clientPharmacyId, model).subscribe({
      next: (response) => {
        if (response === true) {
          this.loadClientPharmacyList(clientId);
          this.editPharmacyResponseSubject.next(true);
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Client Pharmacy Updated Successfully');
        }
        this.loaderService.hide();
      },
      error: (err) => {
        this.editPharmacyResponseSubject.next(false);
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  removeClientPharmacy(clientId: number, clientPharmacyId: string) {
    this.loaderService.show();
    return this.drugDataService.removeClientPharmacy(clientId, clientPharmacyId).subscribe({
      next: (response) => {
        if (response === true) {
          this.loadClientPharmacyList(clientId);
          this.removePharmacyResponseSubject.next(true);
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Client Pharmacy Removed Successfully');
        }
        this.loaderService.hide();
      },
      error: (err) => {
        this.removePharmacyResponseSubject.next(false);
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }
}
