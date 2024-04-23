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
  Renderer2,
  DoCheck
} from '@angular/core';
import { take,Subscription } from 'rxjs';
import { DirectMessageFacade } from '@cms/productivity-tools/domain';
import { ChatClient, ChatThreadClient,ChatMessageContent, ChatThreadItem, ChatThreadProperties, SendMessageOptions, SendMessageRequest } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, parseConnectionString } from '@azure/communication-common';
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
  sendMsg: any = { id: '', message: '', sender: '', isOwner: false };
  keys:any[]=[]
  groupedMessages :any
  eid!:any
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  clientName=""
  threadCreationTime:any
  @ViewChild('scrollMe') private myScrollContainer?: ElementRef;
  tokenSubscription! :Subscription
   /** Output properties  **/
   @Output() closeAction = new EventEmitter();
   public value = ``;
   showDataLoader = false;
   chatThreadClient:any
   placeHolderText ="Direct Message"
   skeletonCounts = [
    1, 2 ,3,4,5,6
  ]
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
   private notificationReminderDialog: any;

   /** Public properties **/
 
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
      this.clientId = params.get('id')
      this.eid = params.get('e_id')
      if(this.clientId){
        this.clientProfileSubscription$?.unsubscribe()
        this.clientProfileSubscription$ =   this.caseFacade.clientProfileData$.pipe(take(1)).subscribe((cp :any) =>{
          this.clientName = cp?.firstName
          this.placeHolderText = "Direct Message" +" "+this.clientName+"..."
       })
       this.caseFacade.loadClientProfileWithOutLoader(this.eid);
       this.clientProfileLoaderSubscription?.unsubscribe()
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
      if(!res){
        this.messages = []
        this.showChatLoader = false;
        this.groupedMessages = undefined
        this.changeDetection.detectChanges()  
        return;
      } 
      this.communicationDetails = res.communicationDetails;
        this.threadId = res.threadId
        this.threadCreationTime = res.creationTime
        this.chatClient = this.directMessageFacade.getChatClient(this.communicationDetails?.token)
        this.setupHandlers()
        this.showChatLoader = false
        this.changeDetection.detectChanges()     
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
    this.forFirstTime =0;
    this.chatClient.on("chatMessageReceived", ((state: any) => {
      this.addMessage(state);
        this.sendMessageonBehalfOfClient(state)
      
    }).bind(this));

    this.chatClient.on("chatMessageEdited", ((state: any) => {
      this.getListMessages();
    }).bind(this));
    this.chatClient.on("chatMessageDeleted", ((state: any) => {
      this.getListMessages();
    }).bind(this));
    this.chatClient.on("typingIndicatorReceived", ((state: any) => {
      console.log('TypingIndicatorReceived: ' + state.senderDisplayName)
      console.log('CommunicationUser: ' + this.communicationDetails.loginUserCommunicationUserId,)
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

  addMessage(data: any) {
    console.log(data);

    if (!this.messages.some(x => x.id == data.id)) {
      let msg = undefined;
      if(this.checkJson(data.message)) {
        let parsed = JSON.parse(data.message);
        msg = {
          id: data.id,
          sender: data.senderDisplayName,
          message: parsed.message,
          isOwner: data.sender.communicationUserId == this.communicationDetails.loginUserCommunicationUserId,
          createdOn: data.createdOn,
          image: (parsed && parsed?.attachments)? parsed?.attachments[0].url.split('/').pop() : null
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
    let fileURL = "hi its a text";
    if (this.sendMsg.file) { 
      const attachmentMessageContent: ChatMessageContent = {
        message: this.sendMsg.message,
        attachments: [
          {
            attachmentType: 'image',
            url: fileURL,
            id: fileURL
          },
        ],
      };

       this.directMessageFacade.sendMessage(
        {
        content: JSON.stringify(attachmentMessageContent),
        senderDisplayName: this.communicationDetails.loginUserName,
        type: 'text',
        threadId: this.threadId,
        userToken : this.communicationDetails.token
      }
    );
    }
    if (!this.sendMsg.message) {
      return;
    }else{
    const messageContent: ChatMessageContent = {
      message: this.sendMsg.message
    };
    this.directMessageFacade.sendMessage({
                    content: JSON.stringify(messageContent),
                    senderDisplayName: this.communicationDetails.loginUserName,
                    type: 'text',
                    userToken : this.communicationDetails.token,
                    threadId: this.threadId,
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

      let currentDate = new Date();

   //Subtract one hour from the current time
    let oneHourBefore = new Date(currentDate.getTime() - (4 * 60 * 60 * 1000));
    this.chatThreadClient = this.chatClient.getChatThreadClient(this.threadId);
   const messages = <any>this.chatThreadClient?.listMessages({startTime: this.threadCreationTime});

     console.log(messages)
    if (!messages) {
      return;
    }

     for await (const message of messages) {     
         if (message.type == "text") {
        let messageObj = this.messages.find((x:any) => x.id == message.id);
        if(this.checkJson(message.content.message)) {
          let parsed = JSON.parse(message.content.message);
          if (messageObj) {
            messageObj  = {
              id: message.id,
              sender: message.senderDisplayName,
              message: parsed.message,
              isOwner: message.sender?.communicationUserId == this.communicationDetails.loginUserCommunicationUserId,
              createdOn: message.createdOn,
              formattedCreatedOn :  this.intl.formatDate(message.createdOn,this.dateFormat),
              pipedCreatedOn: this.datePipe.transform(message.createdOn,'EEEE, MMMM d, y'),
              image: parsed.attachments ? parsed.attachments[0].url.split('/').pop() : undefined 
            };
          }
          else {
            let msg = {
              id: message.id,
              sender: message.senderDisplayName,
              message: parsed.message ?? parsed.message,
              isOwner: message.sender.communicationUserId == this.communicationDetails.loginUserCommunicationUserId,
              createdOn: message.createdOn,
              formattedCreatedOn :  this.intl.formatDate(message.createdOn,this.dateFormat),
              pipedCreatedOn: this.datePipe.transform(message.createdOn,'EEEE, MMMM d, y'),
              image: parsed.attachments ? parsed.attachments[0].url.split('/').pop() : undefined 
            };
            this.messages.push(msg);
          }
        }
        else {
          if (messageObj) {
            messageObj = {
              id: message.id,
              sender: message.senderDisplayName,
              message: message.content?.message,
              isOwner: message.sender?.communicationUserId == this.communicationDetails.loginUserCommunicationUserId,
              createdOn: message.createdOn,
              formattedCreatedOn :  this.intl.formatDate(message.createdOn,this.dateFormat),
              pipedCreatedOn: this.datePipe.transform(message.createdOn,'EEEE, MMMM d, y'),
            };
          }
          else {
            let msg = {
              id: message.id,
              sender: message.senderDisplayName,
              message: message.content.message,
              isOwner: message.sender.communicationUserId == this.communicationDetails.loginUserCommunicationUserId,
              createdOn: message.createdOn,
              formattedCreatedOn :  this.intl.formatDate(message.createdOn,this.dateFormat),
              pipedCreatedOn: this.datePipe.transform(message.createdOn,'EEEE, MMMM d, y'),
            };
            this.messages.push(msg);
          }
        }
      }
    }
    this.messages = this.messages.sort((a:any, b:any) => a.createdOn!.getTime() - b.createdOn!.getTime());
    this.changeDetection.detectChanges();
     this.groupedMessages = this.groupBy(this.messages, (pet:any) => pet.pipedCreatedOn)
    this.keys =  Object.keys(this.groupedMessages).sort()
    this.scrollToBottom()
    this.changeDetection.detectChanges()
   }

   mySortingFunction = (a :any, b:any) => {
    return new Date(a.key).getTime()-new Date(b.key).getTime();
  }

  getVlauesWithKey(value :any[] | unknown){
    return value as unknown as any[]
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
  console.log(this.uploadDocumentTypeDetails);
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
  this.directMessageFacade.uploadAttachments(uploadedRequest);
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


async sendMessageonBehalfOfClient(state :any) {
  
  if(state.senderDisplayName == this.communicationDetails?.clientUserName){
  return;
  }
   else{
    this.tokenSubscription?.unsubscribe()
    this.tokenSubscription = this.directMessageFacade.comminicationToken$.subscribe(res =>{
    this.directMessageFacade.sendMessage({
      content: "Event has been logged",
      senderDisplayName: this.communicationDetails.clientUserName,
      type: 'text',
      userToken : res.token,
      threadId: this.threadId,
     });
   })
   this.directMessageFacade.getAccessToken(this.communicationDetails.clientUsercommunicationUserId)
  }
}

}


