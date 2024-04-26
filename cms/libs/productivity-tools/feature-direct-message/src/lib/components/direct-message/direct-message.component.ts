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
   private notificationReminderDialog: any;
   disableChatInput = false;
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
      if(!res.communicationDetails){
        this.messages = []
        this.showChatLoader = false;
        this.groupedMessages = undefined
        this.disableChatInput = true;
        this.changeDetection.detectChanges()  
        return;
      } 
      this.communicationDetails = res.communicationDetails;
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
      console.log('on message recieved')
      this.addMessage(state)
      
      
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

  // cwAddMessage(data: any) {
  //   console.log(data);
  //   this.addMessage(data)
  //   this.caseWorkerSentMessage = false;
  // }

  // clientAddMessage(data:any){
  //   console.log('in client')
  //   this.addMessage(data)
  // }

  addMessage(data:any){
    if (!this.messages.some(x => x.id == data.id)) {
    
      let msg = undefined;
      if(this.checkJson(data.message)) {
        let parsed = JSON.parse(data.message);
        var mesg =this.checkJson(parsed.message)? JSON.parse(parsed.message) : parsed.message
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
      console.log(this.messages)
      this.groupedMessages = this.groupBy(this.messages, (pet:any) => pet.pipedCreatedOn)
      this.scrollToBottom()
      this.changeDetection.detectChanges()
     

    }
  }

  async sendMessage() {
   
    if (!this.sendMsg.message) {
      return;
    }else{
      var message ={ message : this.sendMsg.message,
               loginUserId :  this.communicationDetails.loginUserId
      }
    const messageContent: ChatMessageContent = {
      message:  JSON.stringify(message)
    };
    this.directMessageFacade.sendMessage({
                    content: JSON.stringify(messageContent),
                    senderDisplayName: this.communicationDetails.loginUserName,
                    type: 'text',
                    userToken : this.communicationDetails.token,
                    threadId: this.threadId,
                    clientCommunicationUserId : this.communicationDetails.clientUsercommunicationUserId, 
                    clientDisplayName : this.communicationDetails.clientUserName
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
          console.log(parsed)
          console.log(messageObj)
          var mesg =this.checkJson(parsed.message)? JSON.parse(parsed.message) : parsed.message
          if (messageObj) {
            messageObj  = {
              id: message.id,
              sender: message.senderDisplayName,
              message: mesg.message,
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
              message: mesg.message ?? mesg.message,
              isOwner: message.sender.communicationUserId == this.communicationDetails.loginUserCommunicationUserId,
              createdOn: message.createdOn,
              formattedCreatedOn :  this.intl.formatDate(message.createdOn,this.dateFormat),
              pipedCreatedOn: this.datePipe.transform(message.createdOn,'EEEE, MMMM d, y'),
              image: parsed.attachments ? parsed.attachments[0].url.split('/').pop() : undefined,
              attachments: (parsed && parsed?.attachments)? parsed?.attachments : undefined,
              loginUserId : mesg.loginUserId,
              senderDisplayName : message.senderDisplayName
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
              senderDisplayName : message.senderDisplayName
            };
            this.messages.push(msg);
          }
        }
      }


    }
    this.messages = this.messages.sort((a:any, b:any) => a.createdOn!.getTime() - b.createdOn!.getTime());
    console.log(this.messages)
    
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
  this.directMessageFacade.uploadDocument$.subscribe((res:any) =>{
    var message ={ message : "",
      loginUserId :  this.communicationDetails.loginUserId
}
      const attachmentMessageContent: ChatMessageContent = {
        message: JSON.stringify(message),
        attachments: [
          {
            attachmentType: 'image',
            url: res.filePath,
            id:  res.fileName
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
    });
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



download(attachment:any){
  this.directMessageFacade.downloadAttachmentLoader$.subscribe((res:boolean)=>{
    this.downloadAttachmentLoader = res;
    this.changeDetection.detectChanges()
  })
  this.directMessageFacade.downloadChatAttachment(attachment.id, attachment.url)
}
}


