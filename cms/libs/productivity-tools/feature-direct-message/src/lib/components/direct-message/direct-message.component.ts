/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  OnInit,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { take,Subscription, first } from 'rxjs';
import { DirectMessageFacade } from '@cms/productivity-tools/domain';
import { ChatClient,ChatMessageContent } from '@azure/communication-chat';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { CaseFacade } from '@cms/case-management/domain';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'productivity-tools-direct-message',
  templateUrl: './direct-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe]
})

export class DirectMessageComponent implements OnInit {
  @ViewChild('UploadDocumentInDirectMessage', { read: TemplateRef })
  UploadDocumentInDirectMessage!: TemplateRef<any>;
  chatClient: ChatClient | any = null;
  communicationDetails: any;
  clientId :any
  thread: any
  threadId:any
  messages :any[] =[]
  skeletonCounts = [1,2,3]
  sendMsg: any = { id: '', message: '', sender: '', isOwner: false };
  keys:any[]=[]
  groupedMessages :any
  eid!:any;
  directMessageLoader = false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  clientName=""
  threadCreationTime:any
  @ViewChild('scrollMe') private myScrollContainer?: ElementRef;
  tokenSubscription! :Subscription
   /** Output properties  **/
   @Output() closeAction = new EventEmitter();
   public value = ``;
   showDataLoader = false;
   downloadAttachmentLoader = false;
   chatThreadClient:any
   placeHolderText ="Direct Message"
  forFirstTime =0
  showLoader = false;
  showChatLoader = true;
   /** Public properties **/
   isShownDirectMessage = false;
   messageToolBarShow = false;
   dataLoaderSubscription$! : Subscription
   directMessageSubscription$! : Subscription
  clientProfileSubscription$! : Subscription
  clientProfileLoaderSubscription!:Subscription
  uploadDocumentSubscription!:Subscription
   private notificationReminderDialog: any;
   disableChatInput = false;
   /** Public properties **/
   outOfscheduleData : any;
   uploadDocumentTypeDetails:any;
   ListModel = [
    {
      text: "Attach From Forms & Documents",
      id:'from_System'
    },
    {
      text: "Attach From Computer",
      id:'from_Computer'
    },
    {
      text: "Attach From Client's Attachment",
      id:'from_Client'
    }];

