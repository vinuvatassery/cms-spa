/** Angular **/
import { Injectable } from '@angular/core';
import { FormsAndDocumentDataService } from '../infrastructure/forms-and-document.data.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';


@Injectable({ providedIn: 'root' })
export class FormsAndDocumentFacade {
    private addFolderSubject = new Subject<any>();
    addNewFolder$ =  this.addFolderSubject.asObservable();
    private formsDocumentsSubject = new Subject<any>();
    formsDocumentsList$ = this.formsDocumentsSubject.asObservable();
    private folderSortSubject = new Subject<any>();
    folderSort$ = this.folderSortSubject.asObservable();
    private getFolderSubject = new Subject<any>();
    getFolder$ =  this.getFolderSubject.asObservable();
    private uploadFilesSubject = new Subject<any>();
    uploadFiles$ =  this.uploadFilesSubject.asObservable();
    showLoader() { this.loaderService.show(); }
    hideLoader() { this.loaderService.hide(); }
    constructor(private readonly uploadFormandDocumentService: FormsAndDocumentDataService,
        private readonly loggingService: LoggingService,
        private readonly loaderService: LoaderService,
        private readonly notificationSnackbarService: NotificationSnackbarService) {}

    showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
        if (type == SnackBarNotificationType.ERROR) {
            const err = subtitle;
            this.loggingService.logException(err)
        }
        this.notificationSnackbarService.manageSnackBar(type, subtitle)
    }
    loadfolderSort() {
        this.showLoader();
        this.uploadFormandDocumentService.loadfolderSort().subscribe({
            next: (response) => {
                this.folderSortSubject.next(response);
                this.hideLoader();
            },
            error: (err) => {
                this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
                this.hideLoader();
            },
        })
    }

    loadFolderFile(payLoad:any) {
        this.showLoader();
        this.uploadFormandDocumentService.loadFolderFile(payLoad).subscribe({
            next: (response) => {
                this.formsDocumentsSubject.next(response);
                this.hideLoader();
            },
            error: (err) => {
                this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
                this.hideLoader();
            },
        })
    }

    addFolder(payLoad :any){
        this.showLoader();
        this.uploadFormandDocumentService.addFolder(payLoad).subscribe({
          next: (response) =>
        {
            this.addFolderSubject.next(response);
            if (response) 
            {
                this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
                this.hideLoader();
                this.loadFolderFile(true);
            } 
        },
          error: (err) => 
        {
            this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
            this.hideLoader();
        },
        })
      }

      getFolderName() {
        this.uploadFormandDocumentService.getFolderName().subscribe({
          next:(response) => {
            this.getFolderSubject.next(response);
          },
          error: (err) => {
            this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
          },
           }); 
        }
        uploadFiles( formData:any){
            this.showLoader()
            this.uploadFormandDocumentService.uploadFiles(formData).subscribe({
              next:(response) => {
                this.uploadFilesSubject.next(response);
                this.hideLoader();
                this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
                this.loadFolderFile(true);
              },
              error: (err) => {
                this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
                this.hideLoader();
              },
               });
          }
}
