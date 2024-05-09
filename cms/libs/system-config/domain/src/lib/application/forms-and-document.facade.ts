/** Angular **/
import { Injectable } from '@angular/core';
import { FormsAndDocumentDataService } from '../infrastructure/forms-and-document.data.service';
import { BehaviorSubject } from 'rxjs';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';


@Injectable({ providedIn: 'root' })
export class FormsAndDocumentFacade {
  private addFolderSubject = new BehaviorSubject<any>([]);
  addNewFolder$ =  this.addFolderSubject.asObservable();
  showLoader() { this.loaderService.show(); }
  hideLoader() { this.loaderService.hide(); }

    constructor( private readonly uploadFormandDocumentService:FormsAndDocumentDataService,
    private readonly loggingService: LoggingService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService) {}

    showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
    {        
        if(type == SnackBarNotificationType.ERROR)
        {
          const err= subtitle;    
          this.loggingService.logException(err)
        }  
          this.notificationSnackbarService.manageSnackBar(type,subtitle)
    }

    addFolder(payLoad :any){
        this.showLoader();
        this.uploadFormandDocumentService.addFolder(payLoad).subscribe({
          next: (Response) =>
        {
            this.addFolderSubject.next(Response);
            if (Response) 
            {
                this.showHideSnackBar(SnackBarNotificationType.SUCCESS,'New Folder added!');
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
