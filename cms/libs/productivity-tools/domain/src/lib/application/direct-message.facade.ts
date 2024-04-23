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
import { ChatClient, ChatThreadClient, ChatThreadItem, ChatThreadProperties } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, parseConnectionString } from '@azure/communication-common';

@Injectable({ providedIn: 'root' })
export class DirectMessageFacade {

    
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueDirectMsg = 'lastMessageTime';
  public sortDirectMsg: SortDescriptor[] = [{
    field: this.sortValueDirectMsg,
  }];

  
  /** Private properties **/
  private directMessagesSubject = new Subject<DirectMessage[]>();
  private directMessagesListSubject = new Subject<any>();
  private communicationDetailSubject = new Subject<any>();
  private communicationDetailLoaderSubject = new Subject<boolean>();
  private sendMessageSubject = new Subject<any>();
  private comminicationTokenSubject = new Subject<any>();
  /** Public properties **/
  directMessages$ = this.directMessagesSubject.asObservable();
  directMessagesLists$ = this.directMessagesListSubject.asObservable();
  communicationDetail$ = this.communicationDetailSubject.asObservable();
  communicationDetailLoader$ = this.communicationDetailLoaderSubject.asObservable();
  sendMessage$ = this.sendMessageSubject.asObservable();
  comminicationToken$ = this.comminicationTokenSubject.asObservable();
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

  getChatClient(userAccessToken :any): ChatClient{
   var endpoint = parseConnectionString(this.configurationProvider.appSettings.azureCommunication.connectionString).endpoint;
    return new ChatClient(endpoint, new AzureCommunicationTokenCredential(userAccessToken))
  }

  getChatThreadClient(threadId:any, chatClient:ChatClient): ChatThreadClient{
    return chatClient.getChatThreadClient(threadId);
  }
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
  loadDirectMessagesLists(param:any): void {
    this.loaderService.show()
    this.directMessageDataService.loadDirectMessagesLists(param).subscribe({
      next: (Response) => {
        this.loaderService.hide()
        const gridView: any = {
          data: Response.items,
          total:Response.totalCount,
        }; 
        this.directMessagesListSubject.next(gridView);
      },
      error: (err) => {
        this.loaderService.hide()
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  getCommunicationDetails(clientId:string){
  this.directMessageDataService.getCommunicationDetails(clientId).subscribe({
    next: (Response) => {
      this.communicationDetailLoaderSubject.next(true)
      this.communicationDetailSubject.next(Response);
      this.communicationDetailLoaderSubject.next(false)
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
    }
  })
  }
  
  sendMessage(payload:any){
    this.directMessageDataService.sendMessage(payload).subscribe({
      next: (Response) => {
        this.sendMessageSubject.next(Response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      }
    })
  }
  
  getAccessToken(communicationUserId:any){
    this.directMessageDataService.getAccessToken(communicationUserId).subscribe({
      next: (Response) => {
        this.comminicationTokenSubject.next(Response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      }
    })
  }
  uploadAttachments(uploadRequest:any){
    this.directMessageDataService.uploadAttachments(uploadRequest).subscribe({
      next: (Response) => {
      },
      error: (err) => {
        console.error('err', err);
      },
    })
  }
}
