/** Angular **/
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Cer } from '../entities/cer';
/** Data services **/
import { CerDataService } from '../infrastructure/cer.data.service';
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
@Injectable({ providedIn: 'root' })
export class CerTrackingFacade {
  /** Private properties **/
  private cerSubject = new BehaviorSubject<Cer[]>([]);
  private cerGridSubject = new BehaviorSubject<any>([]);
  private ddlCerSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  cer$ = this.cerSubject.asObservable();
  cerGrid$ = this.cerGridSubject.asObservable();
  ddlCer$ = this.ddlCerSubject.asObservable();

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  public sortValue = '';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];
  /** Constructor**/
  constructor(private readonly cerDataService: CerDataService,
    private loggingService : LoggingService,
    private readonly loaderService: LoaderService ,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    public intl: IntlService, 
    private configurationProvider : ConfigurationProvider,) {}

  /** Public methods **/
  loadCer(): void {
    this.cerDataService.loadCer().subscribe({
      next: (cerResponse) => {
        this.cerSubject.next(cerResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadCerGrid(): void {
    this.cerDataService.loadCerGrid().subscribe({
      next: (cerGridResponse) => {
        this.cerGridSubject.next(cerGridResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlCer(): void {
    this.cerDataService.loadDdlCer().subscribe({
      next: (ddlCerResponse) => {
        this.ddlCerSubject.next(ddlCerResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
