/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs/internal/Subject';
/** Entities **/
import { Document } from '../entities/document';
/** Data services **/
import { DocumentDataService } from '../infrastructure/document.data.service';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class DocumentFacade {
  /** Private properties **/
  private documentsSubject = new BehaviorSubject<Document[]>([]);  
  private documentGridLoaderSubject = new BehaviorSubject<boolean>(false);
  private documentSubject = new Subject<any>();
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  private documentsListSubject  = new Subject<any>();
  public sortValue = ' '
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];
  /** Public properties **/
  documents$ = this.documentsSubject.asObservable();
  documentsList$ = this.documentsListSubject.asObservable();
  document$ = this.documentSubject.asObservable();
  documentGridLoader$ = this.documentGridLoaderSubject.asObservable();
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

  uploadDocument(doc: any) {
    return this.documentDataService.uploadDocument(doc);
  }

  updateDocument(doc: any) {
    return this.documentDataService.updateDocument(doc);
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)

  }

  getDocumentsByClientCaseEligibilityId(
    clientCaseEligibilityId: string, 
    skipcount: number, 
    maxResultCount: number, 
    sort: string, 
    sortType: string,
    filter: any,
    columnName: any
  ): void {
    this.documentGridLoaderSubject.next(true);
    this.documentDataService
      .getDocumentsByClientCaseEligibilityId(
        clientCaseEligibilityId,
        skipcount,
        maxResultCount,
        sort,
        sortType,
        filter,
        columnName
      )
      .subscribe({
        next: (documentsResponse: any) => {
          if (documentsResponse) {
            const gridView = {
              data: documentsResponse['items'],
              total: documentsResponse['totalCount'],
            };
            this.documentGridLoaderSubject.next(false);
            this.documentsListSubject.next(gridView);
          }
        },
        error: (err) => {
          const gridView = {
            data: null,
            total: -1,
          };
          this.documentGridLoaderSubject.next(false);
          this.documentsListSubject.next(gridView);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }
  getClientDocumentsViewDownload(clientDocumentId: string) {
    return this.documentDataService.getClientDocumentsViewDownload(clientDocumentId);
  }

  viewOrDownloadFile(eventType: string, documentId: string, documentName: string) {
    if (documentId === undefined || documentId === '') {
      return;
    }
    this.loaderService.show()
    this.getClientDocumentsViewDownload(documentId).subscribe({
      next: (data: any) => {

        const fileUrl = window.URL.createObjectURL(data);
        if (eventType === 'view') {
          window.open(fileUrl, "_blank");
        } else {
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          downloadLink.download = documentName;
          downloadLink.click();
        }
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, error)
      }
    })
  }

  getDocumentByDocumentId(documentId: string) {
    return this.documentDataService.getDocumentByDocumentId(documentId);
  }
}
