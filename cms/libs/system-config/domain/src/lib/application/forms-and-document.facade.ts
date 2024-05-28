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
    private gridStateSubject = new Subject<any>();
    gridState$ =  this.gridStateSubject.asObservable();
    private uploadNewVersionDocumentSubject = new BehaviorSubject<any>([]);
    uploadNewVersionDocument$ =  this.uploadNewVersionDocumentSubject.asObservable();
    private renameSubject = new BehaviorSubject<any>([]);
    renameSubject$ =  this.renameSubject.asObservable();
    private deActiveTemplateSubject = new BehaviorSubject<any>([]);
    deActiveTemplate$ =  this.deActiveTemplateSubject.asObservable();
    private reActiveTemplateSubject = new BehaviorSubject<any>([]);
    reActiveTemplate$ =  this.reActiveTemplateSubject.asObservable();
    private isActiveSubject = new BehaviorSubject<any>([]);
    isActive$ =  this.isActiveSubject.asObservable();

    isShowInActive= false;
  
    showLoader() { this.loaderService.show(); }
    hideLoader() { this.loaderService.hide(); }
    filter1={
      sort : true,
      active: "",
    }
    constructor(private readonly uploadFormandDocumentService: FormsAndDocumentDataService,
        private readonly loggingService: LoggingService,
        private readonly loaderService: LoaderService,
        private readonly snackbarService: NotificationSnackbarService,
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
                if(payLoad.ischecked != undefined){
                  this.isActiveSubject.next(payLoad.ischecked);
                  
                }
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
            { this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
              this.hideLoader();
              this.isActiveSubscription();
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
                    this.uploadFilesSubject.next(response);
                    this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
                    this.hideLoader();
                    this.isActiveSubscription();
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
              this.loaderService.hide();
              this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
              this.isActiveSubscription();
              this.getFolderName();
              
             
            }
          },
          error: (err) => {
            this.showHideSnackBar(SnackBarNotificationType.ERROR," ");
            this.loaderService.hide();
          },
        })
      }

      reOrder(reOrderRequest:any){
        this.showLoader()
        this.uploadFormandDocumentService.reOrder(reOrderRequest).subscribe({
          next: (response:any) => {
            if (response) {
              let filter={
                sort : 'cust',
                active:  this.isShowInActive ? 'A' : 'Y',
              }
              this.loadFolderFile(filter);
              this.loaderService.hide();
              this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
            }
          },
          error: (err) => {
            let filter={
              sort : true,
              active:  this.isShowInActive ? 'A' : 'Y'
            }
            this.loadFolderFile(filter);
            this.showHideSnackBar(SnackBarNotificationType.ERROR, '');
            this.loaderService.hide();
          },
        })
      }

      saveGridState(sortType:string){
        this.showLoader()
        this.uploadFormandDocumentService.saveGridState(sortType).subscribe({
          next: (response:any) => {
            if (response) {
              this.loaderService.hide();
              this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
            }
          },
          error: (err) => {
            this.showHideSnackBar(SnackBarNotificationType.ERROR, '');
            this.loaderService.hide();
          },
        })
      }

      getGridState(){
        this.showLoader()
        this.uploadFormandDocumentService.getGridState().subscribe({
          next: (response:any) => {
            if (response) {
              this.gridStateSubject.next(response);
              this.loaderService.hide();
            }
          },
          error: (err) => {
            this.showHideSnackBar(SnackBarNotificationType.ERROR, '');
            this.loaderService.hide();
          },
        })
      }
      deactiveTemplateStatus(payload:any){
          this.loaderService.show();
          this.uploadFormandDocumentService.updateStatus(payload).subscribe({
           next: (response:any) => {
             if(response){
              this.deActiveTemplateSubject.next(true);
              this.loaderService.hide();
             }
             this.isActiveSubscription();
             this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS,response.message);
           },
           error: (err) => {
             this.loaderService.hide();
             this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
           },
         });
      }

      reactiveTemplateStatus(payload:any){
          this.loaderService.show();
          this.uploadFormandDocumentService.updateStatus(payload).subscribe({
           next: (response:any) => {
             if(response){
              this.reActiveTemplateSubject.next(true);
                this.isActiveSubscription();
                  this.loaderService.hide();
             }
             this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, response.message);
           },
           error: (err) => {
             this.loaderService.hide();
             this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
           },
         });
      }

      isActiveSubscription(){
      
              this.isActive$.subscribe({
                next :(data) =>{
                  this.filter1.active = data ? 'A' : 'Y',
                  this.loadFolderFile(this.filter1);
                }
              })
             }
}
