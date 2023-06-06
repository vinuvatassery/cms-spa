/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';


/** Internal libraries **/
import { ConfigurationProvider, LoggingService, NotificationSnackbarService, SnackBarNotificationType, LoaderService } from '@cms/shared/util-core';
import { ProvidersDataService } from '../../infrastructure/financial-management/providers.data.service';



@Injectable({ providedIn: 'root' })
export class ProvidersFacade {

  /** Private properties **/
  private providersSubject = new Subject<any>();

  /** Public properties **/
  providersList$ = this.providersSubject.asObservable();
  
  public gridPageSizes =this.configurationProvider.appSettings.gridPageSizeValues;
  public sortValue = 'providerName'
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  /** Constructor**/
  constructor(private readonly financialProvidersDataService:ProvidersDataService,
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

  
  getProviders(skipcount: number,maxResultCount: number,sort: string,sortType: string,providerTypeCode: string): void {
   
    this.financialProvidersDataService.getProviders(skipcount,maxResultCount,sort,sortType,providerTypeCode).subscribe({
      next: (providersResponse: any) => {
        if (providersResponse) {
          const gridView = {
            data: providersResponse["items"],
            total: providersResponse["totalCount"]
          };
          this.providersSubject.next(gridView);
        }
       
      },
      error: (err) => {     
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
}