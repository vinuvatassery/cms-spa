/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Provider } from '../entities/provider';
/** Data services **/
import { ProviderDataService } from '../infrastructure/provider.data.service';
import { Subject } from 'rxjs';
import {
  ConfigurationProvider,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class ManagementFacade {
  /** Private properties **/
  private providersSubject = new BehaviorSubject<Provider[]>([]);
  private managersSubject = new BehaviorSubject<any>([]);
  private ddlStatesSubject = new BehaviorSubject<any>([]);
  private providersGridSubject = new BehaviorSubject<any>([]);
  private loadCd4CountSubject = new BehaviorSubject<any>([]);
  private loadViralLoadSubject = new BehaviorSubject<any>([]);

  private clientLabResultsSubject = new Subject<any>();

  /** Public properties **/
  loadViralLoad$ = this.loadViralLoadSubject.asObservable();
  loadCd4Count$ = this.loadCd4CountSubject.asObservable();
  providers$ = this.providersSubject.asObservable();
  managers$ = this.managersSubject.asObservable();
  ddlStates$ = this.ddlStatesSubject.asObservable();
  providersGrid$ = this.providersGridSubject.asObservable();
  clientLabResults$ = this.clientLabResultsSubject.asObservable();
  public gridPageSizes =
  this.configurationProvider.appSettings.gridPageSizeValues;
public sortValue = ' ';
public sortType = 'asc';

public sort: SortDescriptor[] = [
  {
    field: this.sortValue,
    dir: 'asc',
  },
];

  /** Constructor**/
  constructor(
    private readonly providerDataService: ProviderDataService,
    private readonly loggingService: LoggingService,
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider
  ) {}

  /** Public methods **/

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.snackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  loadProvidersGrid(): void {
    this.providerDataService.loadProvidersGrid().subscribe({
      next: (providersGridResponse) => {
        this.providersGridSubject.next(providersGridResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadCd4Count(): void {
    this.providerDataService.loadCd4Count().subscribe({
      next: (loadCd4CountResponse) => {
        this.loadCd4CountSubject.next(loadCd4CountResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadViralLoad(): void {
    this.providerDataService.loadCd4Count().subscribe({
      next: (loadViralLoadResponse) => {
        this.loadViralLoadSubject.next(loadViralLoadResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadLabResults(
    labResultTypeCode: string,
    clientId: number,   
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string,
    historychkBoxChecked : boolean
  ): void {
    this.providerDataService
      .loadLabResults(
        labResultTypeCode,
        clientId,      
        skipcount,
        maxResultCount,
        sort,
        sortType,
        historychkBoxChecked
      )
      .subscribe({
        next: (clientLabResponse: any) => {
          if (clientLabResponse) {
            const gridView = {
              data: clientLabResponse['items'],
              total: clientLabResponse['totalCount'],
            };
            this.clientLabResultsSubject.next(gridView);
          }
        },
        error: (err) => {
          const gridView = {
            data: null,
            total: -1,
          };
          this.clientLabResultsSubject.next(gridView);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }
}
