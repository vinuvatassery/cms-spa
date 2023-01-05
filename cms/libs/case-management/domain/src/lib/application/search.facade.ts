/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Search } from '../entities/search';
/** Data services **/
import { SearchDataService } from '../infrastructure/search.data.service';
import {  LoggingService, NotificationSnackbarService, SnackBarNotificationType,LoaderService, ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class SearchFacade {
  /** Private properties **/
  private searchSubject = new BehaviorSubject<Search[]>([]);
  private globalSearchedSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  search$ = this.searchSubject.asObservable();
  globalSearched$ = this.globalSearchedSubject.asObservable();
  dateFormat = this.configurationProvider.appSettings.dateFormat;

  /** Constructor**/
  constructor(private readonly searchDataService: SearchDataService,private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService , private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/
  ShowLoader()
  {
    this.loaderService.show();
  }

  HideLoader()
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
    this.HideLoader();   
  }

  loadCaseBySearchText(text : string): void {
    if(text){
      this.searchDataService.loadCaseBySearchText(text).subscribe({
      
        next: (caseBySearchTextResponse) => {
          this.globalSearchedSubject.next(caseBySearchTextResponse);
        }
        ,
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
        },
      });
    }
    else{
      this.globalSearchedSubject.next(null);
    }
  }
}
