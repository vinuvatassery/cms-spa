/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
/** Entities **/
import { DirectMessage } from '../entities/direct-message';
/** Data services **/
import { DirectMessageDataService } from '../infrastructure/direct-message.data.service';

@Injectable({ providedIn: 'root' })
export class DirectMessageFacade {

    
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueDirectMsg = 'batch';
  public sortDirectMsg: SortDescriptor[] = [{
    field: this.sortValueDirectMsg,
  }];

  
  /** Private properties **/
  private directMessagesSubject = new Subject<DirectMessage[]>();
  private directMessagesListSubject = new Subject<any>();

  /** Public properties **/
  directMessages$ = this.directMessagesSubject.asObservable();
  directMessagesLists$ = this.directMessagesListSubject.asObservable();

   // handling the snackbar & loader
   snackbarMessage!: SnackBar;
   snackbarSubject = new Subject<SnackBar>(); 
 
   showLoader() { this.loaderService.show(); }
   hideLoader() { this.loaderService.hide(); }
 
   errorShowHideSnackBar( subtitle : any)
   {
     this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR,subtitle, NotificationSource.UI)
   }
   showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
     if (type == SnackBarNotificationType.ERROR) {
       const err = subtitle;
       this.loggingService.logException(err)
     }
     this.notificationSnackbarService.manageSnackBar(type, subtitle)
     this.hideLoader();
   }


  /** Constructor **/
  constructor(
    private readonly directMessageDataService: DirectMessageDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) {}

  /** Public methods **/
  loadDirectMessages(): void {
    this.directMessageDataService.loadDirectMessages().subscribe({
      next: (directMessageResponse) => {
        this.directMessagesSubject.next(directMessageResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  loadDirectMessagesLists(): void {
    this.directMessageDataService.loadDirectMessagesLists().subscribe({
      next: (Response) => {
        this.directMessagesListSubject.next(Response);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