   ListItemModel = [
     {
       text: "Attach from System",
     },
     {
       text: "Attach from Computer",
     },
     {
       text: "Attach from Client’s Attachments",
     },

   ];
  constructor(private directMessageFacade: DirectMessageFacade
    , private changeDetection : ChangeDetectorRef
    ,  public intl: IntlService
    ,  private configurationProvider: ConfigurationProvider
    , private route : ActivatedRoute
    , private caseFacade : CaseFacade
    , private datePipe : DatePipe
    ,private dialogService: DialogService
    , private renderer: Renderer2) {
  }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe((params :any) =>{
      let id =  params.get('id')
      if(id== this.clientId){
        return;
      }
      this.clientId = params.get('id')
      this.eid = params.get('e_id')
      this.showChatLoader = true;
      if(this.clientId){
        if(this.chatClient){
        this.chatClient.stopRealtimeNotifications()
        }
        this.clientProfileSubscription$?.unsubscribe()
        this.clientProfileSubscription$ =   this.caseFacade.clientProfileData$.pipe(take(1)).subscribe((cp :any) =>{
          this.clientName = cp?.firstName
          this.placeHolderText = "Direct Message" +" "+this.clientName+"..."
       })
       this.caseFacade.loadClientProfileWithOutLoader(this.eid);
       this.clientProfileLoaderSubscription?.unsubscribe()
       this.disableChatInput = false;
       this.clientProfileLoaderSubscription =this.caseFacade.clientProfileDataLoader$.subscribe(res =>{
        this.showLoader = res;
        this.changeDetection.detectChanges()
      })
       this.dataLoaderSubscription$?.unsubscribe()
       this.dataLoaderSubscription$ = this.directMessageFacade.communicationDetailLoader$.subscribe((res:boolean) =>{
        this.showDataLoader = res;
       })
       this.directMessageSubscription$?.unsubscribe()
     this.directMessageSubscription$ =  this.directMessageFacade.communicationDetail$.pipe(take(1)).subscribe((res:any) => {
      if(!res?.communicationDetails){
        this.messages = []
        this.showChatLoader = false;
        this.groupedMessages = undefined
        this.disableChatInput = true;
        this.changeDetection.detectChanges()
        return;
      }
      this.communicationDetails = res.communicationDetails;
      this.outOfscheduleData = res.outOfscheduleData;
        this.threadId = res.threadId
        this.threadCreationTime = res.creationTime
        this.chatClient = this.directMessageFacade.getChatClient(res.communicationDetails?.token)
        this.setupHandlers()

        this.changeDetection.detectChanges()
        this.showChatLoader = false
      })
          this.directMessageFacade.getCommunicationDetails(this.clientId)

      }
     })

  }


  /** Internal event methods **/

  onCloseDirectMessageClicked() {
    this.closeAction.emit();
    this.isShownDirectMessage = !this.isShownDirectMessage;
  }

  async setupHandlers() {
    this.getListMessages();
    await this.chatClient.startRealtimeNotifications();
    this.chatClient.on("chatMessageReceived", ((state: any) => {
      this.addMessage(state)
    }).bind(this));

    this.chatClient.on("chatMessageEdited", ((state: any) => {
      this.getListMessages();
    }).bind(this));
    this.chatClient.on("chatMessageDeleted", ((state: any) => {
      this.getListMessages();
    }).bind(this));
    this.chatClient.on("typingIndicatorReceived", ((state: any) => {
    }).bind(this));
    this.chatClient.on("readReceiptReceived", ((state: any) => {
      this.getListMessages();
    }).bind(this));
    this.chatClient.on("chatThreadCreated", ((state: any) => {
      this.getListMessages();
    }).bind(this));
    this.chatClient.on("chatThreadDeleted", ((state: any) => {
      this.getListMessages();
    }).bind(this));
    this.chatClient.on("chatThreadPropertiesUpdated", ((state: any) => {
      this.getListMessages();
    }).bind(this));
    this.chatClient.on("participantsAdded", ((state: any) => {
      this.getListMessages();
    }).bind(this));
    this.chatClient.on("participantsRemoved", ((state: any) => {
      this.getListMessages();
    }).bind(this));
  }

  addMessage(data:any){
    if (!this.messages.some(x => x.id == data.id)) {
      let msg = undefined;
      if(this.checkJson(data.message)) {
        let parsed = JSON.parse(data.message);
        let mesg =this.checkJson(parsed.message)? JSON.parse(parsed.message) : parsed.message
        msg = {
          id: data.id,
          sender: data.senderDisplayName,
          message: mesg.message,
          isOwner: data.sender.communicationUserId == this.communicationDetails.loginUserCommunicationUserId,
          createdOn: data.createdOn,
          image: (parsed && parsed?.attachments)? parsed?.attachments[0].url.split('/').pop() : null,
          attachments: (parsed && parsed?.attachments)? parsed?.attachments : undefined,
          loginUserId : mesg.loginUserId,
          senderDisplayName : data.senderDisplayName,
          formattedCreatedOn :  this.intl.formatDate(data.createdOn,this.dateFormat),
          pipedCreatedOn: this.datePipe.transform(data.createdOn,'EEEE, MMMM d, y'),
          showDownloadLoader : false
        };
      }
      else {
        msg = {
          id: data.id,
          sender: data.senderDisplayName,
          message: data.message,
          isOwner: data.sender.communicationUserId == this.communicationDetails.loginUserCommunicationUserId,
          createdOn: data.createdOn,
      };
    }
      this.messages.push(msg);
      this.groupedMessages = this.groupBy(this.messages, (pet:any) => pet.pipedCreatedOn)
      this.scrollToBottom()
      this.changeDetection.detectChanges()
    }
  }

  async sendMessage() {

    if (!this.sendMsg.message) {
      return;
    }else{
      let message ={ message : this.sendMsg.message,
               loginUserId :  this.communicationDetails.loginUserId
      }
    const messageContent: ChatMessageContent = {
      message:  JSON.stringify(message)
    };

    let clientMessage ={ message : "Hi I received your message.",
      loginUserId :  this.communicationDetails.clientUsercommunicationUserId
}
const clientMessageContent: ChatMessageContent = {
message:  JSON.stringify(clientMessage)
};
    this.directMessageFacade.sendMessage({
                    content: JSON.stringify(messageContent),
                    senderDisplayName: this.communicationDetails.loginUserName,
                    type: 'text',
                    userToken : this.communicationDetails.token,
                    threadId: this.threadId,
                    clientCommunicationUserId : this.communicationDetails.clientUsercommunicationUserId,
                    clientDisplayName : this.communicationDetails.clientUserName,
                    clientMessage : JSON.stringify(clientMessageContent)
                  })
    }
    this.sendMsg.message =""
}


  checkJson(jsonString:string) {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }

   async getListMessages() {
      this.messages = [];
    this.chatThreadClient = this.chatClient.getChatThreadClient(this.threadId);
   const messages = this.chatThreadClient?.listMessages({});
    if (!messages) {
      return;
    }
    await this.prepareMessageList(messages)
    this.messages.sort((a: any, b: any) => a.sequenceId - b.sequenceId);
    const sortedMessages = this.messages;
    this.changeDetection.detectChanges();
     this.groupedMessages = this.groupBy(sortedMessages, (pet:any) => pet.pipedCreatedOn)
    this.keys =  Object.keys(this.groupedMessages).sort()
    this.scrollToBottom()
    this.changeDetection.detectChanges()

  }

  getParsedMessage(parsedContent :any){
   return this.checkJson(parsedContent.message)? JSON.parse(parsedContent.message) : parsedContent.message
  }

  getImageFromParsedContent(parsedContent :any){
    return parsedContent.attachments ? parsedContent.attachments[0].url.split('/').pop() : undefined
  }

  getAttachmentFromParsedContent(parsedContent:any){
    return  (parsedContent && parsedContent?.attachments)? parsedContent?.attachments : undefined
  }
  async prepareMessageList(messages :any){
    
    for await (const message of messages) {
      if (message.type == "text") {
        let messageObj = this.messages.find((x:any) => x.id == message.id);
        if (!messageObj) {
        if(this.checkJson(message.content.message)) {
          let parsedContent = JSON.parse(message.content.message);
          let mesg = this.getParsedMessage(parsedContent)
    
            let msg = {
              id: message.id,
              sequenceId :message.sequenceId,
              sender: message.senderDisplayName,
              message: mesg.message,
              isOwner: message.sender.communicationUserId == this.communicationDetails.loginUserCommunicationUserId,
              createdOn: message.createdOn,
              formattedCreatedOn :  this.intl.formatDate(message.createdOn,this.dateFormat),
              pipedCreatedOn: this.datePipe.transform(message.createdOn,'EEEE, MMMM d, y'),
              image: this.getImageFromParsedContent(parsedContent),
              attachments: this.getAttachmentFromParsedContent(parsedContent),
              loginUserId : mesg.loginUserId,
              senderDisplayName : message.senderDisplayName
            };
            this.messages.push(msg);
          
        }
        else {
       
            let msg = {
              id: message.id,
              sequenceId :message.sequenceId,
              sender: message.senderDisplayName,
              message: message.content.message,
              isOwner: message.sender.communicationUserId == this.communicationDetails.loginUserCommunicationUserId,
              createdOn: message.createdOn,
              formattedCreatedOn :  this.intl.formatDate(message.createdOn,this.dateFormat),
              pipedCreatedOn: this.datePipe.transform(message.createdOn,'EEEE, MMMM d, y'),
              senderDisplayName : message.senderDisplayName
            };
            this.messages.push(msg);
          }
        }
      }
      }
    }

   mySortingFunction = (a :any, b:any) => {
    return a.value?.sequenceId- b.value?.sequenceId;
  }

  getVlauesWithKey(value :any[] | unknown) {
    return value as unknown as any[] //NOSONAR
  }

   groupBy(list:any[], keyGetter:any) {
    const map = new Map();
    list.forEach((item:any) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
   }

getKey(item:any){
  return item as unknown as any
}
onUploadDocumentsOpenClicked(template: TemplateRef<unknown>, event:any): void {
  this.uploadDocumentTypeDetails = event;
  this.notificationReminderDialog = this.dialogService.open({
    content: template,
    cssClass:
      'app-c-modal app-c-modal-md app-c-modal-np',
  });

}


onUploadDocumentsClosed(event: any) {
  this.notificationReminderDialog.close();
}
getUploadedDocuments(uploadedRequest:any){
  this.uploadDocumentSubscription?.unsubscribe()
  this.uploadDocumentSubscription = this.directMessageFacade.uploadDocument$
  .pipe(first((res: any) => res != null))
  .subscribe((res:any) =>{
    let message ={ message : "",
      loginUserId :  this.communicationDetails.loginUserId
}
      let filepaths = res.filePath.split('$')
      let fileName = filepaths[filepaths.length -1]
      const attachmentMessageContent: ChatMessageContent = {
        message: JSON.stringify(message),
        attachments: [
          {
            attachmentType: 'image',
            url: res.filePath,
            id:  fileName
          },
        ],
      };
      let clientMessage ={ message : "Hi I received your message.",
      loginUserId :  this.communicationDetails.clientUsercommunicationUserId
}
const clientMessageContent: ChatMessageContent = {
message:  JSON.stringify(clientMessage)
};
       this.directMessageFacade.sendMessage(
        {
        content: JSON.stringify(attachmentMessageContent),
        senderDisplayName: this.communicationDetails.loginUserName,
        type: 'text',
        threadId: this.threadId,
        userToken : this.communicationDetails.token,
        clientCommunicationUserId : this.communicationDetails.clientUsercommunicationUserId,
                    clientDisplayName : this.communicationDetails.clientUserName,
                    clientMessage : JSON.stringify(clientMessageContent)
      }
    );
    });
  this.directMessageFacade.uploadAttachments(uploadedRequest,this.threadId);
}


scrollToBottom(): void {
  try {

    setTimeout(() => {
      if (this.myScrollContainer && this.myScrollContainer.nativeElement) {
        this.renderer.setProperty(this.myScrollContainer.nativeElement, 'scrollTop', this.myScrollContainer.nativeElement.scrollHeight);
      }
    }, 0);

  } catch (err) { }
}


download(value :any, attachment:any){
  value.showDownloadLoader = true;
  this.directMessageFacade.downloadAttachmentLoader$.subscribe((res:boolean)=>{
    this.downloadAttachmentLoader = res;
    this.changeDetection.detectChanges()
    value.showDownloadLoader = false;
  })
  this.directMessageFacade.downloadChatAttachment(attachment.id, attachment.url)
}
}


