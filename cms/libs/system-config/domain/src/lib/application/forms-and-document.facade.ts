/** Angular **/
import { Injectable } from '@angular/core';
import { FormsAndDocumentDataService } from '../infrastructure/forms-and-document.data.service';
import { BehaviorSubject } from 'rxjs';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';


@Injectable({ providedIn: 'root' })
export class FormsAndDocumentFacade {
  private formsDocumentSubject = new BehaviorSubject<any>([]);
  formsDocument$ =  this.formsDocumentSubject.asObservable();

    constructor( private readonly uploadFormandDocumentService:FormsAndDocumentDataService,
    private readonly loggingService: LoggingService,
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

        this.uploadFormandDocumentService.addFolder(payLoad).subscribe({
          next: (Response) => {
            this.formsDocumentSubject.next(Response);
            if (Response) {
            } 
          },
          error: (err) => {
            this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  
          },
        })
      }

}
