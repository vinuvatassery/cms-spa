/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { SearchDataService } from '../infrastructure/search.data.service';
import {  LoggingService, NotificationSnackbarService, SnackBarNotificationType,LoaderService, ConfigurationProvider } from '@cms/shared/util-core';
import { CaseDataService } from '../infrastructure/case.data.service';

@Injectable({ providedIn: 'root' })
export class SearchFacade {
  /** Private properties **/
  private clientSearchSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  clientSearch$ = this.clientSearchSubject.asObservable();
  dateFormat = this.configurationProvider.appSettings.dateFormat;

  /** Constructor**/
  constructor(private readonly searchDataService: SearchDataService,private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService , private configurationProvider : ConfigurationProvider,
    private readonly caseDataService: CaseDataService) {}

  /** Public methods **/
  showLoader()
  {
    this.loaderService.show();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }

  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.hideLoader();   
  }

  loadCaseBySearchText(text : string,skip: number,take :number): void {
    if(text){
      this.caseDataService.loadCaseBySearchText(text,skip,take).subscribe({
      
        next: (caseBySearchTextResponse) => {
          this.clientSearchSubject.next(caseBySearchTextResponse);
        }
        ,
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
        },
      });
    }
    else{
      this.clientSearchSubject.next(null);
    }
  }
}
