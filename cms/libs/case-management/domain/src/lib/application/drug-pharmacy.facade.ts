/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Data services **/
import { DrugDataService } from '../infrastructure/drug.data.service';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { ClientPharmacy, Pharmacy} from '../entities/client-pharmacy';
import { UserManagementFacade } from '@cms/system-config/domain';

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
  private drugPurchaseSubject = new BehaviorSubject<any>([]);
  private clientPharmaciesSubject = new BehaviorSubject<any>([]);
  private ddlPrioritiesSubject = new BehaviorSubject<any>([]);
  private ddlStatesSubject = new BehaviorSubject<any>([]);
  private pharmaciesListSubject = new BehaviorSubject<any>([]);
  private drugsPurchasedSubject = new BehaviorSubject<any>([]);
  private addPharmacyResponseSubject = new BehaviorSubject<boolean>(false);
  private editPharmacyResponseSubject = new BehaviorSubject<boolean>(false);
  private removePharmacyResponseSubject = new BehaviorSubject<boolean>(false);
  private removeDrugPharmacyResponseSubject = new BehaviorSubject<boolean>(false);
  private triggerPriorityPopupSubject = new BehaviorSubject<boolean>(false);
  public newAddedPharmacySubject = new BehaviorSubject<boolean>(false);
  private searchLoaderVisibilitySubject = new BehaviorSubject<boolean>(false);
  public durgPharmacyPrioritySubject = new BehaviorSubject<string>("");
  private deActivePharmacySubject = new BehaviorSubject<boolean>(false);
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
  removeDrugPharmacyResponse$ = this.removeDrugPharmacyResponseSubject.asObservable();
  triggerPriorityPopup$ = this.triggerPriorityPopupSubject.asObservable();
  searchLoaderVisibility$ = this.searchLoaderVisibilitySubject.asObservable();
  drugPurchases$ = this.drugPurchaseSubject.asObservable();
  drugPharnacyPriority = this.durgPharmacyPrioritySubject.asObservable();
  deActivePharmacyObs = this.deActivePharmacySubject.asObservable();
  public newAddedPharmacyObs = this.newAddedPharmacySubject.asObservable();
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = ' '
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc'
  }];
  pharmacyPurchaseProfileSubject = new Subject();
  pharmacyProfilePhotoSubject = new Subject();
  /** Constructor**/
  constructor(private readonly drugDataService: DrugDataService,
    private loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly userManagementFacade: UserManagementFacade) { }

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

  loadClientPharmacyList(clientId: number, isTriggerPriorityPopup:boolean = false,isShowHistoricalData:boolean = false) {
    this.loaderService.show();
    this.drugDataService.loadClientPharmacyList(clientId,isShowHistoricalData).subscribe({
      next: (pharmacies: ClientPharmacy[]) => {
        this.loaderService.hide();
        this.clientPharmaciesSubject.next(pharmacies);
        if(isTriggerPriorityPopup === true && pharmacies?.length > 1){
          this.triggerPriorityPopupSubject.next(true);
        }
        this.loadPharmacyDistinctUserIdsAndProfilePhoto(pharmacies);
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
      next: (pharmacieslistResponse: any) => {
        this.pharmaciesListSubject.next(pharmacieslistResponse)
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadPharmacyDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.pharmacyProfilePhotoSubject.next(data);
          }
        },
      });
    }
  } 

  loadDrugsPurchased(): void {
    this.drugDataService.loadDrugsPurchased().subscribe({
      next: (drugsPurchased) => {
        this.drugsPurchasedSubject.next(drugsPurchased);
      },
      error: (err) => {
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

 updatePharmacyPriority(pharmacyPriority: any): Observable<any> {

    return this.drugDataService.savePharmacyPriorityService(pharmacyPriority);
  }
  updateDrugPharamcyPriority(clientId :any,pharmacyPriority: any,isShowHistoricalData?:boolean){
   return new Promise((resolve,reject) =>{
    this.loaderService.show();
    this.drugDataService.savePharmacyPriorityService(pharmacyPriority).subscribe({
     next: (response:any) => {
       this.loaderService.hide();
       this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Client Pharmacy updated Successfully');

       this.loadClientPharmacyList(clientId,false,isShowHistoricalData);
       resolve(true)
     },
     error: (err) => {
       this.loaderService.hide();
       this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
       this.loggingService.logException(err);
       resolve(false);
     },
   });
   })

  }

  searchPharmacies(searchText: string) {
    this.searchLoaderVisibilitySubject.next(true);
    return this.drugDataService.searchPharmacies(searchText).subscribe({
      next: (response: Pharmacy[]) => {
        response?.forEach((vendor:any) => {
          vendor.vendorFullName = `${vendor.vendorName ?? ''} #${vendor.vendorNbr ?? ''} ${vendor.address1 ?? ''} ${vendor.address2 ?? ''} ${vendor.cityCode ?? ''} ${vendor.stateCode ?? ''} ${vendor.zip ?? ''}`;
        });
        this.pharmaciesSubject.next(response);
        this.searchLoaderVisibilitySubject.next(false);
      },
      error: (err) => {
        this.searchLoaderVisibilitySubject.next(false);
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

  addClientPharmacy(clientId: number, vendorId: string, vendorAddressId:string, isShowHistoricalData?:boolean, isReactivate = false) {

    const model = {
      vendorId: vendorId ,
      VendorAddressId:vendorAddressId,
      IsUpdatePriorityCode:false,
      isReactivate: isReactivate
    };

    this.loaderService.show();
    return this.drugDataService.addClientPharmacy(clientId, model).subscribe({
      next: (response) => {
        if (response === true) {

          this.loadClientPharmacyList(clientId, true,isShowHistoricalData);
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

  editClientPharmacy(clientId: number, clientPharmacyId: string, vendorId?: string,vendorAddressId?:string) {
    const model = {
      vendorId: vendorId,
      vendorAddressId:vendorAddressId
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

  removeClientPharmacy(clientId: number, clientPharmacyId: string,isShowHistoricalData?:boolean) {
    return new Promise((resolve,reject) =>{
      this.loaderService.show();
      return this.drugDataService.removeClientPharmacy(clientId, clientPharmacyId).subscribe({
        next: (response) => {
          if (response === true) {

            this.loadClientPharmacyList(clientId,false,isShowHistoricalData);
            this.removePharmacyResponseSubject.next(true);
            resolve(true);
            this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Client Pharmacy Removed Successfully');
          }
          this.loaderService.hide();
        },
        error: (err) => {
          resolve(false);
          this.removePharmacyResponseSubject.next(false);
          this.loaderService.hide();
          this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
          this.loggingService.logException(err);
        },
      });
    })

  }

  addDrugPharmacy(clientId: number, vendorId: string,vendorAddressId:string,priorityCode?:string,isShowHistoricalData?:boolean) {
   return new Promise((resolve,reject) =>{
    const model = {
      vendorId: vendorId,
      vendorAddressId:vendorAddressId,
      PriorityCode:priorityCode,
      IsUpdatePriorityCode:priorityCode != "" ? true : false
    };

    this.loaderService.show();
    return this.drugDataService.addClientPharmacy(clientId, model).subscribe({
      next: (response) => {
        if (response === true) {

          this.loadClientPharmacyList(clientId, true,isShowHistoricalData);
          this.addPharmacyResponseSubject.next(true);
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Drug Pharmacy Added Successfully');
        }
        this.loaderService.hide();
        resolve(true);
      },
      error: (err) => {
        this.addPharmacyResponseSubject.next(false);
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        resolve(false);
        this.loggingService.logException(err);
      },
    });
   })

  }


  getDrugPurchasedList(clientId: number, skip: any, pageSize: any, sortBy: any, sortType: any, filters:any,isPermiumWithinLastTwelveMonthsData:boolean) {
    this.loaderService.show();
    this.drugDataService.getDrugPurchasedList(clientId,skip,pageSize, sortBy, sortType, filters ,isPermiumWithinLastTwelveMonthsData).subscribe({
      next: (response:any) => {
        const gridView: any = {
          data: response.items,
          total:response.totalCount,
        };
       this.drugPurchaseSubject.next(gridView);
       this.loadDrugsDistinctUserIdsAndProfilePhoto(response.items);       
        this.loaderService.hide();
      },
      error: (err) => {
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  loadDrugsDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.pharmacyPurchaseProfileSubject.next(data);
          }
        },
      });
    }
  } 

  updatedMakePharmaciesPrimary(clientPharmacyId: string){    
    this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Primary Pharmacy Updated Successfully');
  }
  reActivatePharmacies(clientPharmacyId: string,pharmacy: any,isShowHistoricalData?:boolean){
    this.loaderService.show();
     this.drugDataService.activeDrugPharmacy(clientPharmacyId,pharmacy).subscribe({
      next: (response:any) => {
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Pharmacy Re-Activated Successfully');

        this.loadClientPharmacyList(pharmacy.ClientId,false,isShowHistoricalData);
      },
      error: (err) => {
        this.loaderService.hide();
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }
  deactivePharmacies(clientPharmacyId: string,pharmacy: any,isShowHistoricalData?:boolean){
    return new Promise((resolve,reject) =>{
      this.loaderService.show();
      this.drugDataService.activeDrugPharmacy(clientPharmacyId,pharmacy).subscribe({
       next: (response:any) => {
         if(response){
          this.deActivePharmacySubject.next(true);
          resolve(true);
         }
         this.loaderService.hide();
         this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Pharmacy De-Activated Successfully');
         this.loadClientPharmacyList(pharmacy.ClientId,false,isShowHistoricalData);
       },
       error: (err) => {
        resolve(false);
         this.loaderService.hide();
         this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
         this.loggingService.logException(err);
       },
     });
    })

  }
}
