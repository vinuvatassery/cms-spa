/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService } from '../application/services/app-loader.service';
import { LoggingService } from '../api/services/logging.service';
import { NotificationSnackbarService } from '../application/services/notification-snackbar-service';
import { SnackBarNotificationType } from '../enums/snack-bar-notification-type.enum';
import { ApiType } from '../enums/api-type.enum';
import { DocumentDataService } from '../infrastructure/document.data.service';
import { Subject } from 'rxjs';
/** External libraries **/

@Injectable({ providedIn: 'root' })
export class DocumentFacade {

    private exportButtonShowSubject = new Subject<any>();
    exportButtonShow$ = this.exportButtonShowSubject.asObservable();

    /** Constructor**/
    constructor(
        private readonly documentDataService: DocumentDataService,
        private readonly loaderService: LoaderService,
        private readonly loggingService: LoggingService,
        private readonly snackbarService: NotificationSnackbarService
       ) { }

    /** Public methods **/
    showSnackBar(type: SnackBarNotificationType, subtitle: any) {
        if (type == SnackBarNotificationType.ERROR) {
            const err = subtitle;
            this.loggingService.logException(err)
        }
        this.snackbarService.manageSnackBar(type, subtitle);
    }

    viewOrDownloadFile(isFileViewable: boolean, clientDocumentId: string, documentName: string) {
        if (clientDocumentId === undefined || clientDocumentId === '') {
            return;
        }
        this.loaderService.show()
        this.documentDataService.getClientDocumentsViewDownload(clientDocumentId).subscribe({
            next: (data: any) => {

                const fileUrl = window.URL.createObjectURL(data);
                if (isFileViewable === true) {
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
                this.showSnackBar(SnackBarNotificationType.ERROR, error)
            }
        })
    }

    getExportFile(pageAndSortedRequest : any, path : string , fileName : string, apiType : string = ApiType.CaseApi): void {           
        this.documentDataService.getExportFile(pageAndSortedRequest,path,apiType).subscribe({
          next: (response: any) => {           
            if (response) {      
                this.exportButtonShowSubject.next(true)    
                if(response?.size === 0)
                {
                    this.showSnackBar(SnackBarNotificationType.WARNING, "No data")
                }
                else
                {             
                    const fileUrl = window.URL.createObjectURL(response);                 
                    const documentName = fileName+'.xlsx';         
                    const downloadLink = document.createElement('a');
                    downloadLink.href = fileUrl;
                    downloadLink.download = documentName;             
                    downloadLink.click();     
                }          
            }
          },
          error: (err) => {     
            this.exportButtonShowSubject.next(true)          
            this.showSnackBar(SnackBarNotificationType.ERROR, err)
          },
        });
       
      }
      
    getExportFileForSelection(pageAndSortedRequest: any, path: string, fileName: string, selectedAllPaymentsList: any, batchId? : any, apiType: string = ApiType.CaseApi): void {
        this.documentDataService.getExportFileForSelection(pageAndSortedRequest, path, selectedAllPaymentsList, batchId, apiType).subscribe({
            next: (response: any) => {
                if (response) {
                    const fileUrl = window.URL.createObjectURL(response);
                    this.exportButtonShowSubject.next(true)
                    const documentName = fileName + '.xlsx';
                    const downloadLink = document.createElement('a');
                    downloadLink.href = fileUrl;
                    downloadLink.download = documentName;
                    downloadLink.click();
                }
            },
            error: (err) => {
                this.exportButtonShowSubject.next(true)
                this.showSnackBar(SnackBarNotificationType.ERROR, err)
            },
        });
    }

    viewOrDownloadEventFile(isFileViewable: boolean, eventLogAttachmentId: string, documentName: string) {
        if (eventLogAttachmentId === undefined || eventLogAttachmentId === '') {
            return;
        }
        this.loaderService.show()
        this.documentDataService.getEventtDocumentsViewDownload(eventLogAttachmentId).subscribe({
            next: (data: any) => {

                const fileUrl = window.URL.createObjectURL(data);
                if (isFileViewable === true) {
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
                this.showSnackBar(SnackBarNotificationType.ERROR, error)
            }
        })
    }
}
