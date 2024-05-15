/** Angular **/
import { Injectable } from '@angular/core';
import {
  ConfigurationProvider,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
/** Data services **/
import { CptCodeService } from '../infrastructure/cpt-code.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { UserManagementFacade } from '../application/user-management.facade';

@Injectable({ providedIn: 'root' })
export class CptCodeFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueCptCode = 'cptCode1'; 
  public sortCptCodeGrid: SortDescriptor[] = [{
    field: this.sortValueCptCode,
  }];

  private loadCptCodeListsServiceSubject = new BehaviorSubject<any>([]);
  loadCptCodeListsService$ = this.loadCptCodeListsServiceSubject.asObservable();

  private cptCodeListDataLoaderSubject = new BehaviorSubject<boolean>(false);
  cptCodeListDataLoader$ = this.cptCodeListDataLoaderSubject.asObservable();

  private cptCodeProfilePhotoSubject = new Subject();
  cptCodeProfilePhoto$ = this.cptCodeProfilePhotoSubject.asObservable();

  private addCptCodeSubject = new Subject<any>();
  addCptCode$ = this.addCptCodeSubject.asObservable();

  private editCptCodeSubject = new Subject<boolean>();
  editCptCode$ = this.editCptCodeSubject.asObservable();


  /** Constructor **/
  constructor(
    private readonly cptCodeService: CptCodeService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly userManagementFacade: UserManagementFacade,
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

  loadCptCodeLists(paginationParameters: any) {
    this.cptCodeListDataLoaderSubject.next(true);
    this.cptCodeService.loadCptCodeListsService(paginationParameters).subscribe({
      next: (dataResponse: any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.loadCptCodeListsServiceSubject.next(gridView);
        this.loadSupportGroupDistinctUserIdsAndProfilePhoto(gridView?.data);
        this.cptCodeListDataLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.cptCodeListDataLoaderSubject.next(false);
      },
    });
  }

  addCptCode(cptCode: any) {
    this.loaderService.show();
    this.cptCodeService.addCptCode(cptCode).subscribe(
      {
        next: (response: any) => {
          this.loaderService.hide();
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, response.message);
          this.addCptCodeSubject.next(true);
        },
        error: (err) => {
          if (err?.error?.error?.code?.includes('DUPLICATE_CPT_CODE_ALREADY_EXISTS')) {
            this.showHideSnackBar(SnackBarNotificationType.WARNING, err?.error?.error?.message);
            this.loggingService.logException(err?.error?.error?.message);
            this.loaderService.hide();
          } else{
            this.loaderService.hide();
            this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
            this.loggingService.logException(err);
          }
        },
      }
    );
  }


  editCptCode(cptCode: any) {
    this.loaderService.show();
    let cptCodeId = cptCode.cptCodeId;
    return this.cptCodeService.editCptCode(cptCodeId, cptCode).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.editCptCodeSubject.next(true);
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, response.message);
        }
        this.loaderService.hide();
      },
      error: (err) => {
        if (err?.error?.error?.code?.includes('DUPLICATE_CPT_CODE_ALREADY_EXISTS')) {
          this.showHideSnackBar(SnackBarNotificationType.WARNING, err?.error?.error?.message);
          this.loggingService.logException(err?.error?.error?.message);
          this.loaderService.hide();
        } else{
          this.loaderService.hide();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
          this.loggingService.logException(err);
        }
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
              this.cptCodeProfilePhotoSubject.next(data);
            }
          },
        });
    }
  }

}
