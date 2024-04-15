/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { DirectMessageFacade } from '@cms/productivity-tools/domain';
import { ChatClient, ChatThreadClient, ChatThreadItem, ChatThreadProperties, SendMessageOptions, SendMessageRequest } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, parseConnectionString } from '@azure/communication-common';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';
@Component({
  selector: 'productivity-tools-direct-message',
  templateUrl: './direct-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessageComponent implements OnInit {

  chatClient: ChatClient | any = null;
  tokenCommunicationUserThreadDetails: any;
  clientId = "AED5E0EE-AD19-4DC6-A797-A21A6934A6C3"
  thread: any
  threadId:any
  messages :any[] =[]
  sendMsg: any = { id: '', message: '', sender: '', isOwner: false };
  chatThreadClient: any
  groupedMessages :any
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  constructor(private directMessageFacade: DirectMessageFacade
    , private changeDetection : ChangeDetectorRef
    ,  public intl: IntlService
    ,  private configurationProvider: ConfigurationProvider,) {

  }
  ngOnInit(): void {
    this.directMessageFacade.tokenCommunicationUserIdThreadId$.subscribe(res => {
      console.log(res)
      this.tokenCommunicationUserThreadDetails = res.clientResponse;
      this.threadId = res.threadId
      this.createChat()
      if(this.threadId){
      this.chatThreadClient = this.directMessageFacade.getChatThreadClient(this.threadId, this.chatClient)

        this.getListMessages()
      }
    })
    this.directMessageFacade.getTokenCommunicationUserIdsAndThreadIdIfExist(this.clientId)
  }
  /** Output properties  **/
  @Output() closeAction = new EventEmitter();
  public value = ``;
  /** Public properties **/
  isShownDirectMessage = false;
  messageToolBarShow = false;
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
  /** Internal event methods **/
  onCloseDirectMessageClicked() {
    this.closeAction.emit();
    this.isShownDirectMessage = !this.isShownDirectMessage;
  }

  async createChat() {
    let users = [{
      userId: this.tokenCommunicationUserThreadDetails.clientUsercommunicationUserId,
      userName: this.tokenCommunicationUserThreadDetails.clientUserName
    }, {
      userId: this.tokenCommunicationUserThreadDetails.loginUserCommunicationUserId,
      userName: this.tokenCommunicationUserThreadDetails.loginUserName
    }];
    this.chatClient = this.directMessageFacade.getChatClient(this.tokenCommunicationUserThreadDetails.token);
   if(!this.threadId){
    this.thread = await this.createChatThread(users, `${this.tokenCommunicationUserThreadDetails.clientUsercommunicationUserId + '-' + this.tokenCommunicationUserThreadDetails.loginUserCommunicationUserId}`);
    this.threadId =this.thread.id
    const payload = {
      threadId: this.thread.id,
      clientId: this.clientId,
      cwCommunicationUserID: this.tokenCommunicationUserThreadDetails.loginUserCommunicationUserId,
      clientCommunicationUserId: this.tokenCommunicationUserThreadDetails.clientUsercommunicationUserId,
    }
    this.directMessageFacade.saveChatThreadDetails(payload)
  }

  }

  async createChatThread(users: any[], topicName: string): Promise<ChatThreadProperties> {
    let createChatThreadRequest = {
      topic: topicName
    };
    let createChatThreadOptions = {
      participants: users.map((x) => {
        return {
          id: { communicationUserId: x.userId },
          displayName: x.userName
        }
      }),

    };
    let createChatThreadResult = await this.chatClient.createChatThread(
      createChatThreadRequest,
      createChatThreadOptions
    );
    let threadId = createChatThreadResult.chatThread.id;
    console.log(`Thread created:${threadId}`);

    return createChatThreadResult.chatThread;
  }

  async sendMessage() {
    if (!this.sendMsg.message) {
      return;
    }
    let sendMessageRequest: SendMessageRequest =
    {
      content: this.sendMsg.message
    };
    let sendMessageOptions: SendMessageOptions =
    {
      senderDisplayName: this.tokenCommunicationUserThreadDetails.loginUserName,
      type: 'html',
    };
    console.log(this.threadId)
    console.log(this.chatClient)
    this.chatThreadClient = this.directMessageFacade.getChatThreadClient(this.threadId, this.chatClient)
    const sendChatMessageResult = this.chatThreadClient?.sendMessage(sendMessageRequest, { senderDisplayName: this.tokenCommunicationUserThreadDetails.loginUserName, type: 'text' });
    if (!sendChatMessageResult) {
      return;
    }
    const messageId = sendChatMessageResult.id;
    this.sendMsg = { id: '', message: '', sender: '', isOwner: false };
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

    // Subtract one hour from the current time
    let oneHourBefore = new Date(currentDate.getTime() - (4 * 60 * 60 * 1000));

    console.log(this.chatThreadClient)
    const messages = <any>this.chatThreadClient?.listMessages({startTime: oneHourBefore});

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
              isOwner: message.sender?.communicationUserId == this.tokenCommunicationUserThreadDetails.loginUserCommunicationUserId,
              createdOn: message.createdOn,
              formattedCreatedOn :  this.intl.formatDate(message.createdOn,this.dateFormat),
              image: parsed.attachments ? parsed.attachments[0].url.split('/').pop() : undefined 
            };
          }
          else {
            let msg = {
              id: message.id,
              sender: message.senderDisplayName,
              message: parsed.message ?? parsed.message,
              isOwner: message.sender.communicationUserId == this.tokenCommunicationUserThreadDetails.loginUserCommunicationUserId,
              createdOn: message.createdOn,
              formattedCreatedOn :  this.intl.formatDate(message.createdOn,this.dateFormat),
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
              isOwner: message.sender?.communicationUserId == this.tokenCommunicationUserThreadDetails.loginUserCommunicationUserId,
              createdOn: message.createdOn,
              formattedCreatedOn :  this.intl.formatDate(message.createdOn,this.dateFormat)
            };
          }
          else {
            let msg = {
              id: message.id,
              sender: message.senderDisplayName,
              message: message.content.message,
              isOwner: message.sender.communicationUserId == this.tokenCommunicationUserThreadDetails.loginUserCommunicationUserId,
              createdOn: message.createdOn,
              formattedCreatedOn :  this.intl.formatDate(message.createdOn,this.dateFormat)
            };
            this.messages.push(msg);
          }
        }
      }
    }
    this.messages = this.messages.sort((a:any, b:any) => a.createdOn!.getTime() - b.createdOn!.getTime());
    this.changeDetection.detectChanges();
    console.log(this.messages)
     this.groupedMessages = this.groupBy(this.messages, (pet:any) => pet.formattedCreatedOn)
    console.log(this.groupedMessages)

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



}
