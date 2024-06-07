/** Angular **/
import { Injectable } from '@angular/core';
import {
  ApiType,
  ConfigurationProvider,
  DocumentFacade,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { PharmaciesService } from '../infrastructure/pharmacies.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { UserManagementFacade } from '../application/user-management.facade';

@Injectable({ providedIn: 'root' })
export class PharmaciesFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValuePharmacies = 'vendorName'; 
  public sortPharmaciesGrid: SortDescriptor[] = [{
    field: this.sortValuePharmacies, dir: 'asc'
  }];

  private loadPharmaciesListsServiceSubject = new Subject<any>();
  loadPharmaciesListsService$ = this.loadPharmaciesListsServiceSubject.asObservable();

  private pharmaciesListDataLoaderSubject = new BehaviorSubject<boolean>(false);
  pharmaciesListDataLoader$ = this.pharmaciesListDataLoaderSubject.asObservable();

  private pharmaciesProfilePhotoSubject = new Subject();
  pharmaciesProfilePhoto$ = this.pharmaciesProfilePhotoSubject.asObservable();


  /** Constructor **/
  constructor(
    private readonly pharmaciesService: PharmaciesService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly userManagementFacade: UserManagementFacade,
    private readonly documentFacade: DocumentFacade,
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

  loadPharmaciesLists(paginationParameters: any) {
    this.pharmaciesListDataLoaderSubject.next(true);
    this.pharmaciesService.loadPharmaciesListsService(paginationParameters).subscribe({
      next: (dataResponse: any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.loadPharmaciesListsServiceSubject.next(gridView);
        this.loadSupportGroupDistinctUserIdsAndProfilePhoto(gridView?.data);
        this.pharmaciesListDataLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.pharmaciesListDataLoaderSubject.next(false);
      },
    });
  }

 
  loadSupportGroupDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.lastModifierId))).join(',');
    if (distinctUserIds) {
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
        .subscribe({
          next: (data: any[]) => {
            if (data.length > 0) {
              this.pharmaciesProfilePhotoSubject.next(data);
            }
          },
        });
    }
  }

}
