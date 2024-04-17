/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'productivity-tools-direct-message',
  templateUrl: './direct-message.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessageComponent {
  @ViewChild('UploadDocumentInDirectMessage', { read: TemplateRef })
  UploadDocumentInDirectMessage!: TemplateRef<any>;
  /** Output properties  **/
  @Output() closeAction = new EventEmitter();
  private notificationReminderDialog: any;
  public value = ``;
  /** Public properties **/
  isShownDirectMessage = false;
  uploadDocumentTypeDetails:any;
  messageToolBarShow = false;
  ListItemModel = [
    {
      text: "Attach from System", 
      id:'from_System'
    },
    {
      text: "Attach from Computer", 
      id:'from_Computer'
    },
    {
      text: "Attach from Client’s Attachments", 
      id:'from_Client'
    },
   
  ];
  constructor(
   
    private dialogService: DialogService,
 
  ) {}
  /** Internal event methods **/
 
  onCloseDirectMessageClicked() {
    this.closeAction.emit();
    this.isShownDirectMessage = !this.isShownDirectMessage;
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
}
