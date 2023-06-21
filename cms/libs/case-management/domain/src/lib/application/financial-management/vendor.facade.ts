/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';


/** Internal libraries **/
import { ConfigurationProvider, LoggingService, NotificationSnackbarService, SnackBarNotificationType, LoaderService } from '@cms/shared/util-core';
import { FinancialVendorDataService } from '../../infrastructure/financial-management/vendor.data.service';


@Injectable({ providedIn: 'root' })
export class FinancialVendorFacade {

  /** Private properties **/
  private vendorsSubject = new Subject<any>();
  private selectedVendorSubject = new Subject<any>();
  private vendorProfileSubject = new Subject<any>();
  private vendorProfileSpecialHandlingSubject = new Subject<any>();
  private clinicVendorSubject = new Subject<any>();
  private clinicVendorLoaderSubject = new Subject<any>();  /** Public properties **/
  vendorsList$ = this.vendorsSubject.asObservable();
  selectedVendor$ = this.selectedVendorSubject.asObservable();
  vendorProfile$ = this.vendorProfileSubject.asObservable();
   clinicVendorList$ = this.clinicVendorSubject.asObservable();
  clinicVendorLoader$ = this.clinicVendorLoaderSubject.asObservable();
  vendorProfileSpecialHandling$ = this.vendorProfileSpecialHandlingSubject.asObservable();
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


  getVendors(skipcount: number, maxResultCount: number, sort: string, sortType: string, vendorTypeCode: string): void {

    this.financialVendorDataService.getVendors(skipcount, maxResultCount, sort, sortType, vendorTypeCode).subscribe({
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
}