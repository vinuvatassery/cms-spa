/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Entities **/
import { Document } from '../entities/document';
/** Data services **/
import { DocumentDataService } from '../infrastructure/document.data.service';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class DocumentFacade {
  /** Private properties **/
  private documentsSubject = new BehaviorSubject<Document[]>([]);
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = ' '
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];
  /** Public properties **/
  documents$ = this.documentsSubject.asObservable();

  /** Constructor**/
  constructor(private readonly documentDataService: DocumentDataService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private configurationProvider : ConfigurationProvider,
    private readonly loaderService: LoaderService) {}

  /** Public methods **/
  loadDocuments(): void {
    this.documentDataService.loadDocuments().subscribe({
      next: (documentsResponse) => {
        this.documentsSubject.next(documentsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
