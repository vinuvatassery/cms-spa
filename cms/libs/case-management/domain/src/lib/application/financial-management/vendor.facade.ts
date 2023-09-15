/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject, Subject } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';


/** Internal libraries **/
import { ConfigurationProvider, LoggingService, NotificationSnackbarService, SnackBarNotificationType, LoaderService } from '@cms/shared/util-core';
import { FinancialVendorDataService } from '../../infrastructure/financial-management/vendor.data.service';
import { FinancialVendorTypeCode } from '../../enums/financial-vendor-type-code';

@Injectable({ providedIn: 'root' })
export class FinancialVendorFacade {

  /** Private properties **/
  private vendorsSubject = new Subject<any>();
  private selectedVendorSubject = new Subject<any>();
  private vendorProfileSubject = new Subject<any>();
  private vendorProfileSpecialHandlingSubject = new Subject<any>();
  private clinicVendorSubject = new Subject<any>();
  private clinicVendorLoaderSubject = new Subject<any>();  /** Public properties **/
  private providePanelSubject = new Subject<any>();
  private updateProviderPanelSubject = new Subject<any>();
  vendorsList$ = this.vendorsSubject.asObservable();
  selectedVendor$ = this.selectedVendorSubject.asObservable();
  vendorProfile$ = this.vendorProfileSubject.asObservable();
   clinicVendorList$ = this.clinicVendorSubject.asObservable();
  clinicVendorLoader$ = this.clinicVendorLoaderSubject.asObservable(); 
  providePanelSubject$ = this.providePanelSubject.asObservable();
  updateProviderPanelSubject$ = this.updateProviderPanelSubject.asObservable();
  vendorProfileSpecialHandling$ = this.vendorProfileSpecialHandlingSubject.asObservable();

  private vendorsListSubject = new BehaviorSubject<any>([]);
  vendorDetails$ = this.vendorsListSubject.asObservable();

  private providerListSubject = new Subject<any>();
  providerList$ = this.providerListSubject.asObservable();
  public selectedVendorType = FinancialVendorTypeCode.Manufacturers
  public gridPageSizes =this.configurationProvider.appSettings.gridPageSizeValues;
  public sortValue = 'vendorName'
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  /** Constructor**/
  constructor(private readonly financialVendorDataService: FinancialVendorDataService,
    private readonly loaderService: LoaderService,
    private configurationProvider: ConfigurationProvider,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
  ) { }

  /** Public methods **/
  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
  }


  getVendors(skipcount: number, maxResultCount: number, sort: string, sortType: string, vendorTypeCode: string,filter : string): void {
    filter = JSON.stringify(filter);
    this.financialVendorDataService.getVendors(skipcount, maxResultCount, sort, sortType, vendorTypeCode,filter).subscribe({
      next: (vendorsResponse: any) => {
        if (vendorsResponse) {
          const gridView = {
            data: vendorsResponse["items"],
            total: vendorsResponse["totalCount"]
          };
          this.vendorsSubject.next(gridView);
        }

      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  getVendorProfile(vendorId: string,tabCode: string): void {
    this.showLoader();
    this.financialVendorDataService.getVendorProfile(vendorId,tabCode).subscribe({
      next: (vendorResponse: any) => {
        if (vendorResponse) {
          this.vendorProfileSubject.next(vendorResponse);
          this.hideLoader();
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }


  getVendorProfileSpecialHandling(vendorId: string): void {
    this.financialVendorDataService.getVendorProfileSpecialHandling(vendorId).subscribe({
      next: (vendorHandlingResponse: any) => {
        if (vendorHandlingResponse) {
          this.vendorProfileSpecialHandlingSubject.next(vendorHandlingResponse);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  getVendorDetails(vendorId: string) {
    this.showLoader();
    this.financialVendorDataService.getVendorDetails(vendorId).subscribe({
      next: (vendorDetail: any) => {    
        this.selectedVendorSubject.next(vendorDetail);
        this.hideLoader();
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    });
  }

  getProviderPanel(vendorId:string){
    this.showLoader();
    this.financialVendorDataService.getProviderPanel(vendorId).subscribe({
      next: (vendorsResponse: any) => {
        if (vendorsResponse) {
          this.providePanelSubject.next(vendorsResponse);   
          this.hideLoader();      
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  updateProviderPanel(ProviderPanelDto:any){
    this.showLoader();
    return this.financialVendorDataService.updateProviderPanel(ProviderPanelDto).subscribe({
      next: (updatedResponse: any) => {
        if (updatedResponse) {
          this.updateProviderPanelSubject.next(updatedResponse);            
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Updated success fully')
          this.hideLoader();      
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }


  updateManufacturerProfile(vendorProfile: any){
    return this.financialVendorDataService.updateManufacturerProfile(vendorProfile);
  }
  addVendorProfile(vendorProfile: any) {
    return this.financialVendorDataService.addVendorProfile(vendorProfile);
  }

  searchClinicVendor(vendorName: any){
    this.clinicVendorLoaderSubject.next(true);
    this.clinicVendorSubject.next(null);
    this.financialVendorDataService.searchClinicVendors(vendorName).subscribe({
      next: (vendorsResponse: any) => {
        if (vendorsResponse) {
          this.clinicVendorSubject.next(vendorsResponse);
          this.clinicVendorLoaderSubject.next(false);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  loadVendorList(vendorTypeCode:any): void {
    this.showLoader();
    this.financialVendorDataService.loadVendorList(vendorTypeCode).subscribe({
      next: (reponse: any) => {
        if (reponse) {
          this.hideLoader();
          this.vendorsListSubject.next(reponse);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  getProviderList(providerPageAndSortedRequest :any){
    this.showLoader();
    this.financialVendorDataService.getProvidersList(providerPageAndSortedRequest).subscribe({
      next: (response: any) => {
        if (response) {
          const gridView = {
            data: response["items"],
            total:response["totalCount"]
          };
          this.hideLoader();
          this.providerListSubject.next(gridView);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
}
