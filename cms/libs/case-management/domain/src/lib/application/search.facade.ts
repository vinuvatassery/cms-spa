/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Search } from '../entities/search';
/** Data services **/
import { SearchDataService } from '../infrastructure/search.data.service';
import {  LoggingService, NotificationSnackbarService, SnackBarNotificationType,LoaderService } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class SearchFacade {
  /** Private properties **/
  private searchSubject = new BehaviorSubject<Search[]>([]);
  private globalSearchedSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  search$ = this.searchSubject.asObservable();
  globalSearched$ = this.globalSearchedSubject.asObservable();

  /** Constructor**/
  constructor(private readonly searchDataService: SearchDataService,private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService ,) {}

  /** Public methods **/
  ShowLoader()
  {
    this.loaderService.show();
  }

  HideLoader()
  {
    this.loaderService.hide();
  }

  ShowHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.HideLoader();   
  }

  loadCaseByHeaderSearchText(text : string): void {
    if(text){
      this.searchDataService.loadCaseByHeaderSearchText(text).subscribe({
      
        next: (caseBySearchTextResponse) => {
          this.globalSearchedSubject.next(caseBySearchTextResponse);
        }
        ,
        error: (err) => {
          this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)    
        },
      });
    }
    else{
      this.globalSearchedSubject.next(null);
    }
  }
}
