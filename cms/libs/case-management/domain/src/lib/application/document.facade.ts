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
  public sortValue = ' '
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];
  /** Public properties **/
  documents$ = this.documentsSubject.asObservable();
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
    this.hideLoader();

  }

  hideLoader() {
    this.loaderService.hide();
  }

  getDocumentsByClientCaseEligibilityId(clientCaseEligibilityId: string) {
    this.documentGridLoaderSubject.next(true);
    this.documentDataService.getDocumentsByClientCaseEligibilityId(clientCaseEligibilityId).subscribe({
      next: (documentsResponse) => {
        this.documentGridLoaderSubject.next(false);
        this.documentsSubject.next(documentsResponse);
      },
      error: (err) => {
        this.documentGridLoaderSubject.next(false);
        console.error('err', err);
      },
    });
  }

  getClientDocumentsViewDownload(clientDocumentId: string) {
    return this.documentDataService.getClientDocumentsViewDownload(clientDocumentId);
  }

  viewOrDownloadFile(eventType: string, DocumentId: string, documentName: string) {
    if (DocumentId === undefined || DocumentId === '') {
      return;
    }
    this.loaderService.show()
    this.getClientDocumentsViewDownload(DocumentId).subscribe({
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

  getDocumentByDocumentId(DocumentId: string) {
    return this.documentDataService.getDocumentByDocumentId(DocumentId);
  }
}
