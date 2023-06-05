/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';


/** Internal libraries **/
import { ConfigurationProvider, LoggingService, NotificationSnackbarService, SnackBarNotificationType, LoaderService } from '@cms/shared/util-core';
import { FinancialVendorDataService } from '../infrastructure/financial-vendor.data.service';


@Injectable({ providedIn: 'root' })
export class FinancialVendorFacade {

  /** Private properties **/
  private vendorsSubject = new Subject<any>();
  private selectedVendorSubject = new Subject<any>();

  /** Public properties **/
  vendorsList$ = this.vendorsSubject.asObservable();
  selectedVendor$ = this.selectedVendorSubject.asObservable();
  
  public gridPageSizes =this.configurationProvider.appSettings.gridPageSizeValues;
  public sortValue = 'vendorName'
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  /** Constructor**/
  constructor(private readonly financialVendorDataService: FinancialVendorDataService,
    private readonly loaderService: LoaderService ,
    private configurationProvider : ConfigurationProvider ,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
     ) {}

       /** Public methods **/
  showLoader()
  {
    this.loaderService.show();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }
  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.hideLoader();
  }

  
  getVendors(skipcount: number,maxResultCount: number,sort: string,sortType: string,vendorTypeCode: string): void {
   
    this.financialVendorDataService.getVendors(skipcount,maxResultCount,sort,sortType,vendorTypeCode).subscribe({
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
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  updateSelectedVendor(vendor: any) {
    this.selectedVendorSubject.next(vendor);
  }
}