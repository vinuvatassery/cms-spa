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

@Injectable({ providedIn: 'root' })
export class CptCodeFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueCptCode = 'creationTime'; 
  public sortCptCodeGrid: SortDescriptor[] = [{
    field: this.sortValueCptCode,
  }];

  private loadCptCodeListsServiceSubject = new BehaviorSubject<any>([]);
  loadCptCodeListsService$ = this.loadCptCodeListsServiceSubject.asObservable();

  private addCptCodeSubject = new Subject<any>();
  addCptCode$ = this.addCptCodeSubject.asObservable();


  /** Constructor **/
  constructor(
    private readonly cptCodeService: CptCodeService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly configurationProvider: ConfigurationProvider
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

  loadCptCodeLists() {
    this.cptCodeService.loadCptCodeListsService().subscribe({
      next: (loadCptCodeListsService) => {
        this.loadCptCodeListsServiceSubject.next(loadCptCodeListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  addCptCode(cptCode: any) {
    this.loaderService.show();
    this.cptCodeService.addCptCode(cptCode).subscribe(
      {
        next: (response: any) => {
          debugger;
          this.loaderService.hide();
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, response.message);
          //this.addCptCodeSubject.next(true);
        },
        error: (err) => {
          this.loaderService.hide();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
          this.loggingService.logException(err);
        },
      }
    );
  }

}
