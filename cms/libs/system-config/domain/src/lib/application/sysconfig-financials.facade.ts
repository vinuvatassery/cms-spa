/** Angular **/
import { Injectable } from '@angular/core';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { Subject, first, Observable } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LoginUser } from '../entities/login-user';
/** Entities **/
import { User } from '../entities/user';
/** Data services **/
import { Counties } from '../entities/counties';
import { State } from '../entities/state';
import { ZipCodeDataService } from '../infrastructure/zip-code.data.service';
import { SystemConfigFinancialDataService } from '../infrastructure/sysconfig-financials.data.service';

@Injectable({ providedIn: 'root' })
export class SystemConfigFinancialFacade {
  private loadIndexListsServiceSubject = new BehaviorSubject<any>([]);
  loadIndexListsService$ = this.loadIndexListsServiceSubject.asObservable();

  private loadExpenseTypeListsServiceSubject = new BehaviorSubject<any>([]);
  loadExpenseTypeListsService$ =
    this.loadExpenseTypeListsServiceSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly zipCodeDataService: ZipCodeDataService,
    private readonly systemConfigFinancialDataService: SystemConfigFinancialDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService
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

  getStates(): Observable<State[]> {
    return this.zipCodeDataService.getSates();
  }

  getCounties(stateCode: string): Observable<Counties[]> {
    return this.zipCodeDataService.getCounties(stateCode);
  }

  loadIndexLists() {
    this.systemConfigFinancialDataService.loadIndexListsService().subscribe({
      next: (loadIndexListsService) => {
        this.loadIndexListsServiceSubject.next(loadIndexListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadExpenseTypeLists() {
    this.systemConfigFinancialDataService
      .loadExpenseTypeListsService()
      .subscribe({
        next: (loadExpenseTypeListsService) => {
          this.loadExpenseTypeListsServiceSubject.next(
            loadExpenseTypeListsService
          );
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }
}
