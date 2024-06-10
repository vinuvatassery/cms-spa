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
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class DocumentFacade {
  /** Private properties **/
  private documentsSubject = new BehaviorSubject<Document[]>([]);
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  private documentGridLoaderSubject = new Subject<boolean>();
  private documentSubject = new Subject<any>();
  private documentsListSubject  = new Subject<any>();
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  private saveDocumentSubject = new Subject<any>();
  private updateDocumentSubject = new Subject<any>();
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
  saveDocumentResponse$ = this.saveDocumentSubject.asObservable();
  updateDocumentResponse$ = this.updateDocumentSubject.asObservable();
  documentListUserProfilePhotoSubject = new Subject();

  /** Constructor**/
  constructor(private readonly documentDataService: DocumentDataService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private configurationProvider : ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private userManagementFacade:UserManagementFacade,) {}

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

  saveDocument(doc: any) {
    this.loaderService.show();
    this.documentDataService.saveDocument(doc).subscribe({
      next: (response:any) => {
        this.saveDocumentSubject.next(response);
        if (response) {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS,'Document saved successfully.');
          this.loaderService.hide();
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        this.loaderService.hide();
      },
    });
  }

  updateDocument(doc: any) {
    this.loaderService.show();
    this.documentDataService.updateDocument(doc).subscribe({
      next: (response:any) => {
        this.updateDocumentSubject.next(response);
        if (response) {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS,'Document updated successfully.');
          this.loaderService.hide();
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        this.loaderService.hide();
      },
    });
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)

  }

  getDocumentsByClientCaseEligibilityId(
    clientId: number,
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string,
    filter: any,
    columnName: any
  ): void {
    this.documentGridLoaderSubject.next(true);
    const payload ={
      clientId : clientId,
      skipcount : skipcount,
      maxResultCount: maxResultCount,
      sort : sort,
      sortType : sortType,
      filter :filter,
      columnName : columnName,
      typeCode : null
    }
    this.documentDataService
      .getDocumentsByClientCaseEligibilityId(
        payload
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
            this.loadDocumentsDistinctUserIdsAndProfilePhoto(documentsResponse['items']);
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

  loadDocumentsDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.documentListUserProfilePhotoSubject.next(data);
          }
        },
      });
    }
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
    this.loaderService.show();
    this.documentDataService.getDocumentByDocumentId(documentId).subscribe({
      next: (documentResponse) => {
        if(documentResponse){
          this.documentSubject.next(documentResponse);
          this.loaderService.hide();
        }
        else{
          this.showHideSnackBar(SnackBarNotificationType.WARNING, 'Data Not Found')
          this.loaderService.hide();
        }
      },
      error: (err) => {
        if (err) {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
          this.loaderService.hide();
        }
      },
    });
  }
}

