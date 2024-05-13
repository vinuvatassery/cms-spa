/** Angular **/
import { Injectable } from '@angular/core';
import { FormsAndDocumentDataService } from '../infrastructure/forms-and-document.data.service';
import { BehaviorSubject } from 'rxjs';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';


@Injectable({ providedIn: 'root' })
export class FormsAndDocumentFacade {
    private addFolderSubject = new BehaviorSubject<any>([]);
    addNewFolder$ =  this.addFolderSubject.asObservable();
    private formsDocumentsSubject = new BehaviorSubject<any>([]);
    formsDocumentsList$ = this.formsDocumentsSubject.asObservable();
    private folderSortSubject = new BehaviorSubject<any>([]);
    folderSort$ = this.folderSortSubject.asObservable();
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

    loadFolderFile() {
        this.showLoader();
        this.uploadFormandDocumentService.loadFolderFile().subscribe({
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
            } 
        },
          error: (err) => 
        {
            this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
            this.hideLoader();
        },
        })
      }
}
