import { Injectable } from '@angular/core'; 
import { BehaviorSubject } from 'rxjs'; 
import { SystemInterfaceDashboardService } from '../infrastructure/system-interface-dashboard.service'; 
import { SnackBarNotificationType, NotificationSource, LoaderService, ConfigurationProvider, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class SystemInterfaceDashboardFacade {
  private dashboardChartListSubject = new BehaviorSubject<any[]>([]);
  public dashboardChartList$ =
    this.dashboardChartListSubject.asObservable(); 


    private activityEventLogListSubject = new BehaviorSubject<any>([]);
    activityEventLogLists$ =
    this.activityEventLogListSubject.asObservable();
    public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
    public sortValue = 'vendorName'
    public sortType = 'asc'
    public sort: SortDescriptor[] = [{
      field: this.sortValue,
    }];
  showHideSnackBar(type : SnackBarNotificationType , subtitle : any, source :  NotificationSource  = NotificationSource.API)
  {
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type,subtitle, source)
    this.hideLoader();
  }


  /** Constructor**/
  constructor(private systemInterfaceDashboardService: SystemInterfaceDashboardService,
   private readonly loaderService: LoaderService ,
    private configurationProvider : ConfigurationProvider ,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    public intl: IntlService ) {}

  /** Public methods **/
  showLoader()
  {
    this.loaderService.show();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }

  getEventLogLists(): void {

    this.systemInterfaceDashboardService.loadActivityLogListsServices().subscribe({
      next: (activityEventLogResponse) => {
        this.activityEventLogListSubject.next(activityEventLogResponse);
       
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
     
      },
    });
  }



  loadDashboardContent() {
    this.systemInterfaceDashboardService.getDashboardContent().subscribe({
      next: (dashboardChartList) => { 
        this.dashboardChartListSubject.next(dashboardChartList);
      },
       
      error: (err) => {
        // this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        console.error('err', err);
      },
    });
  }

 
}
