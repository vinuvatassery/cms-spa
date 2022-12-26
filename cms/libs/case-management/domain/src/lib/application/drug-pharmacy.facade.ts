/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Data services **/
import { DrugDataService } from '../infrastructure/drug.data.service';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class DrugPharmacyFacade {
  ShowHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {      
    debugger;  
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.HideLoader();   
  }

  HideLoader()
  {
    this.loaderService.hide();
  }
  /** Private properties **/
  private pharmaciesSubject = new BehaviorSubject<any>([]);
  private clientPharmaciesSubject = new BehaviorSubject<any>([]);
  private ddlPrioritiesSubject = new BehaviorSubject<any>([]);
  private ddlStatesSubject = new BehaviorSubject<any>([]);
  private pharmaciesListSubject = new BehaviorSubject<any>([]);
  private drugsPurchasedSubject = new BehaviorSubject<any>([]);
  
  /** Public properties **/
  pharmacies$ = this.pharmaciesSubject.asObservable();
  clientPharmacies$ = this.clientPharmaciesSubject.asObservable();
  pharmaciesList$ = this.pharmaciesListSubject.asObservable();
  drugsPurchased$ = this.drugsPurchasedSubject.asObservable();
  ddlPriorities$ = this.ddlPrioritiesSubject.asObservable();
  ddlStates$ = this.ddlStatesSubject.asObservable();
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
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private configurationProvider : ConfigurationProvider,
    private readonly loaderService: LoaderService) {}

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
 
  loadDdlPriorities(): void {
    this.drugDataService.loadDdlPriorities().subscribe({
      next: (ddlPrioritiesResponse) => {
        this.ddlPrioritiesSubject.next(ddlPrioritiesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  save():Observable<boolean>{
    //TODO: save api call   
    return of(true);
  }
  updatePharmacyPriority(pharmacyPriority: any): Observable<any> {
    return this.drugDataService.savePharmacyPriorityService(pharmacyPriority);
  }
  loadPharmacyPriority(clientId:any) {
    debugger;
    return this.drugDataService.loadPharmacyPriority(clientId);
  }

}
