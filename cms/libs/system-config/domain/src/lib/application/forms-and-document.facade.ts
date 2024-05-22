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
    private popupFormsDocumentsSubject = new Subject<any>();
    popupFormsDocumentsList$ = this.popupFormsDocumentsSubject.asObservable();
    private folderSortSubject = new Subject<any>();
    folderSort$ = this.folderSortSubject.asObservable();
    private getFolderSubject = new BehaviorSubject<any>([]);
    getFolder$ =  this.getFolderSubject.asObservable();
    private uploadFilesSubject = new Subject<any>();
    uploadFiles$ =  this.uploadFilesSubject.asObservable();
    private uploadNewVersionDocumentSubject = new BehaviorSubject<any>([]);
    uploadNewVersionDocument$ =  this.uploadNewVersionDocumentSubject.asObservable();
    private renameSubject = new BehaviorSubject<any>([]);
    renameSubject$ =  this.renameSubject.asObservable();
  
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
    loadFolderFilePopup(payLoad:any) {
      this.showLoader();
      this.uploadFormandDocumentService.loadFolderFile(payLoad).subscribe({
          next: (response) => {
              this.popupFormsDocumentsSubject.next(response);
              this.hideLoader();
          },
          error: (err) => {
              this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
              this.hideLoader();
          },
      })
  }
    getFormsandDocumentsViewDownload(id: string) {
        return this.uploadFormandDocumentService.getFormsandDocumentsViewDownload(id);
      }
    addFolder(payLoad :any){
        this.showLoader();
        this.uploadFormandDocumentService.addFolder(payLoad).subscribe({
          next: (response) =>
        {
            this.addFolderSubject.next(response);
            if (response) 
            {
              var filter={
                sort : true,
                active: 'Y'
              }
              this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
              this.hideLoader();
              this.loadFolderFile(filter);
              this.getFolderName();
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
                var filter={
                  sort : true,
                  active: 'Y'
                }
                this.uploadFilesSubject.next(response);
                this.hideLoader();
                this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
                this.loadFolderFile(filter);
              },
              error: (err) => {
                this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
                this.hideLoader();
              },
               });
          }

          
      uploadAttachments(uploadRequest:any , documentTemplateId :string){
        this.showLoader()
        this.uploadFormandDocumentService.uploadAttachments(uploadRequest, documentTemplateId).subscribe({
          next: (response:any) => {
            this.uploadNewVersionDocumentSubject.next(response);
            if (response) {
              this.loaderService.hide();
              this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
            }
          },
          error: (err) => {
            this.showHideSnackBar(SnackBarNotificationType.ERROR, 'attachment required');
            this.loaderService.hide();
          },
        })
      } 
      updateTemplate(payload:any){
        this.showLoader()
        this.uploadFormandDocumentService.updateTemplate(payload).subscribe({
          next: (response:any) => {
            this.renameSubject.next(response);
            if (response) {
              var filter={
                sort : true,
                active: 'Y'
              }
              this.loaderService.hide();
              this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
              this.loadFolderFile(filter);
              this.getFolderName();
            }
          },
          error: (err) => {
            this.showHideSnackBar(SnackBarNotificationType.ERROR," ");
            this.loaderService.hide();
          },
        })
      }
}
