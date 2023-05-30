/** Angular **/
import { Injectable } from '@angular/core';
import { NotificationSnackbarService,SnackBarNotificationType,LoggingService,LoaderService } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class SnackbarDataService {
  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {      
    
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.snackbarService.manageSnackBar(type,subtitle)
    this.hideLoader();   
  }

  hideLoader()
  {
    this.loaderService.hide();
  }
  /** Constructor **/
  constructor(private readonly snackbarService : NotificationSnackbarService,
    private loggingService : LoggingService,
    private readonly loaderService: LoaderService) {}
  
}
