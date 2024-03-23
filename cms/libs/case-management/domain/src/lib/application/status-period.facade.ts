/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

/** Data services **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { StatusPeriodDataService } from '../infrastructure/status-period.data.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import { UserManagementFacade } from '@cms/system-config/domain';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatusPeriodFacade {
  /** Private properties **/
  private statusPeriodSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  statusPeriod$ = this.statusPeriodSubject.asObservable();

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'eligibilityStartDate'
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];
  statusPeriodProfilePhotoSubject = new Subject();

  /** Constructor**/
  constructor(private readonly statusPeriodDataService: StatusPeriodDataService,
    private loggingService : LoggingService,
    private readonly loaderService: LoaderService ,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private configurationProvider : ConfigurationProvider,
    private userManagementFacade:UserManagementFacade
    ) {}

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

    showLoader()
    {
      this.loaderService.show();
    }
  
    hideLoader()
    {
      this.loaderService.hide();
    }
  /** Public methods **/
  loadStatusPeriod(caseId:any,clientId:any,showHistorical:any,gridDataRefinerValue:any): void {
    this.showLoader();
    this.statusPeriodDataService.loadStatusPeriod(caseId,clientId,showHistorical,gridDataRefinerValue).subscribe({
      next: (statusPeriodResponse:any) => {
        if (statusPeriodResponse) {
          const gridView = {
            data: statusPeriodResponse['items'],
            total: statusPeriodResponse['totalCount'],
          };

          this.statusPeriodSubject.next(gridView);
          this.loadStatusPeriodDistinctUserIdsAndProfilePhoto(statusPeriodResponse['items']);
          this.hideLoader();
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
      },
    });
  }

  loadStatusPeriodDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.statusPeriodProfilePhotoSubject.next(data);
          }
        },
      });
    }
  } 

  loadStatusGroupHistory(eligibilityId: string) {
    return this.statusPeriodDataService.loadStatusGroupHistory(eligibilityId);
  }

  loadStatusFplHistory(eligibilityId: string) {
    return this.statusPeriodDataService.loadStatusFplHistory(eligibilityId);
  }

  loadRamSellInfo(clientId: string,clientCaseEligibilityId:any=null) {
    return this.statusPeriodDataService.loadRamSellInfo(clientId,clientCaseEligibilityId);
  }
}
